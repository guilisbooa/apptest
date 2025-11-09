import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { api } from "../convex/_generated/api";
import { RestaurantList } from "./components/RestaurantList";
import { RestaurantDetail } from "./components/RestaurantDetail";
import { Cart } from "./components/Cart";
import { Orders } from "./components/Orders";
import { ProfileViews } from "./components/ProfileViews";
import { SeedData } from "./components/SeedData";
import { AdminApp } from "./admin/AdminApp";

type View = "restaurants" | "restaurant-detail" | "cart" | "orders" | "profile" | "admin";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("restaurants");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  const user = useQuery(api.auth.loggedInUser);
  const cartItems = useQuery(api.cart.getCartItems) || [];

  const handleSelectRestaurant = (id: string) => {
    setSelectedRestaurantId(id);
    setCurrentView("restaurant-detail");
  };

  const handleBackToRestaurants = () => {
    setCurrentView("restaurants");
    setSelectedRestaurantId("");
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const renderContent = () => {
    switch (currentView) {
      case "restaurants":
        return <RestaurantList onSelectRestaurant={handleSelectRestaurant} />;
      case "restaurant-detail":
        return (
          <RestaurantDetail
            restaurantId={selectedRestaurantId}
            onBack={handleBackToRestaurants}
          />
        );
      case "cart":
        return <Cart onBack={() => setCurrentView("restaurants")} />;
      case "orders":
        return <Orders />;
      case "profile":
        return <ProfileViews />;
      case "admin":
        return <AdminApp />;
      default:
        return <RestaurantList onSelectRestaurant={handleSelectRestaurant} />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Unauthenticated>
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🍕 Dooki
              </h1>
              <p className="text-gray-600">Sua comida favorita na palma da mão</p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <header className="bg-white shadow-sm border-b sticky top-0 z-40">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    🍕 Dooki
                  </h1>
                  {user && (
                    <span className="text-sm text-gray-600">
                      Olá, {user.name || "Usuário"}!
                    </span>
                  )}
                </div>
                <SignOutButton />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <SeedData />
                {renderContent()}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <nav className="bg-white border-t sticky bottom-0 z-40">
            <div className="flex">
              <button
                onClick={() => setCurrentView("restaurants")}
                className={`flex-1 py-3 px-4 text-center transition-colors ${
                  currentView === "restaurants" || currentView === "restaurant-detail"
                    ? "text-yellow-600 bg-yellow-50"
                    : "text-gray-600 hover:text-yellow-600"
                }`}
              >
                <div className="text-xl mb-1">🏪</div>
                <div className="text-xs font-medium">Restaurantes</div>
              </button>

              <button
                onClick={() => setCurrentView("cart")}
                className={`flex-1 py-3 px-4 text-center transition-colors relative ${
                  currentView === "cart"
                    ? "text-yellow-600 bg-yellow-50"
                    : "text-gray-600 hover:text-yellow-600"
                }`}
              >
                <div className="text-xl mb-1">🛒</div>
                <div className="text-xs font-medium">Carrinho</div>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView("orders")}
                className={`flex-1 py-3 px-4 text-center transition-colors ${
                  currentView === "orders"
                    ? "text-yellow-600 bg-yellow-50"
                    : "text-gray-600 hover:text-yellow-600"
                }`}
              >
                <div className="text-xl mb-1">📋</div>
                <div className="text-xs font-medium">Pedidos</div>
              </button>

              <button
                onClick={() => setCurrentView("profile")}
                className={`flex-1 py-3 px-4 text-center transition-colors ${
                  currentView === "profile"
                    ? "text-yellow-600 bg-yellow-50"
                    : "text-gray-600 hover:text-yellow-600"
                }`}
              >
                <div className="text-xl mb-1">👤</div>
                <div className="text-xs font-medium">Perfil</div>
              </button>

              {user?.email === "admin@dooki.com" && (
                <button
                  onClick={() => setCurrentView("admin")}
                  className={`flex-1 py-3 px-4 text-center transition-colors ${
                    currentView === "admin"
                      ? "text-yellow-600 bg-yellow-50"
                      : "text-gray-600 hover:text-yellow-600"
                  }`}
                >
                  <div className="text-xl mb-1">🛠️</div>
                  <div className="text-xs font-medium">Admin</div>
                </button>
              )}
            </div>
          </nav>
        </div>
      </Authenticated>
    </main>
  );
}
