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
        {author.name.split(" ")[0][0] + " " + author.name.split(" ")[1][0]}
      </span>
    </div>
    <div className="col" style={{ minWidth: "auto" }}>
      <Link
        className="text-body d-block pb-2"
        to={"/author/" + author.authorId}
      >
        {author.name ? author.name : ""}
        <span className={"badge pull-right ml-2 bg-orange"}>
          {author.platform}
        </span>
      </Link>
      <small className="d-block text-muted text-truncate mt-n1">
        {[author.affiliation, author.city, author.territory]
          .join("@")
          .substr(35)
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
        {author.name ? author.name : ""}
        <span className="badge pull-right ml-2 bg-blue">{author.platform}</span>
      </Link>

      <small className="d-block text-muted text-truncate mt-n1">
        {author.interests.slice(0, 2).map((interest, index) => (
          <span key={index} className="badge bg-blue-lt  mr-2">
            {interest.length > 30 / (1 + index)
              ? interest.substr(1, 30 / (1 + index)).concat("...")
              : interest}
          </span>
        ))}
        {author.interests.length > 2 && <span>...</span>}
      </small>
    </div>
  </div>
);

export default AuthorCard;
