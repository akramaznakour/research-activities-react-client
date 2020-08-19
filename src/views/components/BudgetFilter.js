import React, { Fragment,  } from "react";
import { Link } from "react-router-dom";
import Collapsible from "./Collapsible";

const BudgetFilter = ({ establishments, laboratories , setSelectedLabs, selectedLabs,  currentLab, setCurrentLab}) => {

  
  return (
    <form action="" method="get">
      

      {
        <FilteringCategory
          {...{ establishments,laboratories , setSelectedLabs, selectedLabs, currentLab, setCurrentLab}}
        />
      }
    </form>
  );
};

export default BudgetFilter;
const FilteringCategory = ({establishments, laboratories, setSelectedLabs, selectedLabs, currentLab, setCurrentLab }) => {
  let LabsPerEstablishment = [];
  establishments.map(estab => {
    LabsPerEstablishment.push({
      'estab' : estab.name,
      'labs' :[],
    })
  })
  if(LabsPerEstablishment.length!== 0)
 { laboratories.map(lab =>{
    for (let i in LabsPerEstablishment){


        if (LabsPerEstablishment[i].estab === lab.establishment){
          LabsPerEstablishment[i].labs.push(lab);
        }
    }
  })};

  return (
    <Fragment>
      <div className="subheader mb-2">Laboratories</div>
      <div className="list-group list-group-transparent mb-3">
        {LabsPerEstablishment.map(( estab, index) => (
          <DropDown key={index} {...{ estab , setSelectedLabs, selectedLabs, currentLab, setCurrentLab}} />
        ))}
      </div>
    </Fragment>
  );
};

const DropDown = ({ estab, setSelectedLabs, selectedLabs,  currentLab, setCurrentLab }) =>{
  return (
    
  
    
      <Collapsible title={estab.estab} >
   {estab.labs.map(( lab, index) => (
          <FilteringOption key={index} {...{ lab , setSelectedLabs, selectedLabs,  currentLab, setCurrentLab}} />
        ))}
      
      
   
    </Collapsible>
 
  

  )}

const FilteringOption = ({ lab, setSelectedLabs, selectedLabs,  currentLab, setCurrentLab }) => {
  const classes =
    "list-group-item list-group-item-action d-flex align-items-center ";

  const updateFilter = (e) => {
    e.preventDefault();
    setCurrentLab(lab);
    let inSelectedLabsPos = -1;
    for(let i in selectedLabs)
    {  if(selectedLabs[i].name === lab.name)
       {
        inSelectedLabsPos= i;
       }
    }
    if(inSelectedLabsPos > -1){
      setSelectedLabs((selectedLabs)=> {
        let array=[...selectedLabs];
        array.splice(inSelectedLabsPos,1);
        return(array)
      });
    }
    else{
      setSelectedLabs(selectedLabs=> selectedLabs.concat(lab));
    }
   
  };
  let isActive;
  if(currentLab !== null)
    {
    if(currentLab.name === lab.name)
        {
          isActive= true;
        }
    }

  return (
    <Link
      to="/#"
      className={`${classes} ${isActive ? " active " : "notActive"}`}
      onClick={updateFilter}
    >
      {lab.name}
      
    </Link>
  );
};

