import { useState } from "react";

interface FilterState {
  category: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  paymentMethod: string;
  freeDelivery: boolean;
}

interface RestaurantFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export function RestaurantFilters({ onFiltersChange }: RestaurantFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    rating: 0,
    deliveryTime: "",
    deliveryFee: "",
    paymentMethod: "",
    freeDelivery: false,
  });

  const categories = [
    "Hambúrgueres", "Pizza", "Japonesa", "Mexicana", "Italiana", 
    "Brasileira", "Chinesa", "Árabe", "Vegetariana", "Doces"
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      category: "",
      rating: 0,
      deliveryTime: "",
      deliveryFee: "",
      paymentMethod: "",
      freeDelivery: false,
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== "" && value !== 0 && value !== false
  );

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <span>🔍</span>
          <span className="font-medium">Filtros</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {isOpen && (
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="">Todas</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avaliação mínima
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value={0}>Qualquer</option>
                <option value={4.5}>4.5+ ⭐</option>
                <option value={4.0}>4.0+ ⭐</option>
                <option value={3.5}>3.5+ ⭐</option>
              </select>
            </div>

            {/* Delivery Time Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo de entrega
              </label>
              <select
                value={filters.deliveryTime}
                onChange={(e) => handleFilterChange("deliveryTime", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="">Qualquer</option>
                <option value="fast">Até 30 min</option>
                <option value="medium">30-45 min</option>
                <option value="slow">Mais de 45 min</option>
              </select>
            </div>

            {/* Delivery Fee Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxa de entrega
              </label>
              <select
                value={filters.deliveryFee}
                onChange={(e) => handleFilterChange("deliveryFee", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="">Qualquer</option>
                <option value="free">Grátis</option>
                <option value="low">Até R$ 5</option>
                <option value="medium">R$ 5-10</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pagamento
              </label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="">Qualquer</option>
                <option value="pix">PIX</option>
                <option value="credit_card">Cartão de Crédito</option>
                <option value="cash">Dinheiro</option>
              </select>
            </div>

            {/* Free Delivery Filter */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="freeDelivery"
                checked={filters.freeDelivery}
                onChange={(e) => handleFilterChange("freeDelivery", e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="freeDelivery" className="ml-2 text-sm text-gray-700">
                Apenas frete grátis
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
