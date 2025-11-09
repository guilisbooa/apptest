import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { SignUpForm } from "./SignUpForm";

export function AuthForm() {
  const { signIn } = useAuthActions();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn("password", { email, password, flow: "signIn" });
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error("E-mail ou senha incorretos");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSignUp) {
    return <SignUpForm onBackToSignIn={() => setIsSignUp(false)} />;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Entrar</h2>
        <p className="text-gray-600 mt-2">Faça login para continuar</p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input-field"
            placeholder="Digite seu e-mail"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input-field"
            placeholder="Digite sua senha"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="auth-button"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsSignUp(true)}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Não tem uma conta? Cadastre-se
        </button>
      </div>
    </div>
  );
}
