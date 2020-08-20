/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "../../context/AppContext";
import CRUDTable from "../components/CRUDTable";
import CRUDForm from "../components/CRUDForm";
import PageHeader from "../components/PageHeader";
import { useHistory } from "react-router-dom";

const PhdPage = () => {
  const history = useHistory();
  const { user, ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { phdStudentService, userService } = ApiServices;
  const [phdStudents, setPhdStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [coSupervisors, setCoSupervisors] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);



  const [inputs, setInputs] = useState({});
  const [action, setAction] = useState("ADDING");

  const columns = ["Directeur de thèse", "Co-Directeur de thèse", "Nom de doctorant", "Prénom de doctorant", "Intitulé de la Thèse", "Cotutelle (CT) - Codirection (CD) ", "Année de 1 ère inscription", "Date de soutenance"];

  const inputsSkeleton = [
    {
      name: "supervisor",
      label: columns[0],
      type: "select",
      options: supervisors,
    },
    {
      name: "coSupervisor",
      label: columns[1],
      type: "select",
      options: coSupervisors,
    },
    { name: "lastName", label: columns[2], type: "input" },
    { name: "firstName", label: columns[3], type: "input" },
    { name: "thesisTitle", label: columns[4], type: "input" },

    { name: "cotutelle", label: columns[5], type: "radio" },
    { name: "start", label: columns[6], type: "input" },
    { name: "end", label: columns[7], type: "date" },
  ];

  const clearInputs = () => {
    setInputs(() => ({
      supervisor_id: "",
      coSupervisor_id: "",
      firstName: "",
      lastName: "",
      thesisTitle: "",
      cotutelle: false,
      start: "",
      end: "",
    }));
  };
  const setSupervisorsAndCoSupervisors = useCallback(async () => {
    try {
      const response = await userService.findAllUsers();
      let sup = [];
      response.data.forEach((researcher) => {
        sup.push({ _id: researcher._id, name: [researcher.firstName, researcher.lastName].join(" ") });
      });
      setCoSupervisors([{ _id: null, name: "Pas de co-directeur" }, ...sup]);
      setSupervisors(sup);
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir des utilisateurs" });
    }
  }, []);

  const updatePhdStudentData = useCallback(async () => {
    try {
      const response = await phdStudentService.findAllPhdStudents();
      if (response.data.length !== 0) {
        const filteredPhdStudents = response.data
          .filter((st) => {
            if (st.coSupervisor === null) {
              return st.supervisor._id.localeCompare(user._id) === 0;
            } else {
              return st.supervisor._id.localeCompare(user._id) === 0 || st.coSupervisor._id.localeCompare(user._id) === 0;
            }
          })
          .map((st) => ({
            ...st,
            coSupervisor: st.coSupervisor === null ? "néant" : [st.coSupervisor.firstName, st.coSupervisor.lastName].join(" "),
            supervisor: [st.supervisor.firstName, st.supervisor.lastName].join(" "),
            cotutelle: st.cotutelle ? "oui" : "non",
          }));
        if (filteredPhdStudents.length === 0) {
          setIsEmpty(true);
        } else {
          setPhdStudents(filteredPhdStudents);
          setIsEmpty(false);
        }
      } else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable de mettre à jour les données des doctorants",
      });
    }
  }, [user]);

  const editPhdStudent = async (student) => {
    const response = await phdStudentService.findstudent(student._id)
    setAction("EDITING");
    setInputs((inputs) => ({
      ...inputs,
      ...student,
      coSupervisor_id:response.data.coSupervisor._id,
      supervisor_id:response.data.supervisor._id
    }));
    if(!response.data.coSupervisor._id.localeCompare(user._id)) {
      let index = supervisors.findIndex(sup => !sup.name.localeCompare(student.supervisor))
      let coIndex = coSupervisors.findIndex(sup => !sup.name.localeCompare([response.data.coSupervisor.firstName,response.data.coSupervisor.lastName].join(" ")))
      document.getElementById('coSupervisor_id').selectedIndex = coIndex
      document.getElementById('supervisor_id').selectedIndex = index
      document.getElementById('coSup').checked = true
      document.getElementById('Co-Directeur de thèse').style.visibility = 'hidden';
      document.getElementById('Directeur de thèse').style.visibility = 'visible';
      }
      if(!response.data.supervisor._id.localeCompare(user._id)) {
        let coIndex = coSupervisors.findIndex(sup => !sup.name.localeCompare(student.coSupervisor))
        let index = supervisors.findIndex(sup => !sup.name.localeCompare([response.data.supervisor.firstName,response.data.supervisor.lastName].join(" ")))
      document.getElementById('supervisor_id').selectedIndex = index
        document.getElementById('coSupervisor_id').selectedIndex = coIndex
        document.getElementById('sup').checked = true
        document.getElementById('Co-Directeur de thèse').style.visibility = 'visible';
        document.getElementById('Directeur de thèse').style.visibility = 'hidden';
        } 
       };

  const addPhdStudent = async () => {
    try {
      if (inputs.supervisor_id !== null) {
        let student = { coSupervisor: inputs.coSupervisor_id, cotutelle: inputs.cotutelle, end: inputs.end, firstName: inputs.firstName, lastName: inputs.lastName, start: inputs.start, supervisor: inputs.supervisor_id, thesisTitle: inputs.thesisTitle };
        console.log("STUDENT", student);
        const response = await phdStudentService.createPhdStudent(student);
        if (response.data) {
          updatePhdStudentData();
          clearInputs();
        }
      } else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de créer le doctorant" });
    }
  };

  const updatePhdStudent = async (student) => {
    try {
      console.log('IN',inputs)
      let newStudent = { ...inputs, cotutelle: inputs.cotutelle.localeCompare("non") === 0 ? false : true, coSupervisor: inputs.coSupervisor_id.localeCompare("néant") === 0 ? null : inputs.coSupervisor_id, supervisor: inputs.supervisor_id };
      console.log("New Student",newStudent)
    
      const response = await phdStudentService.updatePhdStudent({
        ...student,
        ...newStudent,
      });
      if (response.data) {
        setAction("ADDING");
        updatePhdStudentData();
        clearInputs();
      } else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable de mettre à jour les données du doctorant",
      });
    }
  };

  const deletePhdStudent = async (student) => {
    try {
      const response = await phdStudentService.deletePhdStudent(student._id);
      if (response.data) updatePhdStudentData();
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de supprimer le doctorant" });
    }
  };

  const managePhdStudent = ({ _id }) => {
    history.push(`/phdStudent/${_id}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    return action === "ADDING" ? addPhdStudent() : action === "EDITING" ? updatePhdStudent() : updatePhdStudentData();
  };

  const cancelEdit = () => {
    clearInputs();
    setAction("ADDING");
  };

  useEffect(() => {
    setSupervisorsAndCoSupervisors();
    updatePhdStudentData();
    clearInputs();
    console.log(isEmpty);
  }, []);

  return (
    <Fragment>
      <div className="page-header">
        <PageHeader title={`Vos Doctorants Monsieur ${[user.firstName, user.lastName].join(" ")}`} subTitle={`${phdStudents.length} doctorant(s)`} />
      </div>
      <div className="row row-cards row-deck">
       
        <div className="col-md-12">
          <CRUDForm
            {...{
              inputs,
              setInputs,
              inputsSkeleton,
              handleSubmit,
              cancelEdit,
              action,
              twoColumns: "form",
              phdForm: true,
              user:user
            }}
          />
        </div>
        <div className="col-md-12">
          {isEmpty ? (
            <p className="empty-title h3">Vous avez aucun(e) doctorant(e)</p>
          ) : (
            <CRUDTable
              columns={columns}
              data={phdStudents}
              tableSkeleton={inputsSkeleton}
              actions={[
                { name: "Gérer", function: managePhdStudent, style: "primary" },
                { name: "Modifier", function: editPhdStudent, style: "primary" },
                {
                  name: "Supprimer",
                  function: deletePhdStudent,
                  style: "danger",
                },
              ]}
            />
          )}
        </div>
        
      </div>
    </Fragment>
  );
};

export default PhdPage;
