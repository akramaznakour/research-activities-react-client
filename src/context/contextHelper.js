const userShortBio = ({
  laboratoriesHeaded,
  teamsHeaded,
  teamsMemberships,
  establishmentsDirected,
  ...user
}) => {
  if (user.role === "CED_HEAD") return `chef de CED`;

  const laboratoriesHeadedString = laboratoriesHeaded
    .map(({ abbreviation }) => `chef de laboratoire ${abbreviation}`)
    .join(" , ");

  const teamsHeadedString = teamsHeaded
    .map(({ abbreviation }) => `chef de l'équipe ${abbreviation}`)
    .join(" , ");

  const teamsMembershipsString = teamsMemberships
    .map(({ abbreviation }) => `membre de l'équipe ${abbreviation}`)
    .join(" , ");

    const establishmentsDirectedString = establishmentsDirected
    .map(({ abbreviation }) => `Directeur de recherche de ${abbreviation}`)
    .join(" , ");
 
  const shortBio = [establishmentsDirectedString, 
    laboratoriesHeadedString,
    (teamsHeadedString ?? teamsMembershipsString)];

    return shortBio;
  /*if (shortBio.length > 10) return shortBio;
  else return "Chercheur";*/

};

const userHeadedLaboratories = ({ laboratoriesHeaded }) =>
  laboratoriesHeaded.map(({ name, abbreviation }) => abbreviation).join(" , ");

const UserHelper = {
  userShortBio,
  userHeadedLaboratories,
};

export { UserHelper };
