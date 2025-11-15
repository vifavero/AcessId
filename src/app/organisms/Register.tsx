import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormProvider, useForm } from "react-hook-form";

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
  });

  const handleSubmit = async (data: IRegister) => {
    try {
      const res = await fetch(`http://localhost:3333/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Erro ao registrar usuário");
      }

      alert("Usuário registrado com sucesso!");
      form.reset(); // Limpa o formulário após o registro
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar usuário");
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-3 p-5 w-screen items-center justify-center"
      >
        <div className="w-full md:w-1/2 space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl className="bg-blue-100 p-5">
                  <Input placeholder="Digite seu nome" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl className="bg-purple-200 p-5">
                  <Input placeholder="Digite o seu e-mail" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl className="bg-blue-100 p-5">
                  <Input
                    type="password"
                    placeholder="Digite sua senha"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full md:w-1/4 bg-yellow-100">
            Cadastrar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
