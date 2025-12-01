import { useEffect, useState } from "react";
import { SelectButton } from "../molecules/selectButton";
import { KidsCard } from "../organisms/KidsCard";

export function ListAttendance() {
  interface Kid {
    id: number;
    nameKids: string;
    nameParents: string;
    atipica: boolean;
    description: string;
  }
  const [kids, setKids] = useState<Kid[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const kidsAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/attendance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erro ao buscar crianças");
        }

        const data = await res.json();
        setKids(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    kidsAttendance();
  }, []);

  while (loading)
    return (
      <div className="flex flex-col min-h-screen w-screen bg-[url('/images/pattern.png')] bg-cover bg-center">
        <div className="bg-green-200 flex p-2 justify-center items-center">
          <p>Sincronizando dados...</p>
        </div>
      </div>
    );

  if (kids.length === 0)
    return (
      <div className="flex flex-col min-h-screen w-screen bg-[url('/images/pattern.png')] bg-cover bg-center">
        <div className="flex flex-1 flex-col items-center justify-center gap-10">
          <div className="flex items-center bg-blue-dark text-white rounded-2xl p-5 transition duration-500 hover:scale-125 hover:shadow-sm hover:shadow-blue-200">
            <p className="text-center text-2xl font-medium">
              Nenhuma criança presente
            </p>
          </div>
        </div>

        <footer className="w-full bg-secondary py-4 border-t flex justify-center">
          <SelectButton />
        </footer>
      </div>
    );

  return (
    <>
      <div className="flex flex-col min-h-screen w-screen bg-[url('/images/pattern.png')] bg-cover bg-center">
        <div className="flex flex-col flex-grow items-center justify-center">
          <div className="w-full md:w-1/2 bg-secondary p-5 rounded-2xl">
            {kids.map((kid) => (
              <KidsCard key={kid.id} kid={kid} />
            ))}
          </div>
        </div>

        <footer className="w-full bg-secondary py-4 flex justify-center">
          <SelectButton />
        </footer>
      </div>
    </>
  );
}
