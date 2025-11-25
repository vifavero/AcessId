import { useForm, FormProvider as RHFProvider } from "react-hook-form";
import { Form, type FormKid } from "../organisms/Forms";
import { FormProvider as MyProvider } from "./provider";
import { SelectButton } from "../molecules/selectButton";
import { DescriptionCard } from "./DescriptionCard";

export function RegistrationPage() {
  const form = useForm<FormKid>({
    defaultValues: {
      nameKids: "",
      nameParents: "",
      endereco: "",
      telefone: "",
      alergia: false,
      restricao: false,
      atipica: false,
      description: "",
    },
  });

  return (
    <MyProvider>
      <RHFProvider {...form}>
        <div className="relative min-h-screen w-screen flex flex-col items-center bg-[url('src/assets/images/pattern.png')] bg-cover bg-center ">
          <header className="w-full flex justify-center md:justify-start items-center p-4 bg-secondary/90 shadow-md">
            <SelectButton />
          </header>

          <div className="flex flex-col items-center w-full max-w-3xl mt-8 px-4">
            <DescriptionCard />
            <Form />
          </div>
        </div>
      </RHFProvider>
    </MyProvider>
  );
}
