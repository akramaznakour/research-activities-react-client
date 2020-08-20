/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useContext,
  useState,
  useCallback,
  Fragment,
} from "react";

import { useParams, useLocation } from "react-router-dom";

import AuthorHeader from "./components/AuthorHeader";
import Coauthors from "./components/Coauthors";
import AuthorCitations from "./components/AuthorCitations";
import Publications from "./components/Publications";

import { AppContext } from "../../context/AppContext";
import NoResultFound from "../components/NoResultFound";
import LoadingResult from "../components/LoadingResult";
import ErrorFound from "../components/ErrorFound";

const Author = (props) => {
  const { platform, authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noResultFound, setNoResultFound] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isAllowedToFollow, setIsAllowedToFollow] = useState(null); 
  const [isSendingFollow, setsSendingFollow] = useState(false);
  const [users, setUsers] = useState([]);
  const { user, ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { scraperService, userService, teamService } = ApiServices;

  const getAuthorData = useCallback(async () => {
    try {
      setAuthor();
      setIsLoading(true);
      if (isError) setIsError(false);
      if (noResultFound) setNoResultFound(false);
      const response = await scraperService.getAuthorData(platform, authorId);
      if (response.data.author) {
        setAuthor(response.data.author);
        checkFollowAuthorisation(response.data.author);
      } 
      else if (response.data.error) setNoResultFound(true);
      else {
        pushAlert({ message: "Incapable d'obtenir les données de l'auteur" });
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [authorId]);

  const getIfIsFollowing = useCallback(async () => {
    try {
      const response = await userService.isFollowing(authorId);
      if (response.data.isFollowing) setIsFollowed(true);

      throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir si l'auteur est suivi" });
    }
  }, [authorId]);

  const findAllUsers = useCallback(async () => {
    try {
      const response = await userService.findAllUsers();
      setUsers(response.data);
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir des utilisateurs" });
    }
  }, []);

  const toggleFollow = useCallback(
    async (user_id) => {
      try {
        const service = isFollowed
          ? userService.unfollowUser(authorId)
          : userService.followUser({ ...author, user_id });

        setsSendingFollow(true);
        await service;
        setIsFollowed(!isFollowed);
      } catch (error) {
        pushAlert({ message: "Incapable de basculer le suivi" });
      } finally {
        setsSendingFollow(false);
      }
    },
    [authorId, author]
  );

  const checkFollowAuthorisation = useCallback(
     async (author) => {

      if(user.role === "LABORATORY_HEAD") setIsAllowedToFollow(true);
      let name = author.name.toLowerCase().split(" ");
      if(user.role == "RESEARCHER"){
        console.log(author);
        console.log("This is his name", name);

       const userName = {firstName: user.firstName.toLowerCase(), lastName: user.lastName.toLowerCase()};
        if((userName.firstName == name[0] && userName.lastName == name[1]) ||
            (userName.firstName == name[1] && userName.lastName == name[0]))
            setIsAllowedToFollow(true)
        else
            setIsAllowedToFollow(false);
      }

      if(user.role === "TEAM_HEAD"){
        const response = await teamService.findTeam(user.teamsHeaded[0]._id);
        const team = response.data;
        let teamMember = team.members.filter((member) => {
          const memberName = {firstName: member.firstName.toLowerCase(), lastName: member.lastName.toLowerCase()};

          return ((memberName.firstName == name[0] && memberName.lastName == name[1]) ||
                  (memberName.firstName == name[1] && memberName.lastName == name[0]));
        })

        console.log(teamMember);
        if(!teamMember.length)
          setIsAllowedToFollow(false);
        else setIsAllowedToFollow(true);
      }
    },
    []
  );


  const allowedRoles = ["LABORATORY_HEAD", "TEAM_HEAD", "RESEARCHER"];
  useEffect(() => {
    getAuthorData();
    if (allowedRoles.includes(user.role)) {
      getIfIsFollowing();
      findAllUsers();
    }
  }, []);


  return (
    <div className="row">
      {isLoading && <LoadingResult />}
      {noResultFound && <NoResultFound query={authorId} />}
      {isError && <ErrorFound />}
      {author && (
        <Fragment>
          <div className="col-lg-8">
            <AuthorHeader
              platform={platform}
              users={users}
              user={user}
              author={author}
              toggleFollow={toggleFollow}
              isFollowed={isFollowed}
              isSendingFollow={isSendingFollow}
              isAllowedToFollow={isAllowedToFollow}
            />
            <Publications
              platform={platform}
              author={author}
              setAuthor={setAuthor}
            />
          </div>
          <div className="col-lg-4">
            <AuthorCitations author={author} />
            <Coauthors author={author} />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Author;
