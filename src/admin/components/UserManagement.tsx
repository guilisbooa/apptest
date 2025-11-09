import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

export function UserManagement() {
  const users = useQuery(api.admin.getAllUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  if (!users) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h2>
        <div className="text-sm text-gray-600">
          Total: {users.length} usuários
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Detalhes do Usuário
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <p className="text-gray-900">{selectedUser.name || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-mail</label>
                  <p className="text-gray-900">{selectedUser.email || "N/A"}</p>
                </div>
              </div>
              
              {selectedUser.profile && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                      <p className="text-gray-900">{selectedUser.profile.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Telefone</label>
                      <p className="text-gray-900">{selectedUser.profile.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CPF</label>
                      <p className="text-gray-900">{selectedUser.profile.cpf}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                      <p className="text-gray-900">
                        {new Date(selectedUser.profile.birthDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Cadastro</label>
                <p className="text-gray-900">
                  {new Date(selectedUser._creationTime).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-mail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Cadastro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.profile?.fullName || user.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user._id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.profile?.phone || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user._creationTime).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
