import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { CrossIcon, ConfirmationIcon } from "../../components/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AuthorReport from "../AuthorReport";
const AuthorHeader = ({
  platform,
  toggleFollow,
  isFollowed,
  isSendingFollow,
  author,
  user,
  users,
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-auto">
            <AuthorPicture author={author} />
          </div>
          <div className="col">
            <div className="mb-2">
              <h4 className="m-0 ">
                {author.name}
                {user.role === "LABORATORY_HEAD" && (
                  <FollowingButton
                    disabled={
                      author.publications.filter((p) => p.searchedFor)
                        .length !== author.publications.length
                    }
                    isFollowed={isFollowed}
                    isSendingFollow={isSendingFollow}
                  />
                )}

                <Fragment>
                  <PDFDownloadLink
                    className="btn  btn-sm m-1  btn-outline-primary"
                    document={<AuthorReport author={author} />}
                    fileName={author.name + ".pdf"}
                  >
                    {({ blob, url, loading, error }) =>
                      loading
                        ? "Chargement du document..."
                        : "Imprimer le rapport"
                    }
                  </PDFDownloadLink>
                </Fragment>

                <div className="text-info small">
                  {`Nous avons réussi à récupérer le SJR et IF de ${
                    author.publications.filter((p) => p.IF || p.SJR).length
                  } / ${author.publications.length} publications`}
                </div>
                <div className="text-info small">
                  {`${
                    author.publications.filter((p) => p.searchedFor).length
                  } / ${author.publications.length}
                   publications ont été traitées `}

                  {author.publications.filter((p) => p.searchedFor).length !==
                    author.publications.length && (
                    <span
                      className="loader ml-2 d-inline-block"
                      style={{ height: "15px", width: "15px" }}
                    ></span>
                  )}
                </div>
              </h4>

              <AuthorDetails author={author} />
              {users && users.length > 0 && (
                <ConfirmationModel
                  users={users}
                  toggleFollow={toggleFollow}
                  isFollowed={isFollowed}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorHeader;

const FollowingButton = ({ isFollowed, isSendingFollow, disabled }) => (
  <button
    disabled={disabled}
    href="/#"
    data-toggle="modal"
    data-target="#modal-info"
    type="button"
    className={
      "btn  btn-sm m-3 mr-1 btn-outline-" + (isFollowed ? "success" : "primary")
    }
  >
    {isFollowed
      ? "Ne plus suivre"
      : disabled
      ? "Pour suivre attendez le traitement..."
      : "Suivre"}
    {isSendingFollow && (
      <div
        style={{ height: "10px", width: "10px" }}
        className="loader ml-2 "
      ></div>
    )}
  </button>
);

const AuthorDetails = ({ author }) => (
  <Fragment>
    <p className="text-muted mb-0">{author.university}</p>
    <p className="text-muted mb-0">Adresse e-mail validée de {author.email}</p>
    <div className=" list-inline mb-0 mt-2">
      {author.interests.map((interest, index) => (
        <Link
          to={interest}
          key={index}
          className="btn btn-primary btn-sm mb-2 mr-2 mb-1"
        >
          {interest}
        </Link>
      ))}
    </div>
  </Fragment>
);

const ConfirmationModel = ({ isFollowed, toggleFollow, users }) => {
  const [userId, setUserId] = useState(users[0]._id);
  return (
    <div
      className="modal modal-blur fade show"
      id="modal-info"
      tabindex="-1"
      role="dialog"
      style={{ display: " none", "padding-right": "17px" }}
      aria-modal="true"
    >
      <div
        className="modal-dialog modal-sm modal-dialog-centered"
        role="document"
      >
        <div className="modal-content">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <CrossIcon />
          </button>
          <div className="modal-body text-center py-5">
            <ConfirmationIcon />
            <h3>Confirmation</h3>
            <div className="text-muted">
              {!isFollowed &&
                "Cet auteur sera associé au compte utilisateur de cette plateforme, veuillez sélectionner le compte utilisateur"}
            </div>
          </div>

          {!isFollowed && (
            <div className="modal-body text-center py-5">
              <div className="subheader mb-2">L'utilisateur</div>
              <div>
                <select
                  name=""
                  className="form-select"
                  onChange={(e) => {
                    setUserId(e.target.value);
                  }}
                >
                  {users.map(({ firstName, lastName, _id }, index) => (
                    <option
                      key={index}
                      value={_id}
                    >{`${firstName} ${lastName}`}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="modal-footer">
            <Link
              href="/#"
              onClick={() => toggleFollow(userId)}
              className="btn btn-primary btn-block"
              data-dismiss="modal"
            >
              {!isFollowed && "Confirmer l'abonnement"}
              {isFollowed && "Confirmer le désabonnement"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthorPicture = ({ author }) => (
  <Fragment>
    {author.profilePicture && (
      <span
        className="avatar avatar-lg"
        style={{
          backgroundImage: "url(" + author.profilePicture + ")",
        }}
      ></span>
    )}{" "}
    {!author.profilePicture && (
      <span className="avatar avatar-lg bg-blue-lt ">
        {author.name.split(" ")[0][0]}
        {author.name.split(" ")[1] ? author.name.split(" ")[1][0] : ""}
      </span>
    )}
  </Fragment>
);
