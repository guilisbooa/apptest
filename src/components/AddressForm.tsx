import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface AddressFormProps {
  address?: any;
  onClose: () => void;
  onSave: () => void;
}

export function AddressForm({ address, onClose, onSave }: AddressFormProps) {
  const addAddress = useMutation(api.addresses.addAddress);
  const updateAddress = useMutation(api.addresses.updateAddress);
  const deleteAddress = useMutation(api.addresses.deleteAddress);
  
  const [formData, setFormData] = useState({
    street: address?.street || "",
    number: address?.number || "",
    complement: address?.complement || "",
    neighborhood: address?.neighborhood || "",
    city: address?.city || "",
    state: address?.state || "",
    zipCode: address?.zipCode || "",
    label: address?.label || "Casa",
    isDefault: address?.isDefault || false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === "zipCode" && typeof value === "string") {
      value = formatZipCode(value);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (address) {
        await updateAddress({
          addressId: address._id,
          ...formData,
        });
        toast.success("Endereço atualizado com sucesso!");
      } else {
        await addAddress(formData);
        toast.success("Endereço adicionado com sucesso!");
      }
      onSave();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar endereço");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!address) return;
    
    if (confirm("Tem certeza que deseja excluir este endereço?")) {
      setIsLoading(true);
      try {
        await deleteAddress({ addressId: address._id });
        toast.success("Endereço excluído com sucesso!");
        onSave();
      } catch (error: any) {
        toast.error(error.message || "Erro ao excluir endereço");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {address ? "Editar Endereço" : "Novo Endereço"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de endereço
            </label>
            <select
              value={formData.label}
              onChange={(e) => handleInputChange("label", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            >
              <option value="Casa">🏠 Casa</option>
              <option value="Trabalho">🏢 Trabalho</option>
              <option value="Outro">📍 Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CEP
            </label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="00000-000"
              maxLength={9}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rua
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="Nome da rua"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número
              </label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => handleInputChange("number", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="123"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complemento (opcional)
            </label>
            <input
              type="text"
              value={formData.complement}
              onChange={(e) => handleInputChange("complement", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="Apto, bloco, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bairro
            </label>
            <input
              type="text"
              value={formData.neighborhood}
              onChange={(e) => handleInputChange("neighborhood", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="Nome do bairro"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="Cidade"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="SP"
                maxLength={2}
                required
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => handleInputChange("isDefault", e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
              Definir como endereço padrão
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            {address && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                Excluir
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
