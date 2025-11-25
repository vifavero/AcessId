import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectButton } from "../molecules/selectButton";
import { ModeToggle } from "@/components/ui/mode-toggle";

export interface AccountProps {
  id: number;
  name: string;
  email: string;
}

export function Profile() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const [monitors, setMonitors] = useState<AccountProps | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3333/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erro ao buacar perfil");
        }

        const data = await res.json();
        setMonitors(data);
      } catch (error) {
        console.error("Erro ao buacar perfil", error);
      }
    };

    fetchProfile();
  }, []);

  if (!monitors)
    return (
      <div className="flex flex-col min-h-screen w-screen bg-[url('src/assets/images/pattern.png')] bg-cover bg-center">
        <div className="bg-green-200 flex p-2 justify-center items-center">
          <p>Sincronizando dados...</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen w-screen bg-[url('src/assets/images/pattern.png')] bg-cover bg-center">
      <div className="flex flex-col gap-10 flex-1 items-center justify-center">
        <div className="bg-secondary flex flex-col justify-center w-full md:w-1/2 items-center p-5 rounded-2xl">
          <div className="flex flex-col justify-center items-center bg-yellow-100 dark:text-dark dark:font-semibold p-3 w-full rounded-lg">
            <p>Tia Logada: {monitors.name}</p>
            <p>Email: {monitors.email}</p>
          </div>

          <hr className="w-full h-0.5 my-8 bg-blue-200 border-0 rounded-sm" />

          <div className="flex flex-row w-full justify-center gap-5 text-white font-bold items-center">
            {/* <button className="bg-blue-200" onClick={handleLogout}>
              Settings
            </button> */}
            <ModeToggle />

            <button
              className="bg-orange-100"
              onClick={() => navigate("/register")}
            >
              Cadastrar Tia
            </button>
            <button className="bg-green-300" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-auto w-full bg-secondary py-4 border-t flex justify-center">
        <SelectButton />
      </footer>
    </div>
  );
}
