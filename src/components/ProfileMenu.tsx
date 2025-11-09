import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignOutButton } from "../SignOutButton";

interface ProfileMenuProps {
  onViewChange: (view: "profile" | "orders" | "coupons" | "addresses" | "help") => void;
}

export function ProfileMenu({ onViewChange }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const user = useQuery(api.auth.loggedInUser);
  const userProfile = useQuery(api.users.getUserProfile);

  const menuItems = [
    { id: "profile", label: "Ver perfil", icon: "👤" },
    { id: "orders", label: "Pedidos", icon: "📋" },
    { id: "coupons", label: "Cupons", icon: "🎫" },
    { id: "addresses", label: "Endereços", icon: "📍" },
    { id: "help", label: "Ajuda", icon: "❓" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100"
      >
        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-medium">
          {userProfile?.fullName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-4 border-b">
              <p className="font-medium text-gray-900">
                {userProfile?.fullName || user?.name || "Usuário"}
              </p>
              <p className="text-sm text-gray-600">
                {user?.email}
              </p>
            </div>
            
            <div className="py-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id as any);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-gray-700">{item.label}</span>
                </button>
              ))}
            </div>
            
            <div className="border-t p-2">
              <SignOutButton />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
