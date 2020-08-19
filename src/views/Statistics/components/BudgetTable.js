import React from "react";

const BudgetTable = ({ labBudget, dateRange }) => {
  let yearsRange = [];
  for (let i = dateRange.start; i <= dateRange.end; i++) yearsRange.push(i);

  return (
    <table className="table card-table table-vcenter">
      <thead>
        <tr>
          <th>Year</th>
          
          {yearsRange.map((year,index) => (
            <th key={index}>{year}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        
          <tr >
            
            <td className="">Budget</td>
            {yearsRange.map((year,index) => (
              <td className="" key={index}>{labBudget[year] ?? 0}DH</td>
            ))}
          </tr>
        
      </tbody>
    </table>
  );
};

export default BudgetTable;
