import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormProvider, useForm } from "react-hook-form";
import { SelectButton } from "../molecules/selectButton";

export interface IRegister {
  name: string;
  email: string;
  password: string;
}

export function Register() {
  const form = useForm<IRegister>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  const API_URL = import.meta.env.API_URL;

  const handleSubmit = async (data: IRegister) => {
    try {
      const res = await fetch(`${API_URL}/registerMonitors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Erro ao registrar usuário");
      }

      alert("Usuário registrado com sucesso!");
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar usuário");
    }
  };

  const formFields = [
    {
      name: "name",
      label: "Nome Completo",
      placeholder: "Digite seu nome",
      type: "text",
      bg: "bg-blue-200",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Digite seu e-mail",
      type: "email",
      bg: "bg-purple-200",
    },
    {
      name: "password",
      label: "Senha",
      placeholder: "Digite sua senha",
      type: "password",
      bg: "bg-blue-200",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-screen bg-[url('src/assets/images/pattern.png')] bg-cover bg-center">
      <FormProvider {...form}>
        <form
          autoComplete="off"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-1 justify-center items-center w-full p-5"
        >
          <div className="w-full md:w-1/2 p-5 flex flex-col gap-5 items-center justify-center rounded-lg bg-secondary shadow-md">
            {formFields.map(({ name, label, placeholder, type, bg }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof IRegister}
                rules={{ required: `Campo obrigatório` }}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <FormLabel>{label}</FormLabel>
                    <FormControl className={`${bg} p-3 rounded-sm text-white`}>
                      <Input
                        type={type}
                        placeholder={placeholder}
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    {fieldState.error && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="submit"
              className="w-full md:w-1/2 text-white dark:text-dark bg-blue-dark hover:bg-blue-dark dark:bg-yellow-100 dark:hover:bg-yellow-200 transition"
            >
              Cadastrar
            </Button>
          </div>
        </form>
      </FormProvider>

      <footer className="mt-auto w-full bg-secondary py-4 border-t flex justify-center">
        <SelectButton />
      </footer>
    </div>
  );
}
