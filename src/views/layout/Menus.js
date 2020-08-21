import { menus } from "../../routes/routes";

const getMenuForRole = (roles) =>
  menus
    .map((menu) => ({
      ...menu,
      subMenus: menu.routes
        .filter((route) => route.inMenu)
        .filter((route) => route.roles.some((r) => roles.includes(r))),
    }))
    .filter((menu) => !menu.isDropdown || menu.subMenus.length > 0);

export { getMenuForRole };
