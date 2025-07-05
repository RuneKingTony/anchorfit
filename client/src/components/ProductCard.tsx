
import React, { useState, useEffect } from "react";
import { useCart, Product } from "@/contexts/CartContext";
import { ShoppingCart, Palette } from "lucide-react";
import ImageZoomModal from "./ImageZoomModal";

interface ProductCardProps {
  product: Product;
  animationDelay?: number;
}

const ProductCard = ({ product, animationDelay = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(product.color);
  const [isAdding, setIsAdding] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  const sizes = ["M", "L", "XL", "XXL"];
  const colors = product.images ? Object.keys(product.images) : ["Black", "Acid Washed"];
  
  // Define size availability for different colors
  const getAvailableSizes = (color: string) => {
    if (color === "Acid Washed") {
      return ["M", "L", "XL"]; // XXL not available for acid washed
    }
    return sizes; // All sizes available for other colors
  };
  
  const availableSizes = getAvailableSizes(selectedColor);

  // Auto-adjust selected size if current size is not available for selected color
  useEffect(() => {
    if (!availableSizes.includes(selectedSize)) {
      setSelectedSize(availableSizes[0]); // Default to first available size
    }
  }, [selectedColor, availableSizes, selectedSize]);

  const getImageUrl = () => {
    if (product.images && product.images[selectedColor]) {
      return product.images[selectedColor];
    }
    return product.image;
  };

  const getCurrentPrice = () => {
    if (product.prices && product.prices[selectedColor]) {
      return product.prices[selectedColor];
    }
    return product.price;
  };
  
  const currentImage = getImageUrl();
  const currentPrice = getCurrentPrice();

  const handleAddToCart = async (quickAdd = false) => {
    setIsAdding(true);
    
    const productToAdd = {
      ...product,
      size: quickAdd ? "M" : selectedSize,
      color: quickAdd ? product.color : selectedColor,
      image: quickAdd ? product.image : currentImage,
      price: quickAdd ? product.price : currentPrice,
    };
    
    addToCart(productToAdd);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <>
      <div 
        className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in hover:border-white/20 hover:bg-white/10"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden bg-black/20 h-64">
          <button
            type="button"
            onClick={() => setIsZoomModalOpen(true)}
            className="w-full h-full text-left"
            aria-label={`View ${product.name} in full screen`}
          >
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
            />
          </button>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 pointer-events-none"></div>
          
          {/* Quick Add Button */}
          <button
            onClick={() => handleAddToCart(true)}
            disabled={isAdding}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-white/20 hover:scale-110 disabled:opacity-50 border border-white/20"
          >
            <ShoppingCart className={`h-5 w-5 text-white ${isAdding ? 'animate-pulse' : ''}`} />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors">
            {product.name}
          </h3>
          
          <div className="text-2xl font-bold text-white mb-4">
            ₦{currentPrice.toLocaleString()}
          </div>

          {/* Size Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-2">Size</label>
            <div className="flex gap-2">
              {sizes.map((size) => {
                const isAvailable = availableSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => isAvailable && setSelectedSize(size)}
                    disabled={!isAvailable}
                    className={`w-10 h-10 rounded-lg border-2 font-medium text-sm transition-all duration-200 ${
                      selectedSize === size && isAvailable
                        ? "border-white/50 bg-white/20 text-white"
                        : isAvailable
                        ? "border-white/20 text-gray-200 hover:border-white/40 bg-white/5"
                        : "border-gray-600/20 text-gray-500 bg-gray-800/20 cursor-not-allowed opacity-50"
                    }`}
                    title={!isAvailable ? `${size} not available for ${selectedColor}` : undefined}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {selectedColor === "Acid Washed" && (
              <p className="text-xs text-gray-400 mt-1">XXL not available for Acid Washed</p>
            )}
          </div>

          {/* Color Selection */}
          {product.images && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                <Palette className="h-4 w-4" /> Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color
                        ? "border-white/60 ring-2 ring-white/30"
                        : "border-white/20 hover:border-white/40"
                    } ${
                      color === "Black" ? "bg-black" :
                      color === "Acid Washed" ? "bg-gradient-to-br from-gray-400 via-gray-600 to-gray-800" :
                      "bg-gray-500"
                    }`}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart(false)}
            disabled={isAdding}
            className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
      <ImageZoomModal
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        imageUrl={currentImage}
        productName={product.name}
      />
    </>
  );
};

export default ProductCard;
