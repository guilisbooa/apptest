import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function BannerCarousel() {
  const banners = useQuery(api.admin.getActiveBanners) || [];
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative mb-6">
      <div className="overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner) => (
            <div
              key={banner._id}
              className={`w-full flex-shrink-0 ${banner.color} text-white p-6 rounded-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">{banner.title}</h3>
                  <p className="text-white/90">{banner.subtitle}</p>
                </div>
                <span className="text-4xl">{banner.image}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {banners.length > 1 && (
        <div className="flex justify-center mt-3 gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentBanner ? "bg-red-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
