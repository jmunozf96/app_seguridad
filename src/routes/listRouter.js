import Page404 from "../components/errors/Page404";
import Home from "../components/Home";
import User from "../components/seguridad/usuario";
import Grupo from "../components/seguridad/grupo";

export const routes = [
    { path: "/home", component: Home },
    { path: "/seguridad/usuario", component: User },
    { path: "/seguridad/grupo", component: Grupo },
    { path: "*", component: Page404 }
];