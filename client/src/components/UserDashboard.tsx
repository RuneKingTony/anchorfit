
import { useState, useEffect } from "react";
import { X, User, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import ProfileSection from "./dashboard/ProfileSection";
import OrdersSection from "./dashboard/OrdersSection";

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserDashboard = ({ isOpen, onClose }: UserDashboardProps) => {
  const { profile, refreshProfile, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (profile) {
      setInstagramUsername(profile.instagram_username || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  useEffect(() => {
    if (isOpen && profile) {
      fetchOrders();
    }
  }, [isOpen, profile]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instagram_username: instagramUsername,
          phone: phone,
        }),
      });

      if (response.ok) {
        await refreshProfile();
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  };

  if (!isOpen || !profile) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl animate-slide-in-right border-l border-white/10">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white">Dashboard</h2>
              <p className="text-gray-300">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-200" />
            </button>
          </div>

          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === "profile"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <User className="h-4 w-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === "orders"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Package className="h-4 w-4" />
              Orders
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <ProfileSection
                  instagramUsername={instagramUsername}
                  setInstagramUsername={setInstagramUsername}
                  phone={phone}
                  setPhone={setPhone}
                  updateProfile={updateProfile}
                />
              </div>
            )}

            {activeTab === "orders" && (
              <OrdersSection orders={orders} />
            )}
          </div>

          <div className="p-6 border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 px-4 rounded-lg transition-colors border border-red-600/30"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
