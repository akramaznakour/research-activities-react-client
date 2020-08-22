/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  Fragment
} from "react";
import { useHistory } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import UserListItem from "../Author/components/UserListItem";

const Laboratory = () => {
  const { laboratoryId } = useParams();
  const history = useHistory();
  const [laboratoryHeads, setLaboratoryHeads] = useState([]);
  const [laboratory, setLaboratory] = useState(null);

  const { ApiServices, alertService, user } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { laboratoryService, userService } = ApiServices;

  const getLaboratoryData = useCallback(async () => {
    try {
      const response = await laboratoryService.findLaboratory(laboratoryId);
      if (response.data) setLaboratory(response.data);
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir les données de laboratoire" });
    }
  }, [laboratoryId]);

  const getLaboratoryHeadsData = useCallback(async () => {
    try {
      const response = await userService.getLaboratoryHeads();
      if (response.data) setLaboratoryHeads(response.data);
      else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable d'obtenir les données des chefs des laboratoires",
      });
    }
  }, []);


  


  const requestUpdate = useCallback(() => {
    getLaboratoryData();
    getLaboratoryHeadsData();
  }, [getLaboratoryData, getLaboratoryHeadsData]);

  useEffect(() => {
    requestUpdate();
  }, [requestUpdate]);

  const [newHeadId, setNewHeadId] = useState(null);

  const handleHeadChange = (event) => {
    event.persist();
    setNewHeadId((newHeadId) => event.target.value);
  };

  const handelButtonClick = async (event) => {
    event.preventDefault();
    if (!newHeadId) return;
    try {
      const response = await laboratoryService.associateHeadToLaboratory(
        newHeadId,
        laboratory._id
      );
      if (response.data)
        pushAlert({
          message: "Chef est associé au laboratoire",
          type: "success",
        });
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'associer le chef au laboratoire" });
    } finally {
      requestUpdate();
    }
  };

  return (
    <div className="container">
      <PageHeader
        title={laboratory ? `Laboratoire ${laboratory.abbreviation}` : ""}
        subTitle={laboratory ? laboratory.name : ""}
      />
      {laboratory == null && <Loader size="60" />}

      <div className="row">
        <div className="col-md-8">
          {laboratory != null && (
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-5 d-flex align-items-center">
                    <span className="bg-blue text-white stamp mr-1 p-1">
                      {laboratory.university.abbreviation}
                    </span>
                    <div className=" lh-sm">
                      <div className="strong">{laboratory.university.name}</div>
                      <div className="text-muted">
                        {laboratory.university.city}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7 d-flex align-items-center">
                    <span className="bg-blue text-white stamp mr-3 p-2">
                      {laboratory.establishment.abbreviation}
                    </span>
                    <div className=" lh-sm">
                      <div className="strong">
                        {laboratory.establishment.name}
                      </div>
                      <div className="text-muted">
                        {laboratory.establishment.address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {laboratory != null && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Équipes</h3>
              </div>
              <div className="card-body">
                {laboratory.teams != null && (
                  <TeamsList teams={laboratory.teams} />
                )}
              </div>
            </div>
          )}
        </div>

        {user.roles == "CED_HEAD" && (
          <div className="col-md-4">
          {laboratory != null && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Chef de laboratoire</h3>
              </div>
              <div className="card-body p-0">
                <div className="list list-row list-hoverable">
                  {laboratory.laboratoryHead != null && (
                    <UserListItem
                      user={laboratory.laboratoryHead}
                      subTitle={`chef de laboratoire ${laboratory.abbreviation}`}
                    />
                  )}
                  {laboratory.laboratoryHead == null && (
                    <div className="list-item ">
                      <small className=" text-center  text-muted text-truncate mt-n1">
                        Pas encore désigné
                      </small>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 pt-0 ">
                <div className="form-label">
                  Sélectionner le chef de laboratoire
                </div>
                <select className="form-select" onChange={handleHeadChange}>
                  <option selected disabled>
                    Sélectionner ici le chef
                  </option>
                  {laboratoryHeads.map((laboratoryHead) => (
                    <option
                      key={laboratoryHead._id}
                      value={laboratoryHead._id}
                      selected={laboratoryHead._id === laboratory.id}
                    >
                      {laboratoryHead.hasConfirmed
                        ? laboratoryHead.firstName +
                          " " +
                          laboratoryHead.lastName
                        : laboratoryHead.email}
                    </option>
                  ))}
                </select>
                <div className="form-footer mt-2">
                  <button
                    onClick={handelButtonClick}
                    className="btn mt-0 btn-outline-primary btn-block "
                  >
                    {laboratory.head_id
                      ? "Modifier le chef du laboratoire"
                      : "Sauvegarder"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {laboratory != null &&
            laboratory.head_history != null &&
            laboratory.head_history.length > 0 && (
              <div className="card ">
                <div className="card-header">
                  <h3 className="card-title">Historique</h3>
                </div>
                <div className="card-body p-0">
                  <div
                    style={{ maxHeight: "300px" }}
                    className="list overflow-auto list-row list-hoverable"
                  >
                    {laboratory.head_history
                      .slice(0)
                      .reverse()
                      .map(({ head, start, end }) => (
                        <UserListItem
                          user={head}
                          subTitle={`Chef depuis ${start}  ${
                            end ? "vers " + end : ""
                          }`}
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}
        </div>
        )}
        
      </div>
    </div>
  );
};

const TeamsList = ({ teams }) => (
  <div className="list row list-hoverable  ">
    {teams.map((team, index) => (
      <TeamListItem key={index} team={team} />
    ))}
  </div>
);

const TeamListItem = ({ team }) => {

  const history = useHistory();
  const teamSelected = async (teams) => {
    history.push(`/team-of-director/${team._id}`);
  };

  return (
    <Fragment>
      <div className="m-3 d-flex align-items-center">
        <span className="bg-blue text-white stamp mr-1">
          {team.abbreviation}
        </span>
        <div className="mr-3 lh-sm"  >
          <div className="strong"> {team.name}</div>
          <div className="text-muted">
            {team.teamMemberShipCount.length}{" "}
            {team.teamMemberShipCount.length > 1 ? "Membres" : "Membre"}
          </div>
        </div>
        <button type="button" className = "btn btn-sm btn-outline-primary" onClick={() => teamSelected(team)}>Détails</button>
      </div>
    </Fragment>
  );
};

export default Laboratory;
