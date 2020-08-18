/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    Fragment,
    useEffect,
    useState,
    useContext,
    useCallback,
  } from "react";
  import { AppContext } from "../../context/AppContext";
  import CRUDTable from "../components/CRUDTable";
  import CRUDForm from "../components/CRUDForm";
  import PageHeader from "../components/PageHeader";
  import { useHistory } from "react-router-dom";
import BudgetForm from "../components/BudgetForm";
  
  const LaboratoryBudget = () => {
    const history = useHistory();
  
    const { ApiServices, alertService, user, UserHelper } = useContext(AppContext);
    const { pushAlert } = alertService;
    const { laboratoryService, establishmentService,  } = ApiServices;
  
    const [laboratories, setLaboratories] = useState([{budget : 0}]);
    const [establishments, setEstablishments] = useState([]);
  
    const [inputs, setInputs] = useState({});
    const [action, setAction] = useState("ADDING");
  
    const columns = [ "budget"];
  
    const inputsSkeleton = [
      { name: "budget", label: columns[0], type: "input" },
    
    ];
  
    const clearInputs = () => {
      setInputs((inputs) => ({
        budget: 0,
      }));
    };
  
    const updateLaboratoriesData = useCallback(() => {
      setLaboratories(user.laboratoriesHeaded);
    }, [user.laboratoriesHeaded]);
  
    
  
    const updateEstablishmentsData = useCallback(async () => {
      try {
        const response = await establishmentService.findAllEstablishments();
        if (response.data) setEstablishments(response.data);
        else throw Error();
      } catch (error) {
        pushAlert({
          message: "Incapable d'obtenir les données des établissements",
        });
      }
    }, []);
  
    useEffect(() => {
      updateLaboratoriesData();
      updateEstablishmentsData();
      clearInputs();
      
    }, [updateEstablishmentsData, updateLaboratoriesData]);
  
    const editLaboratory = (laboratory) => {
      setAction("EDITING");
      setInputs((inputs) => ({
        ...inputs,
        ...laboratory,
      }));
    };
  
    const manageLaboratory = ({ _id }) => {
      history.push(`/laboratory/${_id}`);
    };
  
   
  
    const updateLaboratory = async (laboratory) => {
      laboratory.budget=inputs.budget;
      try {
        const response = await laboratoryService.updateLaboratory({
          ...laboratory,
          ...inputs,
        });
  
        if (response.data) {
          setAction("ADDING");
          updateLaboratoriesData();
          clearInputs();
        } else throw Error();
      } catch (error) {
        pushAlert({
          message: "Incapable de mettre à jour les données de laboratoire",
        });
      }
    };
  
  
    const handleSubmit = (event) => {
      event.preventDefault();

      console.log({
        ...inputs,
        ...laboratories[0],
      });
      
      updateLaboratory(laboratories[0]);
    };
  
    const cancelEdit = () => {
      clearInputs();
      setAction("ADDING");
    };
  
    return (
      <Fragment>
        <div className="page-header">
          <PageHeader
           title={`Budget de votre laboratoire ${UserHelper.userHeadedLaboratories(
            user
          )}`}
            subTitle={` Budget actuel ${laboratories[0].budget===undefined? 0:laboratories[0].budget} DH`}
          />
        </div>
        <div className="row row-cards row-deck">
         {/* <div className="col-md-8">
            <CRUDTable
              columns={columns}
              data={laboratories}
              tableSkeleton={inputsSkeleton}
              actions={[
              
                { name: "Modifier budget", function: editLaboratory, style: "primary" },
                
              ]}
            />
          </div>*/}
          <div className="col-md-8">
            <BudgetForm
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
  
  export default LaboratoryBudget;
  