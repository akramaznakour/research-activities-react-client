import React, { Fragment } from "react";
import UserPicture from "../components/UserPicture";
import { Link } from "react-router-dom";

const UserMenu = ({ user, UserHelper }) => (
  <Fragment>
    <Link
      to="/"
      className="nav-link d-flex lh-1 text-inherit p-0 text-left"
      data-toggle="dropdown"
    >
      <UserPicture user={user} badge={true} />
      <div className="d-none d-lg-block pl-2">
        <div>
          {user.firstName ? user.firstName : ""}{" "}
          {user.lastName ? user.lastName : ""}
        </div>
        <div className="mt-1 small text-muted">
          {UserHelper.userShortBio(user)}
        </div>
      </div>
    </Link>
    <div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
      <Link className="dropdown-item" to={"/profile/" + user._id} href="/#">
        Profile
      </Link>
      <Link className="dropdown-item" to="/account" href="/#">
        Paramètres du compte
      </Link>
      <Link className="dropdown-item" to="/login" href="/#">
        Se déconnecter
      </Link>
    </div>
  </Fragment>
);

export default UserMenu;
