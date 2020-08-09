import React from "react";
import { Link } from "react-router-dom";

const AuthorCard = ({ author }) => {
  return (
    <div className="col-md-4">
      <div className="card">
        <div className="card-body p-3">
          {author.platform === "scopus" && <ScopusCard author={author} />}
          {author.platform === "scholar" && <ScholarCard author={author} />}
        </div>
      </div>
    </div>
  );
};

const ScopusCard = ({ author }) => (
  <div className="row row-sm align-items-center">
    <div className="col-auto">
      <span className="avatar  avatar-md ">
        {author.name.split(" ")[0][0] + author.name.split(" ")[1][0]}
      </span>
    </div>
    <div className="col" style={{ minWidth: "auto" }}>
      <Link
        className="text-body d-block pb-2"
        to={"/author/" + author.authorId}
      >
        {author.name ? author.name.substr(0,25) : ""}
        <span className={"badge pull-right ml-2 bg-orange"}>
          {author.platform}
        </span>
      </Link>
      <small className="d-block text-muted text-truncate mt-n1">
        {[author.affiliation, author.city, author.territory]
          .join("@")
          .substr(30)
          .trim()
          .split("@")
          .filter((info) => info.length > 2)
          .map((info) => (
            <span className="badge bg-blue-lt  mr-2">{info}</span>
          ))}
      </small>
    </div>
  </div>
);

const ScholarCard = ({ author }) => (
  <div className="row row-sm align-items-center">
    <div className="col-auto">
      {author.profilePicture && (
        <span
          className="avatar  avatar-md "
          style={{
            backgroundImage: "url(" + author.profilePicture + ")",
          }}
        ></span>
      )}
    </div>
    <div className="col" style={{ minWidth: "auto" }}>
      <Link
        className="text-body d-block pb-2"
        to={"/author/" + author.authorId}
      >
        {author.name ? author.name.substr(0,25) : ""}
        <span className="badge pull-right ml-2 bg-blue">{author.platform}</span>
      </Link>

      <small className="d-block text-muted text-truncate mt-n1">
        {author.interests
          .join("@")
          .substr(0,30)
          .trim()
          .split("@")
          .filter((interest) => interest.length > 2)
          .map((interest) => (
            <span className="badge bg-blue-lt  mr-2">{interest}</span>
          ))}
      </small>
    </div>
  </div>
);


export default AuthorCard;
