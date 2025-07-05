
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";
import { Product } from "@/contexts/CartContext";

interface ProductSectionProps {
  id: string;
  title: string;
  subtitle: string;
  products: Product[];
  showNewBadge?: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
  showViewAllButton?: boolean;
  viewAllLink?: string;
}

const ProductSection = ({ 
  id, 
  title, 
  subtitle, 
  products, 
  showNewBadge = false,
  backgroundImage,
  backgroundColor = "bg-gradient-to-br from-gray-900 via-black to-gray-800",
  showViewAllButton = false,
  viewAllLink = "#products"
}: ProductSectionProps) => {
  const sectionStyle = backgroundImage ? {
    backgroundImage: `url('${backgroundImage}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {};

  return (
    <section id={id} className={`py-16 relative ${backgroundColor}`} style={sectionStyle}>
      {backgroundImage && <div className="absolute inset-0 bg-black/50"></div>}
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader title={title} subtitle={subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={product.id} className="relative">
              {showNewBadge && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  NEW
                </div>
              )}
              <ProductCard 
                product={product}
                animationDelay={index * 100}
              />
            </div>
          ))}
        </div>

        {showViewAllButton && (
          <div className="text-center mt-8">
            <a 
              href={viewAllLink}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              View All Products
              <span>→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
