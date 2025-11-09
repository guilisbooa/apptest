import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Orders } from "./Orders";
import { LocationSelector } from "./LocationSelector";
import { useState } from "react";

interface ProfileViewsProps {
  currentView: "profile" | "orders" | "coupons" | "addresses" | "help";
  onBack: () => void;
}

export function ProfileViews({ currentView, onBack }: ProfileViewsProps) {
  const userProfile = useQuery(api.users.getProfile);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  if (currentView === "orders") {
    return (
      <div>
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2"
        >
          ← Voltar
        </button>
        <Orders />
      </div>
    );
  }

  if (currentView === "addresses") {
    return (
      <div>
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2"
        >
          ← Voltar
        </button>
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meus Endereços</h2>
          <button
            onClick={() => setShowLocationSelector(true)}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Gerenciar Endereços
          </button>
        </div>
        
        {showLocationSelector && (
          <LocationSelector
            onClose={() => setShowLocationSelector(false)}
            onAddressSelect={() => {}}
          />
        )}
      </div>
    );
  }

  if (currentView === "profile") {
    return (
      <div>
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2"
        >
          ← Voltar
        </button>
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meu Perfil</h2>
          
          {userProfile?.profile ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <p className="mt-1 text-gray-900">{userProfile.profile.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <p className="mt-1 text-gray-900">{userProfile.user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <p className="mt-1 text-gray-900">{userProfile.profile.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CPF</label>
                <p className="mt-1 text-gray-900">{userProfile.profile.cpf}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                <p className="mt-1 text-gray-900">
                  {new Date(userProfile.profile.birthDate).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Perfil não encontrado</p>
          )}
        </div>
      </div>
    );
  }

  if (currentView === "coupons") {
    return (
      <div>
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2"
        >
          ← Voltar
        </button>
        <div className="bg-white rounded-lg p-6 text-center">
          <span className="text-6xl mb-4 block">🎫</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cupons</h2>
          <p className="text-gray-600">Você não tem cupons disponíveis no momento</p>
        </div>
      </div>
    );
  }

  if (currentView === "help") {
    return (
      <div>
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2"
        >
          ← Voltar
        </button>
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ajuda</h2>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Como fazer um pedido?</h3>
              <p className="text-gray-600 text-sm">
                Escolha um restaurante, adicione produtos ao carrinho e finalize o pedido.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Formas de pagamento</h3>
              <p className="text-gray-600 text-sm">
                Aceitamos cartão de crédito, débito, PIX e dinheiro.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Tempo de entrega</h3>
              <p className="text-gray-600 text-sm">
                O tempo varia de acordo com o restaurante e sua localização.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Suporte</h3>
              <p className="text-gray-600 text-sm">
                Entre em contato conosco pelo e-mail: suporte@ifood.com.br
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
