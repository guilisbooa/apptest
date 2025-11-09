import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface CartProps {
  onBack: () => void;
}

export function Cart({ onBack }: CartProps) {
  const cartItems = useQuery(api.cart.getCartItems) || [];
  const addresses = useQuery(api.addresses.getUserAddresses) || [];
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const clearCart = useMutation(api.cart.clearCart);
  const createOrder = useMutation(api.orders.createOrder);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleUpdateQuantity = async (itemId: Id<"cartItems">, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart({ itemId });
      return;
    }
    
    try {
      await updateQuantity({ itemId, quantity });
    } catch (error) {
      toast.error("Erro ao atualizar quantidade");
    }
  };

  const handleRemoveItem = async (itemId: Id<"cartItems">) => {
    try {
      await removeFromCart({ itemId });
      toast.success("Item removido do carrinho");
    } catch (error) {
      toast.error("Erro ao remover item");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Carrinho vazio");
      return;
    }

    if (!selectedAddress) {
      toast.error("Selecione um endereço de entrega");
      return;
    }

    setIsCheckingOut(true);
    
    try {
      const address = addresses.find(addr => addr._id === selectedAddress);
      const deliveryAddress = `${address?.street}, ${address?.number}, ${address?.neighborhood}, ${address?.city} - ${address?.state}`;
      
      await createOrder({
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name || "Produto",
          price: item.price,
          quantity: item.quantity,
        })),
        restaurantId: cartItems[0].restaurantId,
        deliveryAddress,
        paymentMethod,
      });

      await clearCart();
      toast.success("Pedido realizado com sucesso!");
      onBack();
    } catch (error) {
      toast.error("Erro ao finalizar pedido");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.length > 0 ? 5.99 : 0;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Seu carrinho está vazio
        </h2>
        <p className="text-gray-600 mb-6">
          Adicione alguns itens deliciosos para começar!
        </p>
        <button
          onClick={onBack}
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
        >
          Ver Restaurantes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Voltar
        </button>
        <h2 className="text-xl font-bold text-gray-900">Carrinho</h2>
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Seus Itens</h3>
        </div>
        
        <div className="divide-y">
          {cartItems.map((item) => (
            <div key={item._id} className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                  🍽️
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {item.name || "Produto"}
                  </h4>
                  <p className="text-yellow-600 font-semibold">
                    R$ {item.price.toFixed(2)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="text-red-600 hover:text-red-700 ml-2"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Endereço de Entrega</h3>
        {addresses.length === 0 ? (
          <p className="text-gray-600 text-sm">
            Nenhum endereço cadastrado. Adicione um endereço no seu perfil.
          </p>
        ) : (
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
          >
            <option value="">Selecione um endereço</option>
            {addresses.map((address) => (
              <option key={address._id} value={address._id}>
                {address.label} - {address.street}, {address.number}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Forma de Pagamento</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="credit_card"
              checked={paymentMethod === "credit_card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-yellow-600 focus:ring-yellow-500"
            />
            <span>💳 Cartão de Crédito</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="debit_card"
              checked={paymentMethod === "debit_card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-yellow-600 focus:ring-yellow-500"
            />
            <span>💳 Cartão de Débito</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="pix"
              checked={paymentMethod === "pix"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-yellow-600 focus:ring-yellow-500"
            />
            <span>📱 PIX</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-yellow-600 focus:ring-yellow-500"
            />
            <span>💵 Dinheiro</span>
          </label>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Resumo do Pedido</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxa de entrega</span>
            <span>R$ {deliveryFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-yellow-600">R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isCheckingOut || !selectedAddress}
        className="w-full bg-yellow-500 text-white py-4 px-4 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
      >
        {isCheckingOut ? "Finalizando..." : `Finalizar Pedido - R$ ${total.toFixed(2)}`}
      </button>
    </div>
  );
}
