import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useState } from "react";

interface CartProps {
  selectedAddress?: any;
  onOrderComplete: () => void;
}

export function Cart({ selectedAddress, onOrderComplete }: CartProps) {
  const cartItems = useQuery(api.cart.getCart);
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const createOrder = useMutation(api.orders.createOrder);
  const addresses = useQuery(api.addresses.getUserAddresses);
  const [isOrdering, setIsOrdering] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const handleUpdateQuantity = async (itemId: Id<"cartItems">, newQuantity: number) => {
    try {
      await updateQuantity({ itemId, quantity: newQuantity });
    } catch (error) {
      toast.error("Erro ao atualizar quantidade");
    }
  };

  const getDeliveryAddress = () => {
    if (selectedAddress) {
      if (selectedAddress.isCurrentLocation) {
        return "Localização atual";
      }
      return `${selectedAddress.street}, ${selectedAddress.number}${selectedAddress.complement ? `, ${selectedAddress.complement}` : ""}, ${selectedAddress.neighborhood}, ${selectedAddress.city} - ${selectedAddress.state}`;
    }
    
    // Use default address if available
    const defaultAddress = addresses?.find(addr => addr.isDefault);
    if (defaultAddress) {
      return `${defaultAddress.street}, ${defaultAddress.number}${defaultAddress.complement ? `, ${defaultAddress.complement}` : ""}, ${defaultAddress.neighborhood}, ${defaultAddress.city} - ${defaultAddress.state}`;
    }
    
    return "";
  };

  const handleCreateOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Carrinho vazio");
      return;
    }

    const deliveryAddress = getDeliveryAddress();
    if (!deliveryAddress) {
      toast.error("Selecione um endereço de entrega");
      return;
    }

    setIsOrdering(true);
    try {
      const restaurant = cartItems[0].restaurant;
      const items = cartItems.map(item => ({
        productId: item.productId,
        name: item.product?.name || "",
        price: item.price,
        quantity: item.quantity,
      }));

      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const deliveryFee = restaurant?.deliveryFee || 0;
      const total = subtotal + deliveryFee;

      await createOrder({
        restaurantId: cartItems[0].restaurantId,
        items,
        total,
        deliveryFee,
        deliveryAddress,
        paymentMethod,
      });

      toast.success("Pedido realizado com sucesso!");
      onOrderComplete();
    } catch (error) {
      toast.error("Erro ao criar pedido");
    } finally {
      setIsOrdering(false);
    }
  };

  if (!cartItems) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl mb-4 block">🛒</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Carrinho vazio</h2>
        <p className="text-gray-600">Adicione alguns produtos para continuar</p>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cartItems[0].restaurant?.deliveryFee || 0;
  const total = subtotal + deliveryFee;
  const deliveryAddress = getDeliveryAddress();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Carrinho</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">
              Pedido de {cartItems[0].restaurant?.name}
            </h3>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.product?.image}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {item.product?.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        R$ {item.price.toFixed(2)} cada
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right min-w-[80px]">
                      <p className="font-bold text-gray-900">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Resumo do Pedido</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de entrega</span>
                <span>R$ {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço de entrega
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  {deliveryAddress ? (
                    <p className="text-sm text-gray-900">{deliveryAddress}</p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Selecione um endereço de entrega no topo da página
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Forma de pagamento
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="debit_card">Cartão de Débito</option>
                  <option value="pix">PIX</option>
                  <option value="cash">Dinheiro</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={handleCreateOrder}
              disabled={isOrdering || !deliveryAddress}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isOrdering ? "Finalizando..." : "Finalizar Pedido"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
