/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useContext } from "react";
import { SuccessIcon, AlertIcon } from "./icons";
import { AppContext } from "../../context/AppContext";
import { useEffect } from "react";

const ApplicationAlerts = () => {
  const { alertService } = useContext(AppContext);
  const { alerts, clearAlert, clearAllAlerts } = alertService;

  const markeAsRead = (alert) => () => clearAlert(alert);
  useEffect(() => () => clearAllAlerts(), []);

  return (
    <Fragment>
      {alerts.map((alert, index) => (
        <Alert key={index} {...{ ...alert, markeAsRead: markeAsRead(alert) }} />
      ))}
    </Fragment>
  );
};

const Alert = ({
  type = "warning",
  message,
  link,
  linkTitle,
  markeAsRead,
  autoClose = true,
}) => {
  useEffect(() => {
    if (autoClose)
      setTimeout(() => {
        markeAsRead();
      }, 3000);
  }, []);

  return (
    <div
      className={`alert alert-${type} alert-dismissible border-bottom border-0 m-0 `}
      roles="alert"
    >
      <div className="container">
        {(type === "danger" || type === "warning") && <AlertIcon />}
        {type === "success" && <SuccessIcon />}
        <span className="pl-2 pr-2">{message}</span>
        {link && (
          <a href={link} className="alert-link">
            {linkTitle}
          </a>
        )}
      </div>

      <a
        href="/#"
        className="close"
        onClick={(e) => {
          e.preventDefault();
          markeAsRead();
        }}
      >
        &times;
      </a>
    </div>
  );
};

export default ApplicationAlerts;
