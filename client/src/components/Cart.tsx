
import { useState, useEffect } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { nigerianStates } from "@/lib/nigerian-states";
import { useToast } from "@/components/ui/use-toast";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, applyPromoCode, discount, promoCode } = useCart();
  const { user, profile, session } = useAuth();
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerState, setCustomerState] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const SHIPPING_FEE = 3500;
  
  useEffect(() => {
    if (user && profile) {
      setCustomerName(profile.full_name || "");
      setCustomerEmail(profile.email || "");
      setCustomerPhone(profile.phone || "");
    }
  }, [user, profile, isOpen]);

  const handlePromoCode = async () => {
    const success = await applyPromoCode(promoInput);
    if (success) {
      setPromoMessage(`Promo code "${promoInput}" applied! ${discount}% off`);
      setPromoInput("");
    } else {
      setPromoMessage("Invalid promo code");
    }
    
    setTimeout(() => setPromoMessage(""), 3000);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    return getSubtotal() * (discount / 100);
  };

  const getFinalTotal = () => {
    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount();
    return subtotal - discountAmount + SHIPPING_FEE;
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to complete your order.", variant: "destructive" });
      return;
    }

    if (!customerEmail || !customerName || !customerAddress || !customerState || !customerPhone) {
      toast({ title: "Missing Information", description: "Please enter your name, email, delivery address, state, and phone number.", variant: "destructive" });
      return;
    }

    if (items.length === 0) {
      toast({ title: "Empty Cart", description: "Your cart is empty.", variant: "destructive" });
      return;
    }

    setLoading(true);
    console.log("Initiating checkout...");

    try {
      const token = session?.access_token;
      if (!token) {
        toast({ title: "Authentication Error", description: "Please sign in again.", variant: "destructive" });
        return;
      }

      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerDetails: { 
            name: customerName, 
            email: customerEmail,
            address: customerAddress,
            phone: customerPhone,
            state: customerState,
          },
          discount,
          promoCode,
          shippingFee: SHIPPING_FEE
        }),
      });

      const data = await response.json();
      console.log("process-payment API response:", data);

      if (!response.ok) {
        console.error('Payment API error:', data.error);
        toast({ title: "Payment Error", description: data.error || 'An unknown error occurred.', variant: "destructive" });
        return;
      }

      if (data.success) {
        toast({ title: "Redirecting to Payment", description: "You will be redirected to Paystack to complete your payment." });
        window.location.href = data.authorization_url;
      } else {
        console.error("Payment processing failed:", data.error);
        toast({ title: "Payment Failed", description: data.error || 'An unknown error occurred.', variant: "destructive" });
      }
    } catch (error) {
      console.error('Payment error in catch block:', error);
      const errorMessage = (error as Error).message || "Failed to process payment";
      toast({ title: "Checkout Error", description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
      console.log("Checkout process finished.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Cart Panel - Made wider and more responsive */}
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-black/90 backdrop-blur-md shadow-2xl animate-slide-in-right border-l border-white/10">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-gray-200" />
              <h2 className="text-xl font-bold text-white">
                Your Cart ({getTotalItems()})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-200" />
            </button>
          </div>

          {/* Main Content - Made responsive with grid layout */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center py-8 p-6">
                <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-200 text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-2">Add some gym gear to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Cart Items Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Items in Cart</h3>
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-16 h-16 object-cover rounded-lg bg-gray-600 flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{item.name}</h3>
                        <p className="text-sm text-gray-200">
                          {item.size} • {item.color}
                        </p>
                        <p className="text-gray-200 font-bold">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateQuantity(`${item.id}-${item.size}-${item.color}`, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/20"
                        >
                          <Minus className="h-4 w-4 text-white" />
                        </button>
                        
                        <span className="w-8 text-center font-semibold text-white">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(`${item.id}-${item.size}-${item.color}`, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/20"
                        >
                          <Plus className="h-4 w-4 text-white" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(`${item.id}-${item.size}-${item.color}`)}
                        className="text-red-400 hover:text-red-300 p-1 transition-colors flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Checkout Form Section */}
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Checkout Details</h3>
                    
                    {!user && (
                      <div className="bg-yellow-500/20 border border-yellow-500/30 p-3 rounded-lg mb-4">
                        <p className="text-yellow-400 text-sm">
                          Please sign in to complete your order
                        </p>
                      </div>
                    )}

                    {/* Customer Details */}
                    <div className="space-y-3 mb-6">
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-transparent bg-white/5 text-white placeholder-gray-400 backdrop-blur-sm"
                      />
                      <input
                        type="email"
                        placeholder="Your Email Address"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-transparent bg-white/5 text-white placeholder-gray-400 backdrop-blur-sm"
                      />
                      <input
                        type="text"
                        placeholder="Your Delivery Address"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-transparent bg-white/5 text-white placeholder-gray-400 backdrop-blur-sm"
                      />
                      <Select value={customerState} onValueChange={setCustomerState}>
                        <SelectTrigger className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-transparent bg-white/5 text-white placeholder-gray-400 backdrop-blur-sm [&>span]:text-gray-400 [&>span:not(:has([data-placeholder]))]:text-white">
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 text-white border-white/20 backdrop-blur-lg">
                          {nigerianStates.map((state) => (
                            <SelectItem key={state} value={state} className="focus:bg-white/20">
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input
                        type="tel"
                        placeholder="Your Phone Number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-transparent bg-white/5 text-white placeholder-gray-400 backdrop-blur-sm"
                      />
                    </div>

                    {/* Promo Code */}
                    <div className="mb-6">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter promo code"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="flex-1 px-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-transparent bg-white/5 text-white placeholder-gray-400 backdrop-blur-sm"
                        />
                        <button
                          onClick={handlePromoCode}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors border border-white/20 backdrop-blur-sm"
                        >
                          Apply
                        </button>
                      </div>
                      
                      {promoMessage && (
                        <p className={`text-sm mt-2 ${promoMessage.includes("Invalid") ? "text-red-400" : "text-green-400"}`}>
                          {promoMessage}
                        </p>
                      )}
                      
                      {promoCode && (
                        <p className="text-sm text-green-400 mt-2">
                          ✓ {promoCode} applied ({discount}% off)
                        </p>
                      )}
                    </div>

                    {/* Total */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-gray-200">
                        <span>Subtotal:</span>
                        <span>₦{getSubtotal().toLocaleString()}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between text-green-400">
                          <span>Discount ({discount}%):</span>
                          <span>-₦{getDiscountAmount().toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-gray-200">
                        <span>Shipping:</span>
                        <span>₦{SHIPPING_FEE.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10">
                        <span>Total:</span>
                        <span>₦{getFinalTotal().toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={!user || !customerEmail || !customerName || !customerAddress || !customerPhone || !customerState || loading}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-white/5 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                    >
                      <span>💳</span>
                      {loading ? "Processing..." : `Pay with Paystack (₦${getFinalTotal().toLocaleString()})`}
                    </button>
                    
                    <p className="text-sm text-gray-400 text-center mt-3">
                      {user ? "Secure payment with Paystack" : "Sign in required to complete order"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
