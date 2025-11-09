import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { AdminUser } from "../AdminApp";

interface AdminLoginProps {
  onLogin: (user: AdminUser) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const adminAuth = useQuery(
    api.admin.loginAdmin,
    credentials.username && credentials.password ? credentials : "skip"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    
    // Wait for the query to complete
    setTimeout(() => {
      if (adminAuth) {
        onLogin(adminAuth);
        toast.success("Login realizado com sucesso!");
      } else {
        toast.error("Credenciais inválidas");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🛠️ Admin Panel
          </h1>
          <p className="text-gray-600">Sistema de Administração</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Contas de Teste:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>admin</strong> / admin123 (Super Admin)</p>
            <p><strong>manager</strong> / manager123 (Admin)</p>
            <p><strong>support</strong> / support123 (Moderador)</p>
            <p><strong>finance</strong> / finance123 (Admin)</p>
            <p><strong>marketing</strong> / marketing123 (Moderador)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
