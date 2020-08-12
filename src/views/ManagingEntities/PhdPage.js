/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "../../context/AppContext";
import CRUDTable from "../components/CRUDTable";
import CRUDForm from "../components/CRUDForm";
import PageHeader from "../components/PageHeader";
import { useHistory } from "react-router-dom";

const PhdPage = () => {
  const history = useHistory();
  const { user, ApiServices, UserHelper, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { phdStudentService, userService } = ApiServices;
  const [phdStudents, setPhdStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [coSupervisors, setCoSupervisors] = useState([]);

  const [inputs, setInputs] = useState({});
  const [action, setAction] = useState("ADDING");

  const columns = ["Nom de doctorant", "Prénom de doctorant", "Intitulé de la Thèse", "Directeur de thèse", "Co-Directeur de thèse", "Cotutelle (CT) - Codirection (CD) -Non", "Année de 1 ère inscription", "Date de soutenance"];

  const inputsSkeleton = [
    { name: "lastName", label: columns[0], type: "input" },
    { name: "firstName", label: columns[1], type: "input" },
    { name: "thesisTitle", label: columns[2], type: "input" },
    {
      name: "supervisor",
      label: columns[3],
      type: "select",
      options: supervisors,
    },
    {
      name: "coSupervisor",
      label: columns[4],
      type: "select",
      options: coSupervisors,
    },
    { name: "cotutelle", label: columns[5], type: "input" },
    { name: "start", label: columns[6], type: "input" },
    { name: "end", label: columns[7], type: "input" },
  ];

  const clearInputs = () => {
    setInputs(() => ({
      firstName: "",
      lastName: "",
      thesisTitle: "",
      supervisor_id: "",
      coSupervisor_id: "",
      cotutelle: "",
      start: "",
      end: "",
    }));
  };
  const findAllUsers = useCallback(async () => {
    try {
      const response = await userService.findAllUsers();
      let coSup = [{ _id: null }];
      response.data.forEach((user) => {
        coSup.push({ _id: user._id, name: [user.firstName, user.lastName].join(" ") });
      });
      setCoSupervisors(coSup);
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir des utilisateurs" });
    }
  }, []);

  const updatePhdStudentData = useCallback(async () => {
    try {
      const response = await phdStudentService.findAllPhdStudents();
      if (response.data) {
        const filteredData = response.data.filter((st) => {
          if (st.coSupervisor === null) {
            return st.supervisor._id.localeCompare(user._id) === 0;
          } else {
            return st.supervisor._id.localeCompare(user._id) === 0 || st.coSupervisor._id.localeCompare(user._id) === 0;
          }
        });
        // .filter((st) => st.supervisor._id.localeCompare(user._id) === 0 || st.coSupervisor._id.localeCompare(user._id) === 0);
        const filteredPhdStudents = filteredData.map((st) => ({
          ...st,
          coSupervisor: st.coSupervisor === null ? "néant" : [st.coSupervisor.firstName, st.coSupervisor.lastName].join(" "),
          supervisor: [st.supervisor.firstName, st.supervisor.lastName].join(" "),
          cotutelle: st.cotutelle ? "oui" : "non",
        }));
        let sup = [];
        response.data.forEach((st) => {
          let supervisor = { _id: user._id, name: [user.firstName, user.lastName].join(" ") };
          sup.push(supervisor);
        });
        setSupervisors(sup);

        setPhdStudents(filteredPhdStudents);
      } else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable de mettre à jour les données des doctorants",
      });
    }
  }, [user]);

  const editPhdStudent = (student) => {
    setAction("EDITING");
    setInputs((inputs) => ({
      ...inputs,
      ...student,
    }));
  };

  const addPhdStudent = async () => {
    try {
      let student = { coSupervisor: inputs.coSupervisor_id, cotutelle: inputs.cotutelle.localeCompare("non") === 0 ? false : true, end: inputs.end, firstName: inputs.firstName, lastName: inputs.lastName, start: inputs.start, supervisor: inputs.supervisor_id, thesisTitle: inputs.thesisTitle };
      const response = await phdStudentService.createPhdStudent(student);
      if (response.data) {
        updatePhdStudentData();
        clearInputs();
      } else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de créer le doctorant" });
    }
  };

  const updatePhdStudent = async (student) => {
    try {
      let newStudent = { ...inputs, cotutelle: inputs.cotutelle.localeCompare("non") === 0 ? false : true, coSupervisor: inputs.coSupervisor_id.localeCompare("") === 0 ? null : inputs.coSupervisor_id, supervisor: inputs.supervisor_id };
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
    findAllUsers();
    updatePhdStudentData();
    clearInputs();
  }, []);

  return (
    <Fragment>
      <div className="page-header">
        <PageHeader title={`Vos Doctorants Monsieur ${[user.firstName, user.lastName].join(" ")}`} subTitle={`${phdStudents.length} doctorant(s)`} />
      </div>
      <div className="row row-cards row-deck">
        <div className="col-md-12">
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
        </div>
        <div className="col-md-7">
          <CRUDForm
            {...{
              inputs,
              setInputs,
              inputsSkeleton,
              handleSubmit,
              cancelEdit,
              action,
            }}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default PhdPage;
