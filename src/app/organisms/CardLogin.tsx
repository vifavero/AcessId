import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import logo from "src/assets/images/cqv.png";

export function CardLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.error || data?.message || "Erro ao logar";
        throw new Error(msg);
      }

      if (!data?.token) {
        throw new Error("Token não recebido do servidor.");
      }

      localStorage.setItem("token", data.token);
      navigate("/list");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 items-center justify-center w-screen h-screen bg-[url('/images/pattern.png')] bg-cover bg-center p-4">
      <Card className="flex w-full md:w-1/2 h-1/2 bg-yellow-100 items-center justify-center border-none">
        <img
          className="h-1/2 md:h-full w-auto object-contain"
          src={logo}
          alt="Logo CQV"
        />
      </Card>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full md:w-1/2 items-center "
      >
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          className="bg-blue-100 border-none text-white"
          required
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Digite sua senha"
          className="bg-blue-100 border-none text-white"
          required
        />

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <Button
          type="submit"
          className="w-full  bg-blue-dark mt-2  dark:bg-yellow-100 dark:hover:bg-yellow-200"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
