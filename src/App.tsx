import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { AuthForm } from "./components/AuthForm";
import { Toaster } from "sonner";
import { useState } from "react";
import { RestaurantList } from "./components/RestaurantList";
import { RestaurantDetail } from "./components/RestaurantDetail";
import { Cart } from "./components/Cart";
import { Orders } from "./components/Orders";
import { SeedData } from "./components/SeedData";
import { LocationSelector } from "./components/LocationSelector";
import { ProfileMenu } from "./components/ProfileMenu";
import { ProfileViews } from "./components/ProfileViews";

export default function App() {
  const [currentView, setCurrentView] = useState<"restaurants" | "cart" | "orders" | "profile">("restaurants");
  const [profileView, setProfileView] = useState<"profile" | "orders" | "coupons" | "addresses" | "help" | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const handleProfileViewChange = (view: "profile" | "orders" | "coupons" | "addresses" | "help") => {
    setProfileView(view);
    setCurrentView("profile");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Mobile-first header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="px-4 h-14 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 
              className="text-xl font-bold text-red-600 cursor-pointer"
              onClick={() => {
                setCurrentView("restaurants");
                setSelectedRestaurant(null);
                setProfileView(null);
              }}
            >
              🍔 iFood
            </h1>
          </div>
          
          <Authenticated>
            <ProfileMenu onViewChange={handleProfileViewChange} />
          </Authenticated>
        </div>

        {/* Location bar - only show when authenticated and not in auth flow */}
        <Authenticated>
          <div className="px-4 py-2 bg-gray-50 border-t">
            <button
              onClick={() => setShowLocationSelector(true)}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600"
            >
              <span className="text-red-600">📍</span>
              <span className="truncate">
                {selectedAddress 
                  ? selectedAddress.isCurrentLocation 
                    ? "Localização atual"
                    : `${selectedAddress.street}, ${selectedAddress.number}`
                  : "Escolher endereço de entrega"
                }
              </span>
              <span className="text-gray-400">▼</span>
            </button>
          </div>
        </Authenticated>
      </header>

      <main className="flex-1">
        <Content 
          currentView={currentView}
          profileView={profileView}
          selectedRestaurant={selectedRestaurant}
          selectedAddress={selectedAddress}
          setSelectedRestaurant={setSelectedRestaurant}
          setCurrentView={setCurrentView}
          setProfileView={setProfileView}
        />
      </main>

      {/* Mobile bottom navigation */}
      <Authenticated>
        <nav className="sticky bottom-0 bg-white border-t">
          <div className="flex">
            <button
              onClick={() => {
                setCurrentView("restaurants");
                setSelectedRestaurant(null);
                setProfileView(null);
              }}
              className={`flex-1 py-3 px-2 text-center ${
                currentView === "restaurants" 
                  ? "text-red-600 bg-red-50" 
                  : "text-gray-600"
              }`}
            >
              <div className="text-xl mb-1">🏠</div>
              <div className="text-xs font-medium">Início</div>
            </button>
            <button
              onClick={() => {
                setCurrentView("cart");
                setProfileView(null);
              }}
              className={`flex-1 py-3 px-2 text-center ${
                currentView === "cart" 
                  ? "text-red-600 bg-red-50" 
                  : "text-gray-600"
              }`}
            >
              <div className="text-xl mb-1">🛒</div>
              <div className="text-xs font-medium">Carrinho</div>
            </button>
            <button
              onClick={() => {
                setCurrentView("orders");
                setProfileView(null);
              }}
              className={`flex-1 py-3 px-2 text-center ${
                currentView === "orders" 
                  ? "text-red-600 bg-red-50" 
                  : "text-gray-600"
              }`}
            >
              <div className="text-xl mb-1">📋</div>
              <div className="text-xs font-medium">Pedidos</div>
            </button>
          </div>
        </nav>
      </Authenticated>

      {/* Location Selector Modal */}
      {showLocationSelector && (
        <LocationSelector
          onClose={() => setShowLocationSelector(false)}
          onAddressSelect={setSelectedAddress}
        />
      )}
      
      <Toaster />
    </div>
  );
}

function Content({ 
  currentView, 
  profileView,
  selectedRestaurant, 
  selectedAddress,
  setSelectedRestaurant,
  setCurrentView,
  setProfileView
}: {
  currentView: "restaurants" | "cart" | "orders" | "profile";
  profileView: "profile" | "orders" | "coupons" | "addresses" | "help" | null;
  selectedRestaurant: string | null;
  selectedAddress: any;
  setSelectedRestaurant: (id: string | null) => void;
  setCurrentView: (view: "restaurants" | "cart" | "orders" | "profile") => void;
  setProfileView: (view: "profile" | "orders" | "coupons" | "addresses" | "help" | null) => void;
}) {
  const userProfile = useQuery(api.users.getProfile);

  if (userProfile === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-20">
      <Unauthenticated>
        <div className="max-w-md mx-auto mt-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bem-vindo ao iFood Clone
            </h2>
            <p className="text-gray-600">
              Faça login para começar a pedir sua comida favorita
            </p>
          </div>
          <AuthForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        <SeedData />
        
        {currentView === "profile" && profileView ? (
          <ProfileViews 
            currentView={profileView}
            onBack={() => {
              setCurrentView("restaurants");
              setProfileView(null);
            }}
          />
        ) : selectedRestaurant ? (
          <RestaurantDetail 
            restaurantId={selectedRestaurant}
            onBack={() => setSelectedRestaurant(null)}
          />
        ) : (
          <>
            {currentView === "restaurants" && (
              <RestaurantList onSelectRestaurant={setSelectedRestaurant} />
            )}
            {currentView === "cart" && (
              <Cart 
                selectedAddress={selectedAddress}
                onOrderComplete={() => setCurrentView("orders")} 
              />
            )}
            {currentView === "orders" && <Orders />}
          </>
        )}
      </Authenticated>
    </div>
  );
}
