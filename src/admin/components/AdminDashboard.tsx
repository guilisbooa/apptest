import { useState } from "react";
import { AdminUser } from "../AdminApp";
import { DashboardOverview } from "./DashboardOverview";
import { RestaurantManagement } from "./RestaurantManagement";
import { OrderManagement } from "./OrderManagement";
import { UserManagement } from "./UserManagement";
import { BannerManagement } from "./BannerManagement";
import { RevenueReports } from "./RevenueReports";

interface AdminDashboardProps {
  adminUser: AdminUser;
  onLogout: () => void;
}

type AdminView = "dashboard" | "restaurants" | "orders" | "users" | "banners" | "revenue";

export function AdminDashboard({ adminUser, onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "restaurants", label: "Restaurantes", icon: "🏪" },
    { id: "orders", label: "Pedidos", icon: "📋" },
    { id: "users", label: "Usuários", icon: "👥" },
    { id: "banners", label: "Banners", icon: "🎨" },
    { id: "revenue", label: "Receitas", icon: "💰" },
  ];

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardOverview />;
      case "restaurants":
        return <RestaurantManagement />;
      case "orders":
        return <OrderManagement />;
      case "users":
        return <UserManagement />;
      case "banners":
        return <BannerManagement />;
      case "revenue":
        return <RevenueReports />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              🛠️ Admin Panel
            </h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {adminUser.role}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Olá, {adminUser.name}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentView(item.id as AdminView)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      currentView === item.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
