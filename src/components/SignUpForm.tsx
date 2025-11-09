import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function SignUpForm({ onBackToSignIn }: { onBackToSignIn: () => void }) {
  const { signIn } = useAuthActions();
  const updateProfile = useMutation(api.users.updateUserProfile);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    cpf: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "cpf") {
      value = formatCPF(value);
    } else if (field === "phone") {
      value = formatPhone(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Nome completo é obrigatório");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("E-mail é obrigatório");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Senha deve ter pelo menos 6 caracteres");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Senhas não coincidem");
      return false;
    }

    if (!formData.birthDate) {
      toast.error("Data de nascimento é obrigatória");
      return false;
    }

    const age = calculateAge(formData.birthDate);
    if (age < 18) {
      toast.error("Você deve ter pelo menos 18 anos para se cadastrar");
      return false;
    }

    const cpfNumbers = formData.cpf.replace(/\D/g, "");
    if (cpfNumbers.length !== 11) {
      toast.error("CPF deve ter 11 dígitos");
      return false;
    }

    const phoneNumbers = formData.phone.replace(/\D/g, "");
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      toast.error("Telefone deve ter 10 ou 11 dígitos");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // First create the auth account
      await signIn("password", {
        email: formData.email,
        password: formData.password,
        flow: "signUp",
      });

      // Then create the user profile
      await updateProfile({
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        cpf: formData.cpf,
        phone: formData.phone,
      });

      toast.success("Conta criada com sucesso!");
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Criar Conta</h2>
        <p className="text-gray-600 mt-2">Preencha seus dados para se cadastrar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className="auth-input-field"
            placeholder="Digite seu nome completo"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="auth-input-field"
            placeholder="Digite seu e-mail"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Nascimento
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange("birthDate", e.target.value)}
            className="auth-input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CPF
          </label>
          <input
            type="text"
            value={formData.cpf}
            onChange={(e) => handleInputChange("cpf", e.target.value)}
            className="auth-input-field"
            placeholder="000.000.000-00"
            maxLength={14}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="auth-input-field"
            placeholder="(00) 00000-0000"
            maxLength={15}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="auth-input-field"
            placeholder="Digite sua senha"
            minLength={6}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Senha
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className="auth-input-field"
            placeholder="Confirme sua senha"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="auth-button"
        >
          {isLoading ? "Criando conta..." : "Criar Conta"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBackToSignIn}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Já tem uma conta? Fazer login
        </button>
      </div>
    </div>
  );
}
