import { Card } from "@/components/ui/card";

interface Kid {
  id: number;
  nameKids: string;
  nameParents: string;
  atipica: boolean;
  description: string;
}

export function KidsCard({ kid }: { kid: Kid }) {
  return (
    <Card className="flex flex-col bg-chart-2 text-white dark:text-dark gap-5 p-6 w-full h-auto mt-3">
      <div className="flex flex-col text-sm text-gray-800">
        <h2>
          <strong>Nome:</strong> {kid.nameKids}
        </h2>
        <h2>
          <strong>Responsável:</strong> {kid.nameParents}
        </h2>
        {kid.atipica === true && (
          <h2>
            <strong>Atípica:</strong> {kid.atipica}
          </h2>
        )}

        {kid.description != null && (
          <h2>
            <strong>Outras Informações:</strong> {kid.description}
          </h2>
        )}
      </div>
    </Card>
  );
}
