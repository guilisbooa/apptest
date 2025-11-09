import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { AddressForm } from "./AddressForm";

type ProfileView = "main" | "personal" | "addresses" | "payment" | "notifications" | "help";

export function ProfileViews() {
  const [currentView, setCurrentView] = useState<ProfileView>("main");
  const user = useQuery(api.auth.loggedInUser);
  const userProfile = useQuery(api.users.getUserProfile);
  const addresses = useQuery(api.addresses.getUserAddresses) || [];
  const updateProfile = useMutation(api.users.updateUserProfile);
  const deleteAddress = useMutation(api.addresses.deleteAddress);

  const [profileData, setProfileData] = useState({
    fullName: "",
    birthDate: "",
    cpf: "",
    phone: "",
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Tem certeza que deseja excluir este endereço?")) return;
    
    try {
      await deleteAddress({ addressId: addressId as any });
      toast.success("Endereço excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir endereço");
    }
  };

  const renderMainView = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {user?.name || "Usuário"}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setCurrentView("personal")}
          className="w-full bg-white rounded-lg p-4 shadow-sm border text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">📝</span>
              <div>
                <p className="font-medium text-gray-900">Dados Pessoais</p>
                <p className="text-sm text-gray-600">Nome, CPF, telefone</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </button>

        <button
          onClick={() => setCurrentView("addresses")}
          className="w-full bg-white rounded-lg p-4 shadow-sm border text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-medium text-gray-900">Endereços</p>
                <p className="text-sm text-gray-600">{addresses.length} endereços salvos</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </button>

        <button
          onClick={() => setCurrentView("payment")}
          className="w-full bg-white rounded-lg p-4 shadow-sm border text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">💳</span>
              <div>
                <p className="font-medium text-gray-900">Pagamento</p>
                <p className="text-sm text-gray-600">Cartões e métodos de pagamento</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </button>

        <button
          onClick={() => setCurrentView("notifications")}
          className="w-full bg-white rounded-lg p-4 shadow-sm border text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔔</span>
              <div>
                <p className="font-medium text-gray-900">Notificações</p>
                <p className="text-sm text-gray-600">Configurar alertas</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </button>

        <button
          onClick={() => setCurrentView("help")}
          className="w-full bg-white rounded-lg p-4 shadow-sm border text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">❓</span>
              <div>
                <p className="font-medium text-gray-900">Ajuda</p>
                <p className="text-sm text-gray-600">Suporte e FAQ</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderPersonalView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentView("main")}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Voltar
        </button>
        <h2 className="text-xl font-bold text-gray-900">Dados Pessoais</h2>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento
            </label>
            <input
              type="date"
              value={profileData.birthDate}
              onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF
            </label>
            <input
              type="text"
              value={profileData.cpf}
              onChange={(e) => setProfileData(prev => ({ ...prev, cpf: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              placeholder="(11) 99999-9999"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );

  const renderAddressesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("main")}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Voltar
          </button>
          <h2 className="text-xl font-bold text-gray-900">Endereços</h2>
        </div>
        <button
          onClick={() => setShowAddressForm(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
        >
          + Adicionar
        </button>
      </div>

      {showAddressForm && (
        <AddressForm
          address={editingAddress}
          onSave={() => {
            setShowAddressForm(false);
            setEditingAddress(null);
          }}
          onCancel={() => {
            setShowAddressForm(false);
            setEditingAddress(null);
          }}
        />
      )}

      <div className="space-y-3">
        {addresses.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
            <p className="text-gray-500">Nenhum endereço cadastrado</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address._id} className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">{address.label}</span>
                    {address.isDefault && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Padrão
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {address.street}, {address.number}
                    {address.complement && `, ${address.complement}`}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {address.neighborhood}, {address.city} - {address.state}
                  </p>
                  <p className="text-gray-600 text-sm">CEP: {address.zipCode}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingAddress(address);
                      setShowAddressForm(true);
                    }}
                    className="text-yellow-600 hover:text-yellow-700 text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address._id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderPaymentView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentView("main")}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Voltar
        </button>
        <h2 className="text-xl font-bold text-gray-900">Pagamento</h2>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">💳</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Métodos de Pagamento
          </h3>
          <p className="text-gray-600 mb-4">
            Adicione cartões e configure seus métodos de pagamento preferidos
          </p>
          <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium">
            Adicionar Cartão
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentView("main")}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Voltar
        </button>
        <h2 className="text-xl font-bold text-gray-900">Notificações</h2>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Pedidos</p>
              <p className="text-sm text-gray-600">Receber atualizações sobre seus pedidos</p>
            </div>
            <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Promoções</p>
              <p className="text-sm text-gray-600">Ofertas especiais e descontos</p>
            </div>
            <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Novos Restaurantes</p>
              <p className="text-sm text-gray-600">Quando novos restaurantes chegarem na sua região</p>
            </div>
            <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelpView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentView("main")}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Voltar
        </button>
        <h2 className="text-xl font-bold text-gray-900">Ajuda</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="font-medium text-gray-900 mb-2">📞 Atendimento</h3>
          <p className="text-gray-600 text-sm mb-2">
            Precisa de ajuda? Entre em contato conosco:
          </p>
          <p className="text-gray-900 font-medium">
            WhatsApp: (11) 99999-9999
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="font-medium text-gray-900 mb-2">❓ Perguntas Frequentes</h3>
          <div className="space-y-2 text-sm">
            <details className="cursor-pointer">
              <summary className="font-medium text-gray-700">Como cancelar um pedido?</summary>
              <p className="text-gray-600 mt-1">
                Você pode cancelar seu pedido até que ele seja confirmado pelo restaurante.
              </p>
            </details>
            <details className="cursor-pointer">
              <summary className="font-medium text-gray-700">Qual o tempo de entrega?</summary>
              <p className="text-gray-600 mt-1">
                O tempo varia de acordo com o restaurante e sua localização.
              </p>
            </details>
            <details className="cursor-pointer">
              <summary className="font-medium text-gray-700">Como alterar meu endereço?</summary>
              <p className="text-gray-600 mt-1">
                Acesse a seção "Endereços" no seu perfil para gerenciar seus endereços.
              </p>
            </details>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="font-medium text-gray-900 mb-2">📧 Contato</h3>
          <p className="text-gray-600 text-sm">
            Email: suporte@dooki.com
          </p>
        </div>
      </div>
    </div>
  );

  switch (currentView) {
    case "personal":
      return renderPersonalView();
    case "addresses":
      return renderAddressesView();
    case "payment":
      return renderPaymentView();
    case "notifications":
      return renderNotificationsView();
    case "help":
      return renderHelpView();
    default:
      return renderMainView();
  }
}
