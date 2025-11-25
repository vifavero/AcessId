import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./app/templates/router";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors closeButton />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
