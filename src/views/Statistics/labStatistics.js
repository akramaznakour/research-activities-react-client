/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useCallback, Fragment } from "react";
import PageHeader from "../components/PageHeader";
import StatisticsTable from "./components/StatisticsTable";
import { AppContext } from "../../context/AppContext";
import StatisticsFilter from "./components/StatisticsFilter";

import C3Chart from "react-c3js";
import "c3/c3.css";
import LabFilter from "../components/LabFilter";
import ResearchersFilter from "../components/ResearchersFilter";
import { Link } from "react-router-dom";

const LabStatistics = () => {
  const [researchersStatistics, setResearchersStatistics] = useState([]);
  const [labsStatistics, setLabsStatistics] = useState([]);

   const [selectedLabs, setSelectedLabs] = useState(null);
  const [
    filteredResearchersStatistics,
    setFilteredResearchersStatistics,
  ] = useState([]);

  const [dateRange, setDateRange] = useState({
    start: 2010,
    end: new Date().getFullYear(),
  });

  const [filter, setFilter] = useState(null);
  const [filteringOptions, setFilteringOptions] = useState(null);

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user, ApiServices } = useContext(AppContext);
  const { statisticsService, userService, laboratoryService } = ApiServices;
  const [laboratories, setLaboratories] = useState([]);
  const [columns, setColumns] = useState([]);
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
  
    
  

  

  const getTeamData = (async (abbreviation) => {
    try {
      
      const response = await statisticsService.getStatistics({[`team_abbreviation`]: abbreviation});
      if (response.data)  setResearchersStatistics(researcherStatistics => researcherStatistics.concat(response.data));
      else throw Error();
    } catch (error) {
 
    }
    console.log(researchersStatistics);
  });


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
    for (let i = dateRange.start; i <= dateRange.end; i++){ yearsRange.push(i); teamStats[i]=0};   

    researchersStatistics
    .map((usersStatistic) =>
    
     {if(usersStatistic != null)
      { yearsRange.map((year)=>{
       
        teamStats[year]=teamStats[year]+(usersStatistic.yearlyPublications[year] ?? 0)
       })
       console.log(teamStats);}
       
    } 
    );
    if(selectedLabs != null){
      setLabsStatistics( teamsStatistics=> teamsStatistics.concat({
        'lab': selectedLabs.abbreviation,
        'publications': teamStats
      })
       );
    }
  });

  const updateChart =(async() => {
    let yearsRange = [];
    let teamStats= {};
    for (let i = dateRange.start; i <= dateRange.end; i++){ yearsRange.push(i); teamStats[i]=0};   
  
      console.log('here');
    const columns =
      
      
    labsStatistics
      .map((labStatistics) =>
      
        [labStatistics.lab].concat(
          yearsRange.map((year) =>  labStatistics.publications[year] ?? 0)
        ) 
      )
      
      .concat([["x"].concat(yearsRange)]);

    setChart(() => ({
     
      data:{
      x: "x",
        columns,
        type: 'line',
      
      
    }}));
    console.log(columns);
    setChartVersion(chartVersion + 1);
  
  });
  



  const updateStatistics = () => {}; 

  useEffect(() => {
    updateLaboratoryData(); 
    console.log(user);
  }, [user]);

  useEffect( () => {if (selectedLabs != null){
    getLabData( selectedLabs);
 }
 }, [ selectedLabs]);

  useEffect( () => {if (selectedLabs != null){
     
    updateLabsStatistics();
   
  }
  }, [researchersStatistics]);
 


  useEffect(() => { 
    console.log(researchersStatistics)
    updateChart();
    }, [selectedLabs,JSON.stringify(researchersStatistics),JSON.stringify(labsStatistics)]);

    useEffect(() => { 
      console.log(labsStatistics)
     }, [labsStatistics])

  useEffect(() => {
    if (selectedLabs != null){
    updateChart();
    console.log(selectedLabs);
    console.log(researchersStatistics);
    }
  },[selectedLabs,dateRange.end,
    dateRange.start,JSON.stringify(labsStatistics)])


 

  

  return (
    <div className="container">
      
      <div className="row">
        <div className="col-md-4">

          <StatisticsFilter
            dateRange={dateRange}
            setDateRange={setDateRange}
            updateStatistics={updateStatistics}
          />
         
          <LabFilter {...{ laboratories , setSelectedLabs, selectedLabs}}/>
        </div>
          <div className="col-md-8">
          <div className="card">
            <div id="chartData-development-activity" className="mt-4">
              <div
                id="apexchartDatas28b504"
                className="apexchartDatas-canvas apexchartDatas28b504 apexchartDatas-theme-light"
              >
                 
                  <C3Chart
                    key={chartVersion}
                    data={chart.data}
                    unloadBeforeLoad="true"
                    title={{
                      text: "Nombre des publications par année",
                    }}
                    legend={{
                      show: true,
                    }}
                  />
                
              </div>
            </div>
          

        </div>
      </div>
        </div>
        </div>
     
   
  );
};


export default LabStatistics;
