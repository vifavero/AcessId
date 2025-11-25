import { createBrowserRouter } from "react-router-dom";
import { CardLogin } from "../organisms/CardLogin";
import { RegistrationPage } from "./RegistrationPage";
import { ListKids } from "./ListKids";
import { Profile } from "./Profile";
import { Register } from "../organisms/Register";
import { ListAttendance } from "./ListAttendance";
import { Scanner } from "../organisms/qrCode";
import { ScannerQrCode } from "./Scanner";

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
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/attendance/presentes",
    element: <ListAttendance />,
  },
  {
    path: "/qrcode",
    element: <ScannerQrCode />,
  },
]);
