import { createBrowserRouter } from "react-router-dom";
import { CardLogin } from "../organisms/CardLogin";
import { RegistrationPage } from "./RegistrationPage";
import { ListKids } from "./ListKids";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CardLogin />,
  },
  {
    path: "/forms",
    element: <RegistrationPage />,
  },
  {
    path: "/list",
    element: <ListKids />,
  },
]);
