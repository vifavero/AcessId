import { Card } from "@/components/ui/card";
import { useContext } from "react";
import { FormContext } from "./provider";

export function Registration() {
  const { nameKids, nameParents, description } = useContext(FormContext);

  const fields = [
    { label: "Nome:", value: nameKids },
    { label: "Nome do responsável:", value: nameParents },
    { label: "Outras informações:", value: description },
  ];

  return (
    <div className="flex items-center justify-center gap-10 p-5 bg-white-100">
      <img
        src="src/assets/images/kid.jpg"
        className="rounded-full w-20 h-20 md:w-32 md:h-32 object-cover"
      />

      <Card className="flex flex-col gap-4 p-6 bg-orange-100">
        <div className="text-white text-sm space-y-2">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex gap-2">
              <h2 className="font-semibold">{label}</h2>
              <p className="font-medium">{value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
