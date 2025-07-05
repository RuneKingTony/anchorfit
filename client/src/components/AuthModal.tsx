
import { useState } from "react";
import { X, User, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.needsVerification) {
            setError("Please verify your email before signing in. Check your inbox for the verification link.");
          } else {
            setError(error.message);
          }
        } else {
          onClose();
          resetForm();
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message);
        } else {
          setMessage("Account created! Please check your email for verification link.");
          setTimeout(() => {
            onClose();
            resetForm();
          }, 3000);
        }
      } else if (mode === 'forgot') {
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        
        if (response.ok) {
          setMessage(data.message);
          setTimeout(() => {
            setMode('login');
            setMessage("");
          }, 3000);
        } else {
          setError(data.error);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setError("");
    setMessage("");
    setMode('login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-black/90 backdrop-blur-md shadow-2xl animate-slide-in-right border-l border-white/10">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">
              {mode === 'login' ? "Welcome Back" : mode === 'signup' ? "Join Anchor Fit" : "Reset Password"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-200" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Enter your full name"
                      required={mode === 'signup'}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className={`p-3 rounded-lg text-sm ${
                  error.includes("Check your email") 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-95 border border-white/20"
              >
                {loading ? "Please wait..." : 
                 mode === 'login' ? "Sign In" : 
                 mode === 'signup' ? "Create Account" : 
                 "Send Reset Link"}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 mb-6 flex items-center">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={() => window.location.href = '/api/auth/google'}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-95 border border-gray-300 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="mt-6 text-center space-y-2">
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/reset-password');
                  }}
                  className="text-gray-400 hover:text-white text-sm underline block w-full"
                >
                  Forgot Password?
                </button>
              )}
              
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError("");
                  setMessage("");
                }}
                className="text-gray-300 hover:text-white transition-colors block w-full"
              >
                {mode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : mode === 'signup'
                  ? "Already have an account? Sign in"
                  : "Back to Sign In"
                }
              </button>
              

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
