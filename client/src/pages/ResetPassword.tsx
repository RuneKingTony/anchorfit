import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');
  const [message, setMessage] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Email is required');
      return;
    }

    setIsLoading(true);
    setStatus('form');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('code');
        setStatus('success');
        setMessage('Verification code sent! Check your email.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to send verification code');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || !password || !confirmPassword) {
      setStatus('error');
      setMessage('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setStatus('form');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('success');
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to reset password');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setCode('');
    setPassword('');
    setConfirmPassword('');
    setStatus('form');
    setMessage('');
  };

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        
        {/* Step 1: Email Input */}
        {step === 'email' && (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
              <CardDescription>
                Enter your email address to receive a verification code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm">{message}</span>
                  </div>
                )}

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Button variant="link" onClick={() => navigate('/')}>
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 2: Code and Password Input */}
        {step === 'code' && (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Enter Verification Code</CardTitle>
              <CardDescription>
                We sent a 6-digit code to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {status === 'success' && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">{message}</span>
                </div>
              )}

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                    disabled={isLoading}
                    className="text-center text-lg font-mono tracking-widest"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    required
                    disabled={isLoading}
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm">{message}</span>
                  </div>
                )}

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>

              <div className="text-center space-y-2">
                <Button variant="link" onClick={handleBackToEmail} className="text-sm">
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Use Different Email
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Password Reset Successful</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
              <p className="text-green-700 font-medium">{message}</p>
              <Button onClick={handleContinue} className="w-full">
                Continue to Login
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}