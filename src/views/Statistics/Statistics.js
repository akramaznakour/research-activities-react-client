/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useCallback } from "react";
import ResearchersFilter from "../components/ResearchersFilter";
import PageHeader from "../components/PageHeader";
import StatisticsTable from "./components/StatisticsTable";
import { AppContext } from "../../context/AppContext";
import StatisticsFilter from "./components/StatisticsFilter";

import C3Chart from "react-c3js";
import "c3/c3.css";
import NoResultFound from "../components/NoResultFound";

const ResearchersStatistics = () => {
  const [researchersStatistics, setResearchersStatistics] = useState([]);
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

  const { user, ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
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

  const updateChart = useCallback(() => {
    let yearsRange = [];
    for (let i = dateRange.start; i <= dateRange.end; i++) yearsRange.push(i);

    const columns = filteredResearchersStatistics
      .map((usersStatistic) =>
        [usersStatistic.name].concat(
          yearsRange.map((year) => usersStatistic.yearlyPublications[year] ?? 0)
        )
      )
      .concat([["x"].concat(yearsRange)]);

    setChart(() => ({
      data: {
        x: "x",
        type: "bar",
        columns,
      },
    }));

    setChartVersion(chartVersion + 1);
  }, [
    chartVersion,
    dateRange.end,
    dateRange.start,
    filteredResearchersStatistics,
  ]);

  const updateFilteringOptionsData = useCallback(async () => {
    try {
      const response = await userService.getFilteringOptions(user._id);
      if (response.data) setFilteringOptions(response.data);
      else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable de mettre à jour les options de filtrage",
      });
    }
  }, [user._id]);

  const updateFollowedUsersData = useCallback(async () => {
    try {
      const response = await statisticsService.getStatistics(filter);
      if (response.data) setResearchersStatistics(response.data);
      else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable de mettre à jour obtenir les statistiques",
      });
    }
  }, [filter]);

  const updateStatistics = () => {};
  useEffect(() => {
    updateChart();
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
          <ResearchersFilter
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
            <div className="table-responsive">
              {filteredResearchersStatistics.length > 0 && (
                <StatisticsTable
                  usersStatistics={filteredResearchersStatistics}
                  dateRange={dateRange}
                />
              )}
            </div>
            <div className="resize-triggers">
              <div className="expand-trigger">
                <div style={{ width: "579px", height: "460px" }}></div>
              </div>
              <div className="contract-trigger"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchersStatistics;
