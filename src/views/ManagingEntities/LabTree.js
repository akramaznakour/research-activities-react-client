import React, { useEffect, Fragment, useContext, useState, useCallback } from "react";
import PageHeader from "../components/PageHeader";
import { AppContext } from "../../context/AppContext";
import OrgChart from "./mychart";

const LabTree = () => {
  const { user, ApiServices, UserHelper } = useContext(AppContext);
  const { teamService, userService } = ApiServices;

  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [nodes, setNodes] = useState([]);

  const updateTeamData = useCallback(() => {
    teamService.findAllTeams().then((response) => {
      const filteredLaboratoiresIds = user.laboratoriesHeaded.map(({ _id }) => _id);

      const filteredTeams = response.data
        .filter((team) => filteredLaboratoiresIds.indexOf(team.laboratory_id) !== -1)
        .map((team) => ({
          ...team,
          laboratory: team.laboratory.name,
        }));
      setTeams(filteredTeams);
    });
  }, [teamService, user.laboratoriesHeaded]);

  useEffect(() => {
    let nodes = [{ id: 0, name: [user.firstName, user.lastName].join(" "), title: `Chef de laboratoire ${UserHelper.userHeadedLaboratories(user)}`, img: "https://cdn.balkan.app/shared/empty-img-white.svg" }];
    if (teams.length > 0) {
      setIsLoading(true);
      (async function getHeadNames() {
        for (const team of teams) {
          let name;
          if (typeof team.head_id !== "undefined" || team.head_id === null) {
            let res = await userService.findUser(team.head_id);
            name = [res.data.firstName, res.data.lastName].join(" ");
            nodes.push({ id: team._id, name: team.name, pid: 0, tags: ["members-group", "group"] }, { id: team.head_id, stpid: team._id, pid: 0, name: name, title: "chef d'équipe", img: "https://cdn.balkan.app/shared/empty-img-white.svg" });
          } else {
            name = null;
          }
        }

        setNodes(nodes);
      })().catch((err) => console.log(err));
      (async function getNames() {

        for (const team of teams) {
          if(team.teamMemberShip.length === 0){nodes.push({ id: team._id, name: team.name, pid: 0, tags: ["members-group", "group"] }, { id: Math.floor(Math.random() * 1000000000), stpid: team._id, pid: 0, title: "Cette équipe n'a aucun membre" });}


          for (const member of team.teamMemberShip) {
            let res = await userService.findUser(member.user_id);
            let name = [res.data.firstName, res.data.lastName].join(" ");
            if (member.user_id !== team.head_id && typeof team.head_id !== "undefined") {
              nodes.push({ id: member.user_id, stpid: team._id, pid: team.head_id, name: name, img: "https://cdn.balkan.app/shared/empty-img-white.svg" });
            }
            if (typeof team.head_id === "undefined" && member._id.localeCompare(team.teamMemberShip[0]._id) === 0) {
              nodes.push({ id: team._id, name: team.name, pid: 0, tags: ["members-group", "group"] }, { id: member.user_id, stpid: team._id, pid: 0, name: name, img: "https://cdn.balkan.app/shared/empty-img-white.svg" });
            }
            if (typeof team.head_id === "undefined" && member._id.localeCompare(team.teamMemberShip[0]._id) !== 0) {
              nodes.push({ id: member.user_id, stpid: team._id, pid: team.teamMemberShip[0]._id, name: name, img: "https://cdn.balkan.app/shared/empty-img-white.svg" });
            }
          }
        }

        setIsLoading(false);
      })().catch((err) => console.log("ERROR", err));
      console.log("NODES", nodes);
      setNodes(nodes);
    }
  }, [teams, user, UserHelper, userService]);

  useEffect(() => {
    updateTeamData();
  }, [updateTeamData]);

  return (
    <Fragment>
      <div className="page-header">
        <PageHeader title={`Organigramme de laboratoire ${UserHelper.userHeadedLaboratories(user)}`} />
      </div>
      <div style={{ height: "100%" }}>{!isLoading ? <OrgChart name={["Laboratoire",UserHelper.userHeadedLaboratories(user)].join(' ')} nodes={nodes} /> : "L'organigramme se charge ..."}</div>
    </Fragment>
  );
};

export default LabTree;
