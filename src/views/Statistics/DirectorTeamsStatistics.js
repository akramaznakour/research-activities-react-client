/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useCallback } from "react";
import TeamFilter from "../components/TeamFilter";
import PageHeader from "../components/PageHeader";
import { AppContext } from "../../context/AppContext";
import StatisticsFilter from "./components/StatisticsFilter";

import C3Chart from "react-c3js";
import "c3/c3.css";
import LabFilter from "../components/LabFilter";
import NoResultFound from "../components/NoResultFound";

const TeamsStatistics = () => {
  const [researchersStatistics, setResearchersStatistics] = useState([]);
  const [teamsStatistics, setTeamsStatistics] = useState([]);

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
  const { statisticsService, userService } = ApiServices;

  const [chartVersion, setChartVersion] = useState(0);
  const [chart, setChart] = useState({
    data: {
      unload: true,
      x: "x",
      type: "bar",
      columns: [],
    },
  });

  const getTeamStatistics = useCallback(()=>{
    let yearsRange = [];
    let teamStats= {};
    for (let i = dateRange.start; i <= dateRange.end; i++){ yearsRange.push(i); teamStats[i]=0};  
    filteredResearchersStatistics
      .map((usersStatistic) =>
      
       {
         yearsRange.map((year)=>{

          teamStats[year]=teamStats[year]+(usersStatistic.yearlyPublications[year] ?? 0)
         })
         
       }
         
        
      );
      console.log(teamStats);
      if(filter != null){
         setTeamsStatistics( teamsStatistics=> teamsStatistics.concat({
           'team': filter.team_abbreviation,
           'publications': teamStats
         })
          );

         console.log(filter.team_abbreviation);
         console.log(teamsStatistics);
      }
  })

  const updateChart = useCallback(() => {
    let yearsRange = [];
    let teamStats= {};
    for (let i = dateRange.start; i <= dateRange.end; i++){ yearsRange.push(i); teamStats[i]=0};   
    
      const columns = teamsStatistics
      .map((teamStatistics) =>
      
        [teamStatistics.team].concat(
          yearsRange.map((year) =>  teamStatistics.publications[year] ?? 0)
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
  }, [
    chartVersion,
    dateRange.end,
    dateRange.start,
    filteredResearchersStatistics,
  ]);

  const updateFilteringOptionsData = useCallback(async () => {
    try {
      let  response = await userService.getDirectorFilteringOptions(user._id);
      if (response.data) setFilteringOptions(response.data);
      else throw Error();
    } catch (error) {
      
    }
  }, [user._id]);

  const updateFollowedUsersData = useCallback(async () => {
    try {
      const response = await statisticsService.getStatistics(filter);
      if (response.data) setResearchersStatistics(response.data);
      else throw Error();
    } catch (error) {
 
    }
  }, [filter]);

  const updateStatistics = () => {};
  useEffect(() => {
    updateChart();
  }, [filteredResearchersStatistics, dateRange, teamsStatistics]);

  useEffect(() => {
    getTeamStatistics();
  }, [filteredResearchersStatistics, dateRange]);


  useEffect(() => {
    updateFilteringOptionsData();
  }, [updateFilteringOptionsData]);

  useEffect(() => {
    if (!filter) return;
    if (!isSearchActive) setIsSearchActive(true);
    updateFollowedUsersData();
  }, [filter, isSearchActive, updateFollowedUsersData]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredResearchersStatistics(researchersStatistics);
      return;
    }
    const a = researchersStatistics.filter(
      (user) => user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    );
    setFilteredResearchersStatistics(a);
  }, [searchTerm, researchersStatistics]);

  
  return (
    <div className="container">
      <PageHeader
        title="Statistiques"
        subTitle={filteredResearchersStatistics.length + " chercheurs"}
      />
      <div className="row">
        <div className="col-md-4">
          <StatisticsFilter
            dateRange={dateRange}
            setDateRange={setDateRange}
            updateStatistics={updateStatistics}
          />
          <TeamFilter
            {...{
              filter,
              setFilter,
              filteringOptions,
              setSearchTerm,
              searchTerm,
              isSearchActive,
              setIsSearchActive,
            }}
          />
        </div>
        <div className="col-md-8">
          <div className="card">
            <div id="chartData-development-activity" className="mt-4">
              <div
                id="apexchartDatas28b504"
                className="apexchartDatas-canvas apexchartDatas28b504 apexchartDatas-theme-light"
              >
                 {filteredResearchersStatistics.length > 0 && (
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
                  )}
                  {filteredResearchersStatistics.length === 0 && (
                  <NoResultFound query={searchTerm} />
                )}
             
              </div>
            </div>
            
            <div className="resize-triggers">
              <div className="expand-trigger">
                <div style={{ width: "579px", height: "0px" }}></div>
              </div>
              <div className="contract-trigger"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsStatistics;
