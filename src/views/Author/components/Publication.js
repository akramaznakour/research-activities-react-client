/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useCallback } from "react";
import { AppContext } from "../../../context/AppContext";
import Loader from "../../components/Loader";

const Publication = ({ author, publication, updatePublication, index }) => {
  const { ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { scraperService } = ApiServices;

  const [noResultFound, setNoResultFound] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getPublicationData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await scraperService.getPublicationData(
        author.authorId,
        publication.title.replace("/", "@").split("@")[0]
      );
      if (response.data.error || response.data.status === 404) {
        setNoResultFound(true);
        updatePublication(index, {
          ...publication,
          searchedFor: true,
        });
      } else {
        setIsFetched(true);
        updatePublication(index, {
          ...publication,
          IF: response.data["Impact Factor"],
          SJR: response.data["SJR"],
          searchedFor: true,
        });
      }
    } catch (e) {
      pushAlert({
        message:
          "Incapable d'obtenir les données de la publication" +
          publication.title,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (!publication.IF && !publication.SJR && !publication.searchedFor)
      setTimeout(() => {
        if (isMounted) getPublicationData();
      }, index * 2000);

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchedButton = (
    <button
      className="btn  btn-sm m-3 btn-outline-secondary "
      onClick={getPublicationData}
    >
      récupérer
    </button>
  );
  return (
    <tr style={{ whiteSpace: "break-spaces " }} key={publication.title}>
      <td>
        {publication.title}
        <small className="d-block text-muted text-truncate mt-n1">
          {publication.authors.join(", ")}
        </small>
        {publication.extraInformation &&
          publication.extraInformation["Conference"] && (
            <small className="d-block text-muted text-truncate mt-n1">
              Conference : {publication.extraInformation["Conference"]}
            </small>
          )}
        {publication.extraInformation &&
          publication.extraInformation["Journal"] && (
            <small className="d-block text-muted text-truncate mt-n1">
              Journal : {publication.extraInformation["Journal"]}
            </small>
          )}
      </td>
      <td className="text-center">{publication.year}</td>
      <td className="text-center">{publication.citation.replace("*", "")}</td>
      <td className="text-center">
        {publication.IF ?? " "}
        {isLoading && <Loader size="25" />}
      </td>
      <td className="text-center">
        {publication.SJR ?? " "}
        {isLoading && <Loader size="25" />}
      </td>
      <td className="text-center">
        {noResultFound && " "}
        {!isFetched && !publication.searchedFor && !isLoading && fetchedButton}
      </td>
    </tr>
  );
};

export default Publication;
