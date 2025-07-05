
import { useState } from "react";
import { ShoppingCart, Menu, X, User, LogIn } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onCartClick: () => void;
  onAuthClick: () => void;
  onDashboardClick: () => void;
}

const Header = ({ onCartClick, onAuthClick, onDashboardClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, loading } = useAuth();

  return (
    <header className="backdrop-blur-md bg-black/20 border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">
              Anchor Fit
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-white hover:text-gray-200 transition-colors font-medium">
              Home
            </a>
            <a href="#products" className="text-white hover:text-gray-200 transition-colors font-medium">
              Products
            </a>
            
            <a href="#contact" className="text-white hover:text-gray-200 transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* Cart and Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <button
                    onClick={onDashboardClick}
                    className="p-2 text-white hover:text-gray-200 transition-colors"
                    title="Dashboard"
                  >
                    <User className="h-6 w-6" />
                  </button>
                ) : (
                  <button
                    onClick={onAuthClick}
                    className="p-2 text-white hover:text-gray-200 transition-colors"
                    title="Sign In"
                  >
                    <LogIn className="h-6 w-6" />
                  </button>
                )}
              </>
            )}

            <button
              onClick={onCartClick}
              className="relative p-2 text-white hover:text-gray-200 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:text-gray-200 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <a href="#home" className="text-white hover:text-gray-200 transition-colors font-medium py-2">
                Home
              </a>
              <a href="#products" className="text-white hover:text-gray-200 transition-colors font-medium py-2">
                Products
              </a>
              <a href="#about" className="text-white hover:text-gray-200 transition-colors font-medium py-2">
                About
              </a>  
              <a href="#contact" className="text-white hover:text-gray-200 transition-colors font-medium py-2">
                Contact
              </a>
              
              {!loading && (
                <div className="pt-2 border-t border-white/10">
                  {user ? (
                    <button
                      onClick={() => {
                        onDashboardClick();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors font-medium py-2 w-full"
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onAuthClick();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors font-medium py-2 w-full"
                    >
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </button>
                  )}
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
