
import React, {
    Fragment,
    useEffect,
    useState,
    useContext,
    useCallback,
  } from "react";

  import { AppContext } from "../../context/AppContext";
  import PageHeader from "../components/PageHeader";
  import BudgetForm from "../components/BudgetForm";
  import C3Chart from "react-c3js";
import StatisticsTable from "../Statistics/components/StatisticsTable";
import BudgetTable from "../Statistics/components/BudgetTable";
import AddBudget from "../components/AddBudget";

  const LaboratoryBudget = () => {
  
    const { ApiServices, alertService, user, UserHelper } = useContext(AppContext);
    const { pushAlert } = alertService;
    const { laboratoryService, userService   } = ApiServices;
  
    const [laboratories, setLaboratories] = useState([{title : "t"}]);
  
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
    const [dateRange, setDateRange] = useState({
      start: 2015,
      end:new Date().getFullYear()+1,
    });
  
    const title = "Ajouter budget de l'année prochaine"
  
    const inputsSkeleton = [
      { name: "budget", label: columns[0], type: "input" },
    
    ];
  
    const clearInputs = () => {
      setInputs((inputs) => ({

        budget: "",
      }));
    };
    const updateLaboratoriesData = useCallback(async () => {
      let response = await laboratoryService.findAllLaboratories();
      let newlabs =[];
          if(response.data){
          response.data.map((laboratory) => {
       
            if(laboratory.name === user.laboratoriesHeaded[0].name){
             newlabs.push(laboratory);
            
              setLaboratories(newlabs);
              console.log(laboratories);
            }
          })}
      ;
    }, [laboratoryService]);
  

       
  
       
    const updateLaboratoryData = useCallback(() => {
      setLaboratories(user.laboratoriesHeaded);
    }, [user.laboratoriesHeaded]);
  

    const updateChart = useCallback(() => {
      let yearsRange = [];
      let budget ={2015 : 0}
      if(laboratories[0].budget!== undefined)
      {budget = laboratories[0].budget;}
     

      for (let i = 2015; i <= new Date().getFullYear()+1; i++) yearsRange.push(i);
  
      const columns = [["budget"].concat(yearsRange.map((year) =>budget[year] ?? 0))]
      .concat([["x"].concat(yearsRange)]);
      setChart(() => ({
        data: {
          x: "x",
          type: "line",
          columns,
        }
      }))
      setChartVersion(chartVersion+1);
    },[laboratories]);
  
    
   
   
  
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
      
      clearInputs();
      updateChart();
      }
    }, [ updateLaboratoriesData, updateChart]);
  
    useEffect(() => {
      updateChart();
    }, [ laboratories ]);

    useEffect(() => {
     
      
        updateLaboratoriesData();
      
    }, []);
  
    const handleSubmit = (event) => {
      event.preventDefault();

      console.log(
       
        laboratories[0],
      
      );
      
      updateLaboratory(laboratories[0]);

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
           title={`Budget de votre laboratoire ${UserHelper.userHeadedLaboratories(
            user
          )}`}
            /*subTitle={` Budget de lannée prochaine : ${laboratories[0].budget[new Date().getFullYear()+1]===undefined? 0:laboratories[0].budget[new Date().getFullYear()+1]} DH`}*/
          />
        </div>
        <div >
         {(laboratories.length !==0 && laboratories[0].budget!== undefined)&&
            <BudgetForm
              {...{
                inputs,
                setInputs,
                inputsSkeleton,
                handleSubmit,
                cancelEdit,
                action,
                title
              }}
            />}
          </div>
        {laboratories[0].budget === undefined && <AddBudget/>}
          <br/>
          
          <div className="table-responsive">
          <div className="card">    
          {(laboratories.length !==0 && laboratories[0].budget!== undefined)&& <BudgetTable
                  labBudget={laboratories[0].budget}
                  dateRange={dateRange}
                />
          }
              </div>   
            </div> 
            <br/>  
        <div className="card">        
              <div
                id="apexchartDatas28b504"
                className="apexchartDatas-canvas apexchartDatas28b504 apexchartDatas-theme-light"
              >
          {(laboratories.length !==0 && laboratories[0].budget!== undefined)&&
                  <C3Chart
                   key={chartVersion}
                   data={chart.data}
                   unloadBeforeLoad={true}
                  title={{
                    text: "Budget par année",
                        }}
                  legend={{
         
                   show: true,
                        }}
                      />}
                
               
              </div>
            </div>
          

      </Fragment>
    );
  };
  
  export default LaboratoryBudget;
  