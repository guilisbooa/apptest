import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function SeedData() {
  const seedRestaurants = useMutation(api.restaurants.seedRestaurants);
  const seedProducts = useMutation(api.restaurants.seedProducts);
  const seedAdmins = useMutation(api.admin.seedAdmins);
  const seedBanners = useMutation(api.admin.seedBanners);

  const handleSeedData = async () => {
    try {
      await seedRestaurants();
      await seedProducts();
      await seedAdmins();
      await seedBanners();
      toast.success("Dados de exemplo carregados!");
    } catch (error) {
      toast.error("Erro ao carregar dados");
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={handleSeedData}
        className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
      >
        🌱 Carregar Dados de Exemplo
      </button>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Clique para adicionar restaurantes, produtos e configurações iniciais
      </p>
    </div>
  );
}
