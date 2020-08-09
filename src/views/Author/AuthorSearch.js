/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState, useCallback } from "react";

import { useParams } from "react-router-dom";

import { AppContext } from "../../context/AppContext";
import PageHeader from "../components/PageHeader";
import AuthorCard from "./components/AuthorCard";
import Loader from "../components/Loader";

import NoResultFound from "../components/NoResultFound";
import LoadingResult from "../components/LoadingResult";
import ErrorFound from "../components/ErrorFound";

const AuthorSearch = () => {
  let { authorName } = useParams();

  const [authors, setAuthors] = useState([]);
  const [noResultFound, setNoResultFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { scraperService } = ApiServices;

  const authorSearch = useCallback(async () => {
    if (authors.length) setAuthors([]);
    if (noResultFound) setNoResultFound(false);
    if (isError) setIsError(false);

    const authorNamePath = authorName.replace(" ", "%20");

    try {
      setIsLoading(true);
      const response = await scraperService.authorSearch(authorNamePath);
      if (response.data.authors) setAuthors(response.data.authors);
      else if (response.data.error) setNoResultFound(true);
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de rechercher" });
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [authorName]);

  useEffect(() => {
    authorSearch();
  }, [authorName]);

  return (
    <div className="container">
      <PageHeader
        title={"Chercher l'auteur : " + authorName}
        subTitle={authors.length ? authors.length + " chercheurs" : ""}
      />
      {isLoading && <LoadingResult />}
      {noResultFound && <NoResultFound query={authorName} />}
      {isError && <ErrorFound />}

      <div className="row">
        {authors.map((author, index) => (
          <AuthorCard key={index} author={author} />
        ))}
      </div>
    </div>
  );
};

export default AuthorSearch;
