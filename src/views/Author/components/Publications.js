import React, { useEffect } from "react";
import Publication from "./Publication";
import $ from "jquery";
import "datatables";

  const Publications = ({ author, setAuthor ,platform}) => {
  useEffect(() => {
    $(".datatable").DataTable();
  }, []);

  const updatePublication = (index, publication) => {
    let tempPublications = author.publications;
    tempPublications[index] = publication;
    setAuthor(() => ({
      ...author,
      publications: tempPublications,
    }));
  };

  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table card-table table-vcenter text-nowrap datatable">
          <thead>
            <tr>
              <th>Titre</th>
              <th className="text-center">Année</th>
              <th className="text-center">Citée</th>
              <th className="text-center">IF</th>
              <th className="text-center">SJR</th>
              <th className="text-center">
                Récupération <br /> des données
              </th>
            </tr>
          </thead>
          <tbody>
            {author.publications &&
              author.publications.map((publication, index) => (
                <Publication
                  index={index}
                  platform={platform}
                  key={publication.title}
                  publication={publication}
                  updatePublication={updatePublication}
                  author={author}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Publications;
