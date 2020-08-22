
import React, {
    Fragment,
    useEffect,
    useState,
    useContext,
    useCallback,
  } from "react";

  import { AppContext } from "../../context/AppContext";
  import PageHeader from "./PageHeader";
  import BudgetForm from "./BudgetForm";
  import C3Chart from "react-c3js";
import StatisticsTable from "../Statistics/components/StatisticsTable";
import BudgetTable from "../Statistics/components/BudgetTable";

  const AddBudget = () => {
  
    const { ApiServices, alertService, user, UserHelper } = useContext(AppContext);
    const { pushAlert } = alertService;
    const { laboratoryService, userService   } = ApiServices;
  
    const [laboratories, setLaboratories] = useState([{budget : 0}]);
    const [budget, setBudget] = useState({});
    const [inputs, setInputs] = useState({});
    const [action, setAction] = useState("ADDING");
    const [chartVersion, setChartVersion] = useState(0);

    const [chart, setChart] = useState({
      data: {
        unload: true,
        x: "x",
        type: "line",
        columns: [],
      },
    });
    const columns = [ "budget"];
    const title = "Ajouter l'historique des budgets"
    const [dateRange, setDateRange] = useState([2015,2016,2017,2018,2019,2020]);
    

  
    const inputsSkeleton = dateRange.map((year, index) =>
      ( {name: year, 'label': year, type: "input"}) 

    )
    ;
  
    const clearInputs = () => {
        setInputs(() => ({
            2015: "",
            2016: "",
            2017: "",
            2018: "",
            2019: "",
            2020: "",
          }));
    };
  
    const updateLaboratoryData = useCallback(async () => {
      let response = await laboratoryService.findAllLaboratories();
     
          response.data.map((laboratory) => {
            if(laboratory.name === user.laboratoriesHeaded[0].name){
              setLaboratories(laboratories=> laboratories.concat(laboratory))
            }
          })
      ;
    }, [laboratoryService,user.laboratoriesHeaded]);
  

       
    const updateLaboratoriesData = useCallback(() => {
      setLaboratories(user.laboratoriesHeaded);
    }, [user.laboratoriesHeaded]);
  

    
   
   
  
    const updateLaboratory = async (laboratory) => {
      let year = new Date().getFullYear()+1;

     console.log(year);
     console.log(inputs.budget);
     laboratory.budget[new Date().getFullYear()+1]=parseInt(inputs.budget);

      try {
        const response = await laboratoryService.updateLaboratory(
         laboratory,
         
        );

  
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
  

    useEffect(() => {
      if(laboratories.length !==0){
      updateLaboratoriesData();
      clearInputs();
    
      }
    }, [ updateLaboratoriesData]);
  
    useEffect(() => {
  
    }, [ columns]);

    const handleSubmit = (event) => {
      event.preventDefault();
      console.log("inputs",inputs);
        setBudget((budget)=>{
            Object.assign(budget,inputs)
        });
      
        console.log("budget",
           budget,
          ); 
          
          
          console.log({
        ...budget,
        ...laboratories[0],
      });

      let exp = laboratories[0];
      exp.budget=budget;
      console.log(exp);
      
      updateLaboratory( exp);

      updateLaboratoriesData();

    };
  
    const cancelEdit = () => {
      clearInputs();
      setAction("ADDING");
    };
  
    return (
      <Fragment>
        <div className="page-header">
          <PageHeader
           title={`Ajouter le budget de votre laboratoire ${UserHelper.userHeadedLaboratories(
            user
          )}`}
            /*subTitle={` Budget de lannée prochaine : ${laboratories[0].budget[new Date().getFullYear()+1]===undefined? 0:laboratories[0].budget[new Date().getFullYear()+1]} DH`}*/
          />
        </div>
        <div >
            <BudgetForm
              {...{
                inputs,
                setInputs,
                inputsSkeleton,
                handleSubmit,
                cancelEdit,
                action,
                title,
              }}
            />
          </div>

         
      </Fragment>
    );
  };
  
  export default AddBudget;
  