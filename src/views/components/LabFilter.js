import React, { Fragment, useState, useEffect } from "react";
import { LoopIcon } from "./icons";
import { Link } from "react-router-dom";

const LabFilter = ({ laboratories , setSelectedLabs, selectedLabs}) => {

  
  return (
    <form action="" method="get">
      

      {
        <FilteringCategory
          {...{ laboratories , setSelectedLabs, selectedLabs}}
        />
      }
    </form>
  );
};

export default LabFilter;
const FilteringCategory = ({laboratories, setSelectedLabs, selectedLabs }) => {
  return (
    <Fragment>
      <div className="subheader mb-2">Laboratories</div>
      <div className="list-group list-group-transparent mb-3">
        {laboratories.map(( lab, index) => (
          <FilteringOption key={index} {...{ lab , setSelectedLabs, selectedLabs}} />
        ))}
      </div>
    </Fragment>
  );
};



const FilteringOption = ({ lab, setSelectedLabs, selectedLabs }) => {
  const classes =
    "list-group-item list-group-item-action d-flex align-items-center ";

  const updateFilter = (e) => {
    e.preventDefault();
    setSelectedLabs(lab);
    
    console.log(isActive);
    console.log(selectedLabs);
   
  };

  const isActive = selectedLabs
  ? selectedLabs.name === lab.name
  : false;
  return (
    <Link
      to="/#"
      className={`${classes} ${isActive ? " active " : "notActive"}`}
      onClick={updateFilter}
    >
      {lab.name}
      <small className="text-muted ml-auto">{lab.membershipCount}</small>
    </Link>
  );
};

