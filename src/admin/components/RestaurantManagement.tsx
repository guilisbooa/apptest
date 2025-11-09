import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";

export function RestaurantManagement() {
  const restaurants = useQuery(api.admin.getAllRestaurants);
  const updateStatus = useMutation(api.admin.updateRestaurantStatus);
  const updateRestaurant = useMutation(api.admin.updateRestaurant);
  const deleteRestaurant = useMutation(api.admin.deleteRestaurant);
  
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});

  const handleStatusUpdate = async (restaurantId: Id<"restaurants">, status: string) => {
    try {
      await updateStatus({ restaurantId, status });
      toast.success(`Status atualizado para ${status}`);
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const handleEdit = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
    setEditData({
      name: restaurant.name,
      description: restaurant.description,
      category: restaurant.category,
      deliveryTime: restaurant.deliveryTime,
      deliveryFee: restaurant.deliveryFee,
      minimumOrder: restaurant.minimumOrder,
      isOpen: restaurant.isOpen,
      address: restaurant.address || "",
      phone: restaurant.phone || "",
    });
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedRestaurant) return;
    
    try {
      await updateRestaurant({
        restaurantId: selectedRestaurant._id,
        ...editData,
      });
      toast.success("Restaurante atualizado com sucesso!");
      setEditMode(false);
      setSelectedRestaurant(null);
    } catch (error) {
      toast.error("Erro ao atualizar restaurante");
    }
  };

  const handleDelete = async (restaurantId: Id<"restaurants">) => {
    if (!confirm("Tem certeza que deseja excluir este restaurante?")) return;
    
    try {
      await deleteRestaurant({ restaurantId });
      toast.success("Restaurante excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir restaurante");
    }
  };

  if (!restaurants) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Gerenciar Restaurantes</h2>
        <div className="text-sm text-gray-600">
          Total: {restaurants.length} restaurantes
        </div>
      </div>

      {editMode && selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Editar Restaurante
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <input
                  type="text"
                  value={editData.category}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tempo de Entrega
                </label>
                <input
                  type="text"
                  value={editData.deliveryTime}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, deliveryTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="30-45 min"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taxa de Entrega (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editData.deliveryFee}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, deliveryFee: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pedido Mínimo (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editData.minimumOrder}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, minimumOrder: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  value={editData.phone}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  value={editData.address}
                  onChange={(e) => setEditData((prev: any) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editData.isOpen}
                    onChange={(e) => setEditData((prev: any) => ({ ...prev, isOpen: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Restaurante aberto
                  </span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setSelectedRestaurant(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avaliação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {restaurants.map((restaurant) => (
                <tr key={restaurant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{restaurant.image}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {restaurant.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {restaurant.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {restaurant.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(restaurant.status || "pending")}`}>
                      {restaurant.status || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ⭐ {restaurant.rating}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {(restaurant.status === "pending" || !restaurant.status) && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(restaurant._id, "approved")}
                          className="text-green-600 hover:text-green-900"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(restaurant._id, "rejected")}
                          className="text-red-600 hover:text-red-900"
                        >
                          Rejeitar
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleEdit(restaurant)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(restaurant._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
