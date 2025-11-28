import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Kid {
  id: number;
  nameKids: string;
  nameParents: string;
  atipica: boolean;
  description: string;
}

interface Pulseira {
  code: string;
  status: boolean;
}

export function Description({ kid }: { kid: Kid }) {
  const [pulseiras, setPulseiras] = useState<Pulseira[]>([]);
  const [selectedPulseira, setSelectedPulseira] = useState<string>("");
  const API_URL = import.meta.env.API_URL;

  const [open, setOpen] = useState(false);

  async function handleSelect() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");
      const res = await fetch(`${API_URL}/attendance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(JSON.stringify(err.error));
      }

      const data = await res.json();
      setPulseiras(data);
    } catch (error) {
      console.error("Erro ao listar pulseiras:", error);
    }
  }
  async function handleSend() {
    try {
      if (!selectedPulseira) {
        toast.error("Selecione uma pulseira!");
        return;
      }
      const pulseiraSelecionada = pulseiras.find(
        (p) => p.code === selectedPulseira
      );

      if (!pulseiraSelecionada) {
        toast.error("Pulseira não encontrada!");
        return;
      }

      if (pulseiraSelecionada.status === false) {
        toast.error("Pulseira em uso!", {
          description: `Pulseira associada a criança: ${kid.nameKids}`,
        });
        return;
      }

      const payload = {
        kidId: kid.id,
        qrCodeId: Number(selectedPulseira),
      };

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");

      const res = await fetch(`${API_URL}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(JSON.stringify(err.error));
      }

      await res.json();

      toast.success("Pulseira atribuída com sucesso!", {
        description: `Criança: ${kid.nameKids} — Pulseira: ${selectedPulseira}`,
      });

      setSelectedPulseira("");
      setOpen(false);
    } catch (error) {
      console.error("Erro ao listar pulseiras:", error);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) handleSelect();
      }}
    >
      <DialogTrigger asChild>
        <Card className="flex flex-col bg-blue-200 gap-5 p-6 mt-3 cursor-pointer">
          <div className="flex flex-col text-sm text-white">
            <h2>
              <strong>Nome:</strong> {kid.nameKids}
            </h2>
            <h2>
              <strong>Responsável:</strong> {kid.nameParents}
            </h2>
            {kid.atipica && (
              <h2>
                <strong>Atípica:</strong> Sim
              </h2>
            )}
            {kid.description && (
              <h2>
                <strong>Outras Informações:</strong> {kid.description}
              </h2>
            )}
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-secondary  rounded-lg">
        <DialogHeader>
          <DialogTitle>Atribuir Pulseira</DialogTitle>
          <DialogDescription>
            Escolha uma pulseira para <strong>{kid.nameKids}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Select
          value={selectedPulseira}
          onValueChange={(value) => setSelectedPulseira(value)}
        >
          <SelectTrigger className="border-2 border-yellow-100">
            <SelectValue placeholder="Selecione a pulseira" />
          </SelectTrigger>

          <SelectContent>
            {pulseiras.map((p) => (
              <SelectItem key={p.code} value={p.code}>
                {p.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="submit"
          onClick={handleSend}
          className=" mt-4 w-full dark:bg-yellow-100 dark:hover:bg-yellow-200 "
        >
          Enviar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
