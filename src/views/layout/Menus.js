import { menus } from "../../routes/routes";

const getMenuForRole = (roles) =>
  menus
    .map((menu) => ({
      ...menu,
      subMenus: menu.routes
        .filter((route) => route.inMenu)
        .filter((route) => route.roles.indexOf(userRole) !== -1),
    }))
    .filter((menu) => !menu.isDropdown || menu.subMenus.length > 0);

export { getMenuForRole };
