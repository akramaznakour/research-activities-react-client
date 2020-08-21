import React, { useContext } from "react";
import { Route as ReactRoute, Redirect } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Route = ({ component: Component, roles, ...rest }) => {
  let { user } = useContext(AppContext);

  return (
    <ReactRoute
      {...rest}
      render={(props) => {
        const redirectTo = (page) => (
          <Redirect to={{ pathname: page, state: { from: props.location } }} />
        );

        if (!user) return redirectTo("/login");

        if (role && role.indexOf(user.role) === -1) return redirectTo("/");

        return <Component {...props} />;
      }}
    />
  );
};

export default Route;
