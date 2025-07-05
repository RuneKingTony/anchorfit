
import { useState } from "react";
import SectionHeader from "./SectionHeader";
import ImageZoomModal from "./ImageZoomModal";

const LifestyleGallery = () => {
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  const lifestyleImages = [
    {
      id: "lifestyle-1",
      url: "/lovable-uploads/499fdfcb-0381-46c1-8cb3-58a3a2232c47.png",
      title: "No Chicken Legs Allowed",
      category: "Street Style",
      featured: true
    },
    {
      id: "lifestyle-2", 
      url: "/lovable-uploads/4b56c7e8-199b-43c3-8da4-cabba924ccc1.png",
      title: "Stronger Than Your Boyfriend",
      category: "Gym Vibes",
      featured: true
    },
    {
      id: "lifestyle-3",
      url: "/lovable-uploads/0727ec4b-d908-4bbf-bba0-3d64abe34c7b.png",
      title: "Stronger Than Your Boyfriend",
      category: "Profile Shot",
      featured: false
    },
    {
      id: "lifestyle-4",
      url: "/lovable-uploads/19ff475a-642d-4e8b-8a0e-803d4ca9d60a.png",
      title: "Squad Goals",
      category: "Team Style",
      featured: true
    },
    {
      id: "lifestyle-5",
      url: "/lovable-uploads/75a7b315-21ef-4c10-a79a-cfa5eb13a8ea.png",
      title: "Anchored Style",
      category: "Casual Look",
      featured: false
    },
    {
      id: "lifestyle-6",
      url: "/lovable-uploads/ae5159b3-ef06-4022-9326-ea89daabe516.png",
      title: "Anchored Confidence",
      category: "Studio Style",
      featured: false
    },
    {
      id: "lifestyle-7",
      url: "/lovable-uploads/02d1bfe2-f666-4564-ba90-83360ff20752.png",
      title: "Certified Muscle Mummy",
      category: "Back Design",
      featured: true
    },
    {
      id: "lifestyle-8",
      url: "/lovable-uploads/7d8a1ac5-26e4-4f39-9bdf-9d4806ef2ad8.png",
      title: "Certified Muscle Mummy",
      category: "Full View",
      featured: false
    },
    {
      id: "lifestyle-9",
      url: "/lovable-uploads/c90bf555-d88c-49dc-89a0-06d7e698b57e.png",
      title: "Certified Muscle Mummy",
      category: "Detail Shot",
      featured: false
    },
    {
      id: "lifestyle-10",
      url: "/lovable-uploads/87d67687-7ee3-460e-b429-43ba6f0363d6.png",
      title: "Shut Up and Squat",
      category: "Gym Action",
      featured: true
    }
  ];

  const handleImageClick = (image: { url: string; title: string }) => {
    setSelectedImage(image);
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-gray-800 relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-l from-blue-500/10 via-cyan-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader 
            title="🔥 Real People, Real Style" 
            subtitle="See how our premium gym wear transforms everyday athletes into champions"
          />

          {/* Masonry-style grid with featured items */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-max">
            {lifestyleImages.map((image, index) => (
              <div 
                key={image.id}
                className={`
                  group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:z-20
                  ${image.featured ? 'md:col-span-2 md:row-span-2' : 'col-span-1 row-span-1'}
                  bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-sm
                  border border-white/20 hover:border-white/40
                  shadow-lg hover:shadow-2xl hover:shadow-purple-500/20
                `}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  transform: `perspective(1000px) rotateX(${Math.random() * 2 - 1}deg) rotateY(${Math.random() * 2 - 1}deg)`
                }}
                onClick={() => handleImageClick({ url: image.url, title: image.title })}
              >
                <div className={`relative ${image.featured ? 'aspect-square md:aspect-[4/3]' : 'aspect-square'}`}>
                  <img
                    src={image.url}
                    alt={image.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Animated border effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-red-500/50 blur-sm animate-pulse"></div>
                    <div className="absolute inset-[2px] bg-black/20 backdrop-blur-sm rounded-2xl"></div>
                  </div>

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded-full backdrop-blur-sm">
                          {image.category}
                        </span>
                        {image.featured && (
                          <span className="text-xs font-bold text-purple-400 bg-purple-400/20 px-2 py-1 rounded-full backdrop-blur-sm">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold truncate">{image.title}</p>
                    </div>
                  </div>

                  {/* Zoom icon */}
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>

                  {/* Sparkle effects for featured items */}
                  {image.featured && (
                    <>
                      <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                      <div className="absolute bottom-2 right-2 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Call to action section */}
          <div className="text-center mt-16">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Join the Movement
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                Tag us in your workout photos and become part of the Anchor community
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-4 py-2 rounded-full font-semibold border border-purple-500/30 backdrop-blur-sm">
                  #AnchorGymWear
                </span>
                <span className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 px-4 py-2 rounded-full font-semibold border border-blue-500/30 backdrop-blur-sm">
                  #GymLifestyle
                </span>
                <span className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 px-4 py-2 rounded-full font-semibold border border-green-500/30 backdrop-blur-sm">
                  #FitnessStyle
                </span>
              </div>
              <button className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold py-3 px-8 rounded-full transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                Shop Your Style 🛒
              </button>
            </div>
          </div>
        </div>
      </section>

      {selectedImage && (
        <ImageZoomModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.url}
          productName={selectedImage.title}
        />
      )}
    </>
  );
};

export default LifestyleGallery;
