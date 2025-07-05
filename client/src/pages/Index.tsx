
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Cart from "@/components/Cart";
import PromoSection from "@/components/PromoSection";
import NewlyReleased from "@/components/NewlyReleased";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import UserDashboard from "@/components/UserDashboard";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Check for referral code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      localStorage.setItem('referralCode', refCode);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <Header 
            onCartClick={() => setIsCartOpen(true)}
            onAuthClick={() => setIsAuthOpen(true)}
            onDashboardClick={() => setIsDashboardOpen(true)}
          />
          <Hero />
          <NewlyReleased />
          <PromoSection />
          <ProductGrid />
          <Footer />
          <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
          <UserDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
          <Toaster />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default Index;
