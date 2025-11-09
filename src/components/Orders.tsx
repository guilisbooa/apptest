import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Orders() {
  const orders = useQuery(api.orders.getUserOrders);

  if (!orders) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl mb-4 block">📋</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum pedido ainda</h2>
        <p className="text-gray-600">Seus pedidos aparecerão aqui</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-orange-100 text-orange-800";
      case "delivering":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "confirmed":
        return "Confirmado";
      case "preparing":
        return "Preparando";
      case "delivering":
        return "Saiu para entrega";
      case "delivered":
        return "Entregue";
      default:
        return status;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Meus Pedidos</h2>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{order.restaurant?.image}</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {order.restaurant?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order._creationTime).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Itens do pedido:</h4>
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R$ {(order.total - order.deliveryFee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de entrega</span>
                  <span>R$ {order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>R$ {order.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Endereço:</strong> {order.deliveryAddress}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Pagamento:</strong> {order.paymentMethod === "credit_card" ? "Cartão de Crédito" : 
                    order.paymentMethod === "debit_card" ? "Cartão de Débito" :
                    order.paymentMethod === "pix" ? "PIX" : "Dinheiro"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
