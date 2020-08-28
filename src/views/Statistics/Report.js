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

const Report = () => {
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
  const { statisticsService, userService, scraperService } = ApiServices;

  

  const getPublicationDetails = useCallback(async(publication) =>{
    try {
      console.log("getting details");
      let jouranlName = publication.title;
      const jouranlNameQuery = jouranlName.replace("/", "").replace("\\", "");
      const response = await scraperService.getJournalData(jouranlNameQuery);
      if (response.data.error || response.data.status === 404) {
      console.log("error")
        }
       else {
        console.log("data",response.data)
          }
      }
      catch(error){

      }
    
});

  
  const updateFilteringOptionsData = useCallback(async () => {
    try {

      let response = await userService.getFilteringOptions(user._id);
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
  
  }, [filteredResearchersStatistics, dateRange, teamsStatistics]);

  useEffect(() => {
 
    console.log(researchersStatistics);
  }, [filteredResearchersStatistics, dateRange]);


  useEffect(() => {
    console.log(researchersStatistics);

    updateFilteringOptionsData();
  }, [updateFilteringOptionsData]);

  useEffect(() => {
    if (!filter) return;
    if (!isSearchActive) setIsSearchActive(true);
    updateFollowedUsersData();
    console.log(researchersStatistics);
    getPublicationDetails({ title: "Performance Evaluation of Low-Power Wide Area based on LoRa Technology for Smart Metering",
    year: "2019" })
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
    console.log(researchersStatistics);
     
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
       </div>
    </div>
  );
};

export default Report;
