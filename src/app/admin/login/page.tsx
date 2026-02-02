"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";

const AdminLoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
      callbackUrl: "/admin/bookings",
    });

    setLoading(false);

    if (result?.error) {
      setError("Login ou senha inválidos.");
      return;
    }

    router.push("/admin/bookings");
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Login do Administrador</h1>
      <p className="text-sm text-gray-400">
        Entre com o usuário e a senha de administrador.
      </p>

      <Input
        placeholder="Login"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button
        type="button"
        onClick={handleLogin}
        disabled={!username || !password || loading}
      >
        {loading ? "Entrando..." : "Entrar"}
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={() => router.push("/")}
      >
        Voltar
      </Button>
    </div>
  );
};

export default AdminLoginPage;
