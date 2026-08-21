"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "cadastro";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState<{ tipo: "erro" | "sucesso"; texto: string } | null>(null);

  const resetar = () => {
    setNome("");
    setEmail("");
    setSenha("");
    setConfirmarSenha("");
    setMensagem(null);
  };

  const alternarModo = () => {
    resetar();
    setMode((prev) => (prev === "login" ? "cadastro" : "login"));
  };

  const validar = () => {
    if (!email || !senha) {
      setMensagem({ tipo: "erro", texto: "Preencha todos os campos obrigatórios." });
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setMensagem({ tipo: "erro", texto: "Informe um email válido." });
      return false;
    }
    if (mode === "cadastro" && senha !== confirmarSenha) {
      setMensagem({ tipo: "erro", texto: "As senhas não coincidem." });
      return false;
    }
    if (mode === "cadastro" && senha.length < 6) {
      setMensagem({ tipo: "erro", texto: "A senha deve ter pelo menos 6 caracteres." });
      return false;
    }
    if (mode === "cadastro" && !/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~]/.test(senha)) {
      setMensagem({ tipo: "erro", texto: "A senha deve conter pelo menos um caractere especial." });
      return false;
    }
    return true;
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);
    if (!validar()) return;

    if (mode === "cadastro") {
      setMensagem({ tipo: "sucesso", texto: "Cadastro realizado com sucesso!" });
      resetar();
    } else {
      setMensagem({ tipo: "sucesso", texto: "Login efetuado com sucesso!" });
      setTimeout(() => router.push("/jogo"), 600);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-black/[.08] bg-white p-8 shadow-sm dark:border-white/[.145] dark:bg-black">
        <h1 className="text-center text-2xl font-semibold text-black dark:text-zinc-50">
          {mode === "login" ? "Login" : "Cadastro"}
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {mode === "login" ? "Entre com sua conta" : "Crie sua conta"}
        </p>

        {mensagem && (
          <div
            className={`mt-4 rounded-lg px-4 py-3 text-sm ${
              mensagem.tipo === "erro"
                ? "border border-red-500/40 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200"
                : "border border-green-500/40 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-200"
            }`}
          >
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={enviar} className="mt-6 flex flex-col gap-4">
          {mode === "cadastro" && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-black dark:text-zinc-50">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="rounded-lg border border-black/[.12] px-3 py-2 text-sm outline-none transition focus:border-black dark:border-white/[.145] dark:bg-black dark:text-zinc-50"
                placeholder="Seu nome"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-black dark:text-zinc-50">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-black/[.12] px-3 py-2 text-sm outline-none transition focus:border-black dark:border-white/[.145] dark:bg-black dark:text-zinc-50"
              placeholder="seu@email.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-black dark:text-zinc-50">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="rounded-lg border border-black/[.12] px-3 py-2 text-sm outline-none transition focus:border-black dark:border-white/[.145] dark:bg-black dark:text-zinc-50"
              placeholder="••••••"
            />
          </div>

          {mode === "cadastro" && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-black dark:text-zinc-50">Confirmar senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="rounded-lg border border-black/[.12] px-3 py-2 text-sm outline-none transition focus:border-black dark:border-white/[.145] dark:bg-black dark:text-zinc-50"
                placeholder="••••••"
              />
            </div>
          )}

          <button
            type="submit"
            className="mt-2 flex h-10 w-full items-center justify-center rounded-full bg-foreground text-background text-sm font-medium transition hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            {mode === "login" ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button
            type="button"
            onClick={alternarModo}
            className="font-medium text-zinc-950 underline dark:text-zinc-50"
          >
            {mode === "login" ? "Cadastre-se" : "Entre"}
          </button>
        </p>
      </div>
    </div>
  );
}
