import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function DashboardOverview() {
  const stats = useQuery(api.admin.getDashboardStats);

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total de Restaurantes",
      value: stats.totalRestaurants,
      icon: "🏪",
      color: "bg-blue-500",
    },
    {
      title: "Restaurantes Pendentes",
      value: stats.pendingRestaurants,
      icon: "⏳",
      color: "bg-yellow-500",
    },
    {
      title: "Pedidos Hoje",
      value: stats.todayOrders,
      icon: "📋",
      color: "bg-green-500",
    },
    {
      title: "Total de Usuários",
      value: stats.totalUsers,
      icon: "👥",
      color: "bg-purple-500",
    },
    {
      title: "Receita Total",
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: "💰",
      color: "bg-emerald-500",
    },
    {
      title: "Receita Hoje",
      value: `R$ ${stats.todayRevenue.toFixed(2)}`,
      icon: "📈",
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-2xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ações Rápidas
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-medium text-gray-900">Aprovar Restaurantes</p>
                  <p className="text-sm text-gray-600">{stats.pendingRestaurants} pendentes</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <p className="font-medium text-gray-900">Ver Relatórios</p>
                  <p className="text-sm text-gray-600">Análise de vendas</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Atividade Recente
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 p-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-gray-600">
                {stats.todayOrders} novos pedidos hoje
              </span>
            </div>
            <div className="flex items-center gap-3 p-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="text-gray-600">
                {stats.pendingRestaurants} restaurantes aguardando aprovação
              </span>
            </div>
            <div className="flex items-center gap-3 p-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-gray-600">
                {stats.totalUsers} usuários cadastrados
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
