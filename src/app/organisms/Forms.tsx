import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { DialogCheckbox } from "../molecules/DialogCheckbox";
import { useContext, useEffect } from "react";
import { FormContext } from "../templates/provider";
import { Textarea } from "@/components/ui/textarea";

export interface FormKid {
  nameKids: string;
  nameParents: string;
  endereco: string;
  telefone: string;
  alergia: boolean;
  restricao: boolean;
  atipica: boolean;
  description: string;
}

export function Form() {
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

  const { setFormData } = useContext(FormContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const nameKids = form.watch("nameKids");
  const nameParents = form.watch("nameParents");
  const description = form.watch("description");

  useEffect(() => {
    setFormData({ nameKids, nameParents, description });
  }, [nameKids, nameParents, description, setFormData]);

  const handleSubmit = async (data: FormKid) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");

      const payload = {
        nameKids: data.nameKids,
        nameParents: data.nameParents,
        endereco: data.endereco,
        telefone: Number(data.telefone),
        alergia: data.alergia,
        restricao: data.restricao,
        atipica: data.atipica,
        description: data.description,
      };

      console.log("📦 Enviando para o backend:", payload);

      const res = await fetch(`${API_URL}/forms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("⚠️ Erro retornado do backend:", err);
        throw new Error(
          JSON.stringify(err.error) || "Erro ao cadastrar a criança"
        );
      }

      const result = await res.json();
      console.log("✅ Criança cadastrada com sucesso:", result);
      form.reset(); // limpa os campos após envio
    } catch (error) {
      console.error("❌ Erro ao cadastrar:", error);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      autoComplete="off"
      className="flex flex-col gap-3 p-5 w-screen items-center justify-center "
    >
      <div className=" flex flex-col gap-3 p-5 w-full md:w-1/2 items-center justify-center rounded-lg bg-secondary ">
        <div className="w-full space-y-3">
          <FormField
            control={form.control}
            name="nameKids"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Nome da criança</FormLabel>
                <FormControl className="bg-blue-200 p-5 text-white outline-none border-none">
                  <Input placeholder="Digite o nome da criança" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nameParents"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  Nome do responsável
                </FormLabel>
                <FormControl className="bg-purple-200 p-5 text-white outline-none border-none">
                  <Input
                    placeholder="Digite o nome do responsável"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endereco"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Endereço</FormLabel>
                <FormControl className="bg-blue-200 p-5 text-white outline-none border-none">
                  <Input placeholder="Digite o endereço" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  Telefone do Responsável
                </FormLabel>
                <FormControl className="bg-purple-200 p-5 text-white outline-none border-none">
                  <Input placeholder="Digite o telefone" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Descrição</FormLabel>
                <FormControl className=" bg-blue-200 text-white outline-none border-none">
                  <Textarea {...field} placeholder="Digite alguma observação" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-row gap-10 p-5">
          <FormField
            control={form.control}
            name="alergia"
            render={({ field }) => (
              <DialogCheckbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(!!checked)}
              >
                Possui Alergia?
              </DialogCheckbox>
            )}
          />
          <FormField
            control={form.control}
            name="restricao"
            render={({ field }) => (
              <DialogCheckbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(!!checked)}
              >
                Restrição Alimentar?
              </DialogCheckbox>
            )}
          />
          <FormField
            control={form.control}
            name="atipica"
            render={({ field }) => (
              <DialogCheckbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(!!checked)}
              >
                Criança Atípica?
              </DialogCheckbox>
            )}
          />
        </div>

        <Button
          type="submit"
          variant={"default"}
          className="w-full md:w-1/4  dark:bg-yellow-100 dark:hover:bg-yellow-200 "
        >
          Cadastrar
        </Button>
      </div>
    </form>
  );
}
