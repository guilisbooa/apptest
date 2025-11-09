import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Orders() {
  const orders = useQuery(api.orders.getUserOrders) || [];

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Nenhum pedido encontrado
        </h2>
        <p className="text-gray-600">
          Quando você fizer um pedido, ele aparecerá aqui.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "preparing": return "bg-orange-100 text-orange-800";
      case "delivering": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pendente";
      case "confirmed": return "Confirmado";
      case "preparing": return "Preparando";
      case "delivering": return "Entregando";
      case "delivered": return "Entregue";
      case "cancelled": return "Cancelado";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Meus Pedidos</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {order.restaurant?.name || "Restaurante"}
                </h3>
                <p className="text-sm text-gray-600">
                  Pedido #{order._id.slice(-6)} • {new Date(order._creationTime).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            
            <div className="space-y-2 mb-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>Entrega: R$ {order.deliveryFee.toFixed(2)}</p>
                <p>Pagamento: {order.paymentMethod}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-yellow-600">
                  R$ {order.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
