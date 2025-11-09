import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AddressForm } from "./AddressForm";

interface LocationSelectorProps {
  onClose: () => void;
  onAddressSelect: (address: any) => void;
}

export function LocationSelector({ onClose, onAddressSelect }: LocationSelectorProps) {
  const addresses = useQuery(api.addresses.getUserAddresses);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  if (showAddressForm) {
    return (
      <AddressForm
        address={editingAddress}
        onClose={() => {
          setShowAddressForm(false);
          setEditingAddress(null);
        }}
        onSave={() => {
          setShowAddressForm(false);
          setEditingAddress(null);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Escolher Endereço</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Current Location Option */}
          <button
            onClick={() => {
              // Here you would implement geolocation
              onAddressSelect({
                street: "Localização Atual",
                isCurrentLocation: true
              });
              onClose();
            }}
            className="w-full p-4 border border-red-200 rounded-lg hover:bg-red-50 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-red-600 text-xl">📍</span>
              <div>
                <p className="font-medium text-red-600">Usar localização atual</p>
                <p className="text-sm text-gray-600">Detectar automaticamente</p>
              </div>
            </div>
          </button>

          {/* Saved Addresses */}
          {addresses && addresses.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Endereços salvos</h3>
              <div className="space-y-2">
                {addresses.map((address) => (
                  <div key={address._id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <button
                        onClick={() => {
                          onAddressSelect(address);
                          onClose();
                        }}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {address.label}
                          </span>
                          {address.isDefault && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                              Padrão
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.street}, {address.number}
                          {address.complement && `, ${address.complement}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.neighborhood}, {address.city} - {address.state}
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          setEditingAddress(address);
                          setShowAddressForm(true);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Address */}
          <button
            onClick={() => setShowAddressForm(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">➕</span>
              <span className="font-medium text-gray-700">Adicionar novo endereço</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
