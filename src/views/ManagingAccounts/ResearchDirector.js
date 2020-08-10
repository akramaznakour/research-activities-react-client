/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  Fragment,
} from "react";

import PageHeader from "../components/PageHeader";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import UserListItem from "../Author/components/UserListItem";

const Laboratory = () => {
  const { laboratoryId } = useParams();

  const [laboratoryHeads, setLaboratoryHeads] = useState([]);
  const [laboratory, setLaboratory] = useState(null);
  const [establishments, setEstablishments] = useState([]);
  const [researchDirector, setResearchDirector] = useState(null);
  const [users, setUsers] = useState([]);

  const { ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { laboratoryService, userService, establishmentService, universityService } = ApiServices;

  const getLaboratoryData = useCallback(async () => {
    try {
      const response = await laboratoryService.findLaboratory(laboratoryId);
      if (response.data) setLaboratory(response.data);
      else setLaboratory(
        {
          _id: "5f215c04a4a9d11820be456f"
          , name: "Laboratoire de Technologies de l'Information",
          abbreviation: "LTI",
          establishment_id: "5f215c04a4a9d11820be456e",
          head_id: "5f215c02a4a9d11820be453b",
          head_history: []
        });
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir les données de laboratoire" });
    }
  }, [laboratoryId]);


  const getEstablishments = useCallback(async () => {
    try {
      const response = await establishmentService.findAllEstablishments();
      if (response.data) setEstablishments(response.data);
      else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable d'obtenir les données des chefs des laboratoires",
      });
    }
  }, []);


  const getResearchDirector = useCallback(async () => {
    try {
      const response = await universityService.getResearchDirector();
      if (response.data) setResearchDirector(response.data);
      else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable d'obtenir les données des chefs des laboratoires",
      });
    }
  }, []);

  const getResearchers = useCallback(async () => {
    try {
      const response = await userService.findAllUsers();
      if (response.data) setUsers(response.data);
      else throw Error();
    }
    catch (error) {
      pushAlert({
        message: "Incapable d'obtenir les données des chercheurs",
      });
    }

  }, []);


  const requestUpdate = useCallback(() => {
    getEstablishments();
    getResearchDirector();
    getResearchers();
  }, [getEstablishments, getResearchDirector, getResearchers]);

  useEffect(() => {
    requestUpdate();
  }, [requestUpdate]);

  const [newDirectorIds, setNewDirectorIds] = useState(new Map());

  const handleDirectorChange = (event) => {
    event.persist();
    let state = newDirectorIds;
    state.set(event.target.name, event.target.value)
    setNewDirectorIds(state);

    console.log(newDirectorIds);
  };

  const handelButtonClick = async (event) => {
    event.preventDefault();
    if (!newDirectorIds) return;
    try {
      const response = await establishmentService.setEstablishmentResearchDirector(
        event.target.name,
        newDirectorIds.get(event.target.name)
      );

      if (response.data)
        pushAlert({
          message: "Le directeur de recherche a été changé avec succès.",
          type: "success",
        });
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Erreur lors du changement de directeur de recherche." });
    } finally {
      requestUpdate();
    }
  };

  return (
    <div className="container">
      <PageHeader
        title="Gestion des comptes directeurs de recherche"
        subTitle="Directeur de recherche"
      />
      {establishments == null && <Loader size="60" />}
        {
          establishments.map((establishment) => (

            <div className="row">
              <div className="col-md-10">
                <div className="card">
                  <div className="card-body bg-blue">
                    <div className="row">
                      <div className="align-items-center">
                        <div className="text-uppercase text-white">
                          <div className="strong">{establishment.name}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                {establishment != null && (
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Directeur de recherche</h3>
                    </div>
                    <div className="card-body p-0">
                      {establishment.research_director != null && (
                        <ResearchDirector director={establishment.research_director} />
                      )}
                    </div>

                    <div className="p-4 pt-0 ">
                      <div className="form-label">
                        Sélectionner le directeur de recherche
                        </div>
                      <select className="form-select" onChange={handleDirectorChange} name={establishment._id}>
                        <option value disabled>
                          Sélectionner ici le chef
                          </option>
                        {users.map((user) => (
                          <option
                            key={user._id}
                            value={user._id}
                          >
                            {user.firstName} {user.lastName}

                          </option>
                        ))}
                      </select>
                      <div className="form-footer mt-2">
                        <button
                          onClick={handelButtonClick}
                          className="btn mt-0 btn-outline-primary btn-block "
                          name={establishment._id}
                        >
                          {researchDirector
                            ? "Modifier le chef du laboratoire"
                            : "Sauvegarder"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-md-4">
                {establishment &&
                  establishment.direction_history != null &&
                  establishment.direction_history.length > 0 && (
                    <div className="card ">
                      <div className="card-header">
                        <h3 className="card-title">Historique</h3>
                      </div>
                      <div className="card-body p-0">
                        <div
                          style={{ maxHeight: "300px" }}
                          className="list overflow-auto list-row list-hoverable"
                        >
                          {establishment.direction_history
                            .slice(0)
                            .reverse()
                            .map(({ director, start, end }) => (
                              <UserListItem
                                user={director}
                                subTitle={`Directeur depuis ${start}  ${
                                  end ? "jusqu'à " + end : ""
                                  }`}
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))
        }
      </div>
  );
};

const ResearchDirector = ({ director }) => {
  return (
    <Fragment>
      <div className="m-3 d-flex align-items-center">
        <span className="stamp mr-1 px-3">
          {director.firstName} {director.lastName}
        </span>
        <div className="mr-3 lh-sm">
          <div className="strong">{director.email}</div>
        </div>
      </div>
    </Fragment>
  )
};


export default Laboratory;
