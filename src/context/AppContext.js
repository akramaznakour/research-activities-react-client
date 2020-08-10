import React, { createContext, useReducer, useEffect, useState } from "react";
import makeApiServices from "../api/ApiServices";
import { UserHelper } from "./contextHelper";

let userReducer = (user, newUser) => {
  if (newUser === null || newUser === undefined) {
    localStorage.removeItem("user");
    return initialState;
  }
  return newUser;
};

const initialState = null;

const userlocalState = JSON.parse(localStorage.getItem("user"));

const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useReducer(
    userReducer,
    userlocalState || initialState
  );
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const pushAlert = (alert) => {
    if (
      process.env.DEBUG === "true" ||
      !["warning", "danger"].includes(alert.type)
    ) {
      setAlerts((alerts) => [
        ...alerts,
        {
          id: alerts.length,
          ...alert,
        },
      ]);
    }
  };

  const clearAlert = (alert) =>
    setAlerts(alerts.filter(({ id }) => alert.id !== id));

  const clearAllAlerts = () => setAlerts([]);
  const alertService = { alerts, pushAlert, clearAlert, clearAllAlerts };

  const ApiServices = makeApiServices({
    token: user ? user.token : null,
    alertService,
  });

  return (
    <AppContext.Provider
      value={{ user, setUser, ApiServices, UserHelper, alertService }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
