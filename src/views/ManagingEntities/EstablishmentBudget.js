/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useCallback, Fragment } from "react";
import { AppContext } from "../../context/AppContext";

import C3Chart from "react-c3js";
import "c3/c3.css";
import LabFilter from "../components/LabFilter";
import NoResultFound from "../components/NoResultFound";
import StatisticsFilter from "../Statistics/components/StatisticsFilter";
import BudgetTable from "../Statistics/components/BudgetTable";
import BudgetFilter from "../components/BudgetFilter";

const EstablishmentBudget = () => {
  const [researchersStatistics, setResearchersStatistics] = useState([]);
  const [labsStatistics, setLabsStatistics] = useState([]);

   const [selectedLabs, setSelectedLabs] = useState([]);
  const [
    filteredResearchersStatistics,
    setFilteredResearchersStatistics,
  ] = useState([]);

  const [dateRange, setDateRange] = useState({
    start: 2015,
    end: new Date().getFullYear()+1,
  });

  const [filter, setFilter] = useState(null);
  const [filteringOptions, setFilteringOptions] = useState(null);

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user, ApiServices } = useContext(AppContext);
  const { statisticsService, userService, laboratoryService, establishmentService } = ApiServices;
  const [laboratories, setLaboratories] = useState([]);
  const [establishments, setEstablishments] = useState([]);

  const [columns, setColumns] = useState([]);
  const [currentLab, setCurrentLab] = useState(null);

  const [chartVersion, setChartVersion] = useState(0);
  const [chart, setChart] = useState({
    data: {
      unload: true,
      x: "x",
      type: "line",
      columns: [],
    },
  });

 
  const getLabData = useCallback(async (lab) =>{
    setResearchersStatistics([]);
    Promise.all(lab.teams.map(
      (async (team)=>{
        const response = await statisticsService.getStatistics({[`team_abbreviation`]: team.abbreviation});
      if (response.data)  setResearchersStatistics(researcherStatistics => researcherStatistics.concat(response.data));
      else throw Error();
     
 
    
      })
    ))
  },[statisticsService])
  
    const deleteLab = (abbreviation)=> {  
      console.log("deleting");
      for(let i in labsStatistics){
        if(labsStatistics[i].lab === abbreviation){
          if(i===0){
            console.log(i);
            labsStatistics.shift();
          }
          console.log(i);
          labsStatistics.splice(i , 1);
          
        }
      }    
    }
  

    const updateEstablishmentData = useCallback(async () => {
      let response = await establishmentService.findAllEstablishments();
      setEstablishments(
          response.data.map((establishment) => ({
            ...establishment,
           
          }))
      );
    }, [establishmentService]);
  

  


  const updateLaboratoryData = useCallback(async () => {
    let response = await laboratoryService.findAllLaboratories();
    setLaboratories(
        response.data.map((laboratory) => ({
          ...laboratory,
          establishment: laboratory.establishment.name,
        }))
    );
  }, [laboratoryService]);

  const updateLabsStatistics = useCallback (async() =>{
    let yearsRange = [];
    let teamStats= {};
    console.log("in lab");

    for (let i = dateRange.start; i <= dateRange.end; i++){ yearsRange.push(i); teamStats[i]=0};   

    researchersStatistics
    .map((usersStatistic) =>
    
     {if(usersStatistic != null)
      { yearsRange.map((year)=>{
       
        teamStats[year]=teamStats[year]+(usersStatistic.yearlyPublications[year] ?? 0)
       })
       
    ;}
   
    }
       
    
    );
   
      console.log(teamStats);
      console.log(currentLab);
    
        console.log("heere");
        if(currentLab!== null )
        
        {
          deleteLab(currentLab.abbreviation);
        }
        
        if(labsStatistics.length <=selectedLabs.length && selectedLabs.length>0)

      {
        console.log("adding to selected labs");
        console.log(teamStats);
        setLabsStatistics( teamsStatistics=> teamsStatistics.concat({
        'lab': selectedLabs[selectedLabs.length-1].abbreviation,
        'publications': teamStats
      })
       );}
    
 
  });

  const updateChart = useCallback(() => {
    let yearsRange = [];
    console.log(selectedLabs);
   {    console.log(currentLab);

        console.log("in");
        let budget=currentLab.budget;
     console.log(budget);

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
}
  },[laboratories, currentLab]);
  



  const updateStatistics = () => {}; 

  useEffect(() => {
    updateLaboratoryData(); 
   
  }, [user]);

  useEffect(() => {
   
    updateEstablishmentData();
   
  }, [user]);

  useEffect( () => {if (selectedLabs.length !== 0){
    getLabData( currentLab);
    console.log("currentLab");
   console.log(currentLab);
   updateChart();
 }
 }, [ selectedLabs]);

  useEffect( () => {
     
    updateLabsStatistics();
   
  }, [researchersStatistics, selectedLabs]);
 


  useEffect(() => { 
   if(selectedLabs.length !==0)
    updateChart();
    }, [selectedLabs,JSON.stringify(researchersStatistics),JSON.stringify(labsStatistics)]);

    useEffect(() => { 
      console.log(labsStatistics)
     }, [labsStatistics])

  useEffect(() => {
    if (selectedLabs != null){
        if(selectedLabs.length !==0)
    updateChart();
  
    }
  },[dateRange.end,
    dateRange.start,JSON.stringify(labsStatistics)])

    useEffect(() => { 
      console.log(selectedLabs);
      updateLabsStatistics();
     }, [selectedLabs])
 

  

  return (
    <div className="container">
      
      <div className="row">
        <div className="col-md-5">

         
        
          <BudgetFilter {... {laboratories, establishments, selectedLabs, setSelectedLabs, currentLab, setCurrentLab}}/>
       
        
        </div>
          <div className="col-md-7">
          <div className="card">
            <div id="chartData-development-activity" className="mt-4">
               
            {(selectedLabs.length !==0)&&
            
                <BudgetTable
                  labBudget={currentLab.budget}
                  dateRange={dateRange}
                />}
                 {labsStatistics.length === 0 && (
                  <NoResultFound query={searchTerm} />
                )}
              </div>   
            </div>   
        <div className="card">        
              <div
                id="apexchartDatas28b504"
                className="apexchartDatas-canvas apexchartDatas28b504 apexchartDatas-theme-light"
              >
         {(selectedLabs.length !==0)&&
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
                      />
                    }
               
              </div>
              </div>
            </div>
                    

        </div>
      </div>
 
     
   
  );
};


export default EstablishmentBudget;
