import React, { Fragment, useEffect } from "react";

const CRUDForm = ({
  inputs,
  setInputs,
  inputsSkeleton,
  handleSubmit,
  cancelEdit,
  action,
}) => {
  const handleInputsChange = (event) => {
    event.persist();

    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

  };

  useEffect(() => {
    inputsSkeleton.forEach((input) => {
      if (
        input.type === "select" &&
        input.options.length &&
        inputs[input.name + "_id"] === ""
      )
        setInputs((inputs) => ({
          ...inputs,
          [input.name + "_id"]: input.options[0]._id,
        }));
       
    });
  }, [inputs, inputsSkeleton, setInputs]);

  
  

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="card-header">
          <h3 className="card-title">
            {action === "ADDING"
              ? "Ajout"
              : action === "EDITING"
              ? "Modification"
              : ""}
          </h3>
        </div>

        <div className="card-body">
          {inputsSkeleton.map((input,index) => (
            <Fragment key={index}>
              {input.type === "input" && (
                <div className="form-group mt-2">
                  <label className="form-label">{input.label}</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    onChange={handleInputsChange}
                    value={inputs[input.name] || ""}
                    name={input.name}
                  />
                </div>
              )}

              {input.type === "select" && (
                <div className="form-group mt-2">
                  <label className="form-label">{input.label}</label>
                  <select
                    name={input.name + "_id"}
                    onChange={handleInputsChange}
                    value={inputs[input.name + "_id"] || ''}
                    className="form-control"
                  >
                    {input.options.map((option, index) => (
                      <option value={option._id}  key={index}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </Fragment>
          ))}
        </div>
        <div className="card-footer text-right">
          <button onClick={cancelEdit} className="mr-2 btn btn-outline-danger">
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            Soumettre
          </button>
        </div>
      </form>
    </div>
  );
};

export default CRUDForm;
