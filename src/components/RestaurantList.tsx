import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { BannerCarousel } from "./BannerCarousel";
import { RestaurantFilters } from "./RestaurantFilters";

interface RestaurantListProps {
  onSelectRestaurant: (id: string) => void;
}

interface FilterState {
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  paymentMethod: string;
  freeDelivery: boolean;
}

export function RestaurantList({ onSelectRestaurant }: RestaurantListProps) {
  const restaurants = useQuery(api.restaurants.getRestaurants);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    rating: 0,
    deliveryTime: "",
    deliveryFee: "",
    paymentMethod: "",
    freeDelivery: false,
  });

  if (!restaurants) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Nenhum restaurante encontrado. Use o botão acima para carregar dados de exemplo.
        </p>
      </div>
    );
  }

  // Filter restaurants based on selected filters
  const filteredRestaurants = restaurants.filter((restaurant: any) => {
    if (filters.category && restaurant.category !== filters.category) return false;
    if (filters.rating && restaurant.rating < filters.rating) return false;
    if (filters.freeDelivery && restaurant.deliveryFee > 0) return false;
    
    if (filters.deliveryTime) {
      const timeNumber = parseInt(restaurant.deliveryTime.split("-")[0]);
      if (filters.deliveryTime === "fast" && timeNumber > 30) return false;
      if (filters.deliveryTime === "medium" && (timeNumber < 30 || timeNumber > 45)) return false;
      if (filters.deliveryTime === "slow" && timeNumber <= 45) return false;
    }
    
    if (filters.deliveryFee) {
      if (filters.deliveryFee === "free" && restaurant.deliveryFee > 0) return false;
      if (filters.deliveryFee === "low" && restaurant.deliveryFee > 5) return false;
      if (filters.deliveryFee === "medium" && (restaurant.deliveryFee < 5 || restaurant.deliveryFee > 10)) return false;
    }
    
    if (filters.paymentMethod && restaurant.paymentMethods) {
      if (!restaurant.paymentMethods.includes(filters.paymentMethod)) return false;
    }
    
    return true;
  });

  return (
    <div>
      <BannerCarousel />
      
      <h2 className="text-xl font-bold text-gray-900 mb-4">Restaurantes</h2>
      
      <RestaurantFilters onFiltersChange={setFilters} />
      
      <div className="space-y-4">
        {filteredRestaurants.map((restaurant: any) => (
          <div
            key={restaurant._id}
            onClick={() => onSelectRestaurant(restaurant._id)}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {restaurant.image}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                        {restaurant.name}
                      </h3>
                    </div>
                    
                    {restaurant.isOpen ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
                        Aberto
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex-shrink-0">
                        Fechado
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium">{restaurant.rating}</span>
                      </div>
                      <span className="text-gray-600">{restaurant.deliveryTime}</span>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-gray-600">
                        {restaurant.deliveryFee === 0 ? (
                          <span className="text-green-600 font-medium">Grátis</span>
                        ) : (
                          `R$ ${restaurant.deliveryFee.toFixed(2)}`
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
