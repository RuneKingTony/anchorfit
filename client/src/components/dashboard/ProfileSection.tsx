
import { User, Phone } from "lucide-react";

interface ProfileSectionProps {
  instagramUsername: string;
  setInstagramUsername: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  updateProfile: () => void;
}

const ProfileSection = ({ 
  instagramUsername, 
  setInstagramUsername, 
  phone, 
  setPhone, 
  updateProfile 
}: ProfileSectionProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <User className="h-6 w-6 text-white" />
        <h3 className="text-lg font-semibold text-white">Profile Information</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Instagram Username (Optional)
          </label>
          <input
            type="text"
            value={instagramUsername}
            onChange={(e) => setInstagramUsername(e.target.value)}
            placeholder="@your_username"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Phone className="inline h-4 w-4 mr-1" />
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 xxx xxx xxxx"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        <button
          onClick={updateProfile}
          className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors border border-white/20"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
