import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";

export function BannerManagement() {
  const banners = useQuery(api.admin.getBanners);
  const createBanner = useMutation(api.admin.createBanner);
  const updateBanner = useMutation(api.admin.updateBanner);
  const deleteBanner = useMutation(api.admin.deleteBanner);
  
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "🎉",
    color: "bg-gradient-to-r from-red-500 to-red-600",
    isActive: true,
  });

  const colorOptions = [
    { value: "bg-gradient-to-r from-red-500 to-red-600", label: "Vermelho", preview: "bg-red-500" },
    { value: "bg-gradient-to-r from-blue-500 to-blue-600", label: "Azul", preview: "bg-blue-500" },
    { value: "bg-gradient-to-r from-green-500 to-green-600", label: "Verde", preview: "bg-green-500" },
    { value: "bg-gradient-to-r from-orange-500 to-orange-600", label: "Laranja", preview: "bg-orange-500" },
    { value: "bg-gradient-to-r from-purple-500 to-purple-600", label: "Roxo", preview: "bg-purple-500" },
    { value: "bg-gradient-to-r from-pink-500 to-pink-600", label: "Rosa", preview: "bg-pink-500" },
  ];

  const emojiOptions = ["🎉", "🚚", "🍕", "🍔", "🎁", "⭐", "🔥", "💯", "🎊", "🌟"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBanner) {
        await updateBanner({
          bannerId: editingBanner._id,
          ...formData,
        });
        toast.success("Banner atualizado com sucesso!");
      } else {
        await createBanner(formData);
        toast.success("Banner criado com sucesso!");
      }
      
      setShowForm(false);
      setEditingBanner(null);
      setFormData({
        title: "",
        subtitle: "",
        image: "🎉",
        color: "bg-gradient-to-r from-red-500 to-red-600",
        isActive: true,
      });
    } catch (error) {
      toast.error("Erro ao salvar banner");
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      color: banner.color,
      isActive: banner.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (bannerId: Id<"banners">) => {
    if (!confirm("Tem certeza que deseja excluir este banner?")) return;
    
    try {
      await deleteBanner({ bannerId });
      toast.success("Banner excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir banner");
    }
  };

  if (!banners) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Gerenciar Banners</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Novo Banner
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingBanner ? "Editar Banner" : "Novo Banner"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emoji
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: emoji }))}
                      className={`p-3 text-2xl border rounded-lg hover:bg-gray-50 ${
                        formData.image === emoji ? "border-blue-500 bg-blue-50" : "border-gray-300"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor de Fundo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                      className={`p-3 border rounded-lg hover:bg-gray-50 flex items-center gap-2 ${
                        formData.color === color.value ? "border-blue-500 bg-blue-50" : "border-gray-300"
                      }`}
                    >
                      <div className={`w-4 h-4 ${color.preview} rounded`}></div>
                      <span className="text-sm">{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Banner ativo
                  </span>
                </label>
              </div>
              
              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pré-visualização
                </label>
                <div className={`${formData.color} text-white p-6 rounded-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{formData.title || "Título"}</h3>
                      <p className="text-white/90">{formData.subtitle || "Subtítulo"}</p>
                    </div>
                    <span className="text-4xl">{formData.image}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingBanner ? "Atualizar" : "Criar"} Banner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingBanner(null);
                    setFormData({
                      title: "",
                      subtitle: "",
                      image: "🎉",
                      color: "bg-gradient-to-r from-red-500 to-red-600",
                      isActive: true,
                    });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className={`${banner.color} text-white p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-1">{banner.title}</h3>
                  <p className="text-white/90 text-sm">{banner.subtitle}</p>
                </div>
                <span className="text-3xl">{banner.image}</span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  banner.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {banner.isActive ? "Ativo" : "Inativo"}
                </span>
                <span className="text-sm text-gray-500">
                  Ordem: {banner.order}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(banner)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(banner._id)}
                  className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
