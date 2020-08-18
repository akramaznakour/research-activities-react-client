import React, { useEffect } from "react";
import $ from "jquery";
import "datatables";

const CRUDTable = ({ columns, data, actions, tableSkeleton }) => {
  useEffect(() => {
    console.log("Data",data)
    if (data.length) $(".datatable").DataTable();
  }, [data]);

  const objectToDisplayRow = (objectRow) =>
    tableSkeleton.map(({ name }) => objectRow[name]);

  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table card-table table-vcenter text-nowrap datatable">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((objectRow, indextr) => (
              <tr key={indextr}>
                {objectToDisplayRow(objectRow).map((element, indextd) => (
                  <td
                    key={indextd}
                    style={{
                      whiteSpace:
                        element.length > 40 ? "break-spaces" : "nowrap ",
                    }}
                  >
                    {element}
                  </td>
                ))}
                <td className="text-right">
                  <div className="btn-list d-block">
                    {actions.map((action,index) => (
                      <button key={index}
                        type="button"
                        onClick={() => {
                          action.function(objectRow);
                        }}
                        className={`btn btn-sm btn-outline-${action.style}`}
                      >
                        {action.name}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CRUDTable;
