import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AuthorReport from "../../Author/AuthorReport";
const ProfileHeader = ({ profile }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-auto">
            <ProfilePicture profile={profile} />
          </div>
          <div className="col">
            <div className="mb-2">
              <h4 className="m-0 ">
                {profile.firstName} {profile.lastName}
                <PDFDownloadLink
                  className="btn  btn-sm m-1  btn-outline-primary"
                  document={
                    <AuthorReport
                      author={{
                        ...profile,
                        name: profile.firstName + " " + profile.lastName,
                      }}
                    />
                  }
                  fileName={profile.name + ".pdf"}
                >
                  {({ blob, url, loading, error }) =>
                    loading
                      ? "Chargement du document..."
                      : "Imprimer le rapport"
                  }
                </PDFDownloadLink>
                <div className="text-info small">
                  {`Nous avons réussi à récupérer le SJR et IF de ${
                    profile.publications.filter((p) => p.IF || p.SJR).length
                  } / ${profile.publications.length} publications`}
                </div>
                <div className="text-info small">
                  {`${
                    profile.publications.filter((p) => p.searchedFor).length
                  } / ${profile.publications.length}
                   publications ont été traitées `}

                  {profile.publications.filter((p) => p.searchedFor).length !==
                    profile.publications.length && (
                    <span
                      className="loader ml-2 d-inline-block"
                      style={{ height: "15px", width: "15px" }}
                    ></span>
                  )}
                </div>
              </h4>

              <ProfileDetails profile={profile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

const ProfileDetails = ({ profile }) => (
  <Fragment>
    <p className="text-muted mb-0">{profile.university}</p>
    <p className="text-muted mb-0">Adresse e-mail validée de {profile.email}</p>
    <div className=" list-inline mb-0 mt-2">
      {profile.interests.map((interest, index) => (
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

const ProfilePicture = ({ profile }) => (
  <span
    className="avatar avatar-lg"
    style={{
      backgroundImage: "url(" + profile.profilePicture + ")",
    }}
  ></span>
);
