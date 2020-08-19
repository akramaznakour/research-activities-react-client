import React, { Fragment, useEffect } from "react";
import "../../assets/css/form.css";
const CRUDForm = ({ inputs, setInputs, inputsSkeleton, handleSubmit, cancelEdit, action, twoColumns, phdForm, user }) => {
  const handleInputsChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };
  const handleRoleChange = (event) => {
    event.persist();
    if (document.getElementById('sup').checked) {
      setInputs((inputs) => ({
        ...inputs,
        [document.getElementById("supervisor_id").name]: user._id,
      }));
      document.getElementById('Directeur de thèse').style.visibility = 'hidden';
      document.getElementById('Co-Directeur de thèse').style.visibility = 'visible';

  } else  if (document.getElementById('coSup').checked) {
    setInputs((inputs) => ({
      ...inputs,
      [document.getElementById("coSupervisor_id").name]: user._id,
    }));
      document.getElementById('Co-Directeur de thèse').style.visibility = 'hidden';
      document.getElementById('Directeur de thèse').style.visibility = 'visible';

  }

  };

  useEffect(() => {
    inputsSkeleton.forEach((input) => {
      if (input.type === "select" && input.options.length && inputs[input.name + "_id"] === "")
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
          <h3 className="card-title">{action === "ADDING" ? "Ajout" : action === "EDITING" ? "Modification" : ""}</h3>
        </div>

        <div className={`card-body form `}>
          {phdForm && (
            <div className="form-group mt-2">
              <label className="form-label">Je suis:</label>
              <fieldset>
                <div className="some-class">
                  <input type="radio" className="radio" onChange={handleRoleChange} name='btn' value={false} id="sup" />
                  <label>Directeur de thèse</label>
                  <input type="radio" className="radio" onChange={handleRoleChange} name='btn' value={true} id="coSup" />
                  <label>Co-Directeur de thèse</label>
                </div>
              </fieldset>
            </div>
          )}
          <ul className={twoColumns || "none"}>
            {inputsSkeleton.map((input, index) => (
              <li className={twoColumns || ""} key={index}>
                <Fragment>
                  {input.type === "input" && (
                    <div className="form-group mt-2">
                      <label className="form-label">{input.label}</label>
                      <input required type="text" className="form-control" onChange={handleInputsChange} value={inputs[input.name] || ""} name={input.name} />
                    </div>
                  )}

                  {input.type === "date" && (
                    <div className="form-group mt-2">
                      <label className="form-label">{input.label}</label>
                      <input required type="date" className="form-control" onChange={handleInputsChange} value={inputs[input.name] || ""} name={input.name} />
                    </div>
                  )}
                  {input.type === "radio" && (
                    <div className="form-group mt-2">
                      <label className="form-label">{input.label}</label>
                      {/* <input required type="radio" className="form-control" onChange={handleInputsChange} value={inputs[input.name] || ""} name={input.name} /> */}

                      <fieldset>
                        <div className="some-class">
                          <input type="radio" className="radio" onChange={handleInputsChange} name={input.name} value={false} checked />
                          <label>Non </label>
                          <input type="radio" className="radio" onChange={handleInputsChange} name={input.name} value={true} />
                          <label>Oui</label>
                        </div>
                      </fieldset>
                    </div>
                  )}

                  {input.type === "select" && (
                    <div className="form-group mt-2" id={input.label}>
                      <label className="form-label">{input.label}</label>
                      <select name={input.name + "_id"} onChange={handleInputsChange} value={inputs[input.name + "_id"] || ""} className="form-control" id={input.name + "_id"} >
                        {input.options.map((option, index) => (
                          <option value={option._id} key={index}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </Fragment>
              </li>
            ))}
          </ul>
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
