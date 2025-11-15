import { useEffect, useState } from "react";
import { SelectButton } from "../molecules/selectButton";
import { Description } from "../organisms/Description";

export function ListKids() {
  interface Kid {
    id: number;
    nameKids: string;
    nameParents: string;
    atipica: boolean;
    description: string;
  }
  const [kids, setKids] = useState<Kid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKids = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3333/list`, {
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

    fetchKids();
  }, []);

  if (loading) return <p>Carregando...</p>;

  if (kids.length === 0)
    return (
      <div className="flex flex-col min-h-screen w-screen bg-[url('src/assets/images/pattern.png')] bg-cover bg-center">
        <div className="flex flex-1 flex-col items-center justify-center gap-10">
          <div className="flex items-center bg-blue-dark text-white rounded-2xl p-5 transition duration-500 hover:scale-125 hover:shadow-sm hover:shadow-blue-200">
            <p className="text-center text-2xl font-medium">
              Nenhuma criança cadastrada
            </p>
          </div>
        </div>

        <footer className="w-full bg-white py-4 border-t flex justify-center">
          <SelectButton />
        </footer>
      </div>
    );

  return (
    <div className="flex flex-col gap-3 mt-5">
      {kids.map((kid) => (
        <Description key={kid.id} kid={kid} />
      ))}
      <div className="flex flex-col gap-10 items-center justify-center ">
        <SelectButton />
      </div>
    </div>
  );
}
