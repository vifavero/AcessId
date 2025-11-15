import { useForm, FormProvider as RHFProvider } from "react-hook-form";
import { Form, type FormKid } from "../organisms/Forms";
import { Registration } from "./Registration";
import { FormProvider as MyProvider } from "./provider";

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
        <div className="relative flex flex-col items-center bg-[url('src/assets/images/pattern.png')] bg-cover bg-center">
          <Registration />
          <Form />
        </div>
      </RHFProvider>
    </MyProvider>
  );
}
