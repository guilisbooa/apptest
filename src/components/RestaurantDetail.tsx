import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface RestaurantDetailProps {
  restaurantId: string;
  onBack: () => void;
}

export function RestaurantDetail({ restaurantId, onBack }: RestaurantDetailProps) {
  const restaurant = useQuery(api.restaurants.getRestaurant, { 
    restaurantId: restaurantId as Id<"restaurants"> 
  });
  const products = useQuery(api.restaurants.getProducts, { 
    restaurantId: restaurantId as Id<"restaurants"> 
  });
  const addToCart = useMutation(api.cart.addToCart);

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart({
        productId: product._id,
        restaurantId: restaurantId as Id<"restaurants">,
        quantity: 1,
        price: product.price,
      });
      toast.success(`${product.name} adicionado ao carrinho!`);
    } catch (error) {
      toast.error("Erro ao adicionar ao carrinho");
    }
  };

  if (!restaurant || !products) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2"
      >
        ← Voltar
      </button>

      {/* Restaurant Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
            {restaurant.image}
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{restaurant.name}</h1>
            <p className="text-gray-600 mb-3">{restaurant.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span>{restaurant.rating}</span>
              </div>
              <span>{restaurant.deliveryTime}</span>
              <span>Taxa: R$ {restaurant.deliveryFee.toFixed(2)}</span>
            </div>
            
            {restaurant.isOpen ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Aberto
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Fechado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Menu by Categories */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Cardápio</h2>
        
        {Object.keys(productsByCategory).length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhum produto disponível no momento.
          </p>
        ) : (
          <div className="space-y-8">
            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  {category}
                </h3>
                
                <div className="space-y-4">
                  {categoryProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-sm border p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {product.image}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 leading-tight">
                                {product.name}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {product.description}
                              </p>
                              <p className="text-lg font-bold text-red-600">
                                R$ {product.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={!restaurant.isOpen}
                            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                          >
                            {restaurant.isOpen ? "Adicionar" : "Fechado"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
