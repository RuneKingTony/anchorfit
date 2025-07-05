
import { useState } from 'react';
import { Share2, Copy, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ReferralSectionProps {
  referrals: any[];
}

const ReferralSection = ({ referrals }: ReferralSectionProps) => {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyReferralCode = async () => {
    if (profile?.referral_code) {
      await navigator.clipboard.writeText(profile.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Share2 className="h-6 w-6 text-white" />
        <h3 className="text-lg font-semibold text-white">Referral Program</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Your Referral Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={profile?.referral_code || ""}
              disabled
              className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white font-mono"
            />
            <button
              onClick={copyReferralCode}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-white" />}
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-white/5 to-white/10 p-4 rounded-lg border border-white/20">
          <h4 className="font-semibold text-white mb-2">How it works:</h4>
          <ul className="text-sm text-gray-200 space-y-1">
            <li>• Share your referral code with friends</li>
            <li>• They get 25% off their first order</li>
            <li>• You get rewards when they purchase</li>
          </ul>
        </div>

        {referrals.length > 0 && (
          <div>
            <h4 className="font-semibold text-white mb-2">Your Referrals ({referrals.length})</h4>
            <div className="space-y-2">
              {referrals.map((referral: any) => (
                <div key={referral.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                  <span className="text-gray-200">{referral.referred.full_name}</span>
                  <span className="text-green-400 text-sm">
                    {referral.reward_claimed ? "Rewarded" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralSection;
