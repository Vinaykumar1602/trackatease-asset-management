
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Lock, Mail, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showOTP) {
      // Verify OTP and complete login
      if (otp === '123456') { // In a real app, this would be validated against a server
        setIsLoading(true);
        const success = await login(email, password);
        setIsLoading(false);
        
        if (success) {
          navigate('/dashboard');
        } else {
          toast({
            title: "Authentication failed",
            description: "Please try again with correct credentials.",
            variant: "destructive"
          });
          setShowOTP(false);
        }
      } else {
        toast({
          title: "Invalid OTP",
          description: "The OTP you entered is incorrect. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      // First step: validate credentials and request OTP
      setIsLoading(true);
      
      // Simulate OTP generation
      setTimeout(() => {
        setIsLoading(false);
        
        // Here we're simulating the first authentication step
        // In a real app, this would verify the credentials and send an OTP
        if (
          (email === 'admin@trackatease.com' && password === 'admin123') ||
          (email === 'john@trackatease.com' && password === 'john123')
        ) {
          setShowOTP(true);
          toast({
            title: "OTP Sent",
            description: "A one-time password has been sent to your email address.",
          });
        } else {
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password and try again.",
            variant: "destructive"
          });
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="bg-primary/10 p-4 rounded-full">
            <BarChart2 className="h-12 w-12 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">Trackatease</h1>
          <p className="text-muted-foreground mt-2">Asset & Inventory Management</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{showOTP ? "Enter Verification Code" : "Login to your account"}</CardTitle>
            <CardDescription>
              {showOTP 
                ? "Enter the 6-digit code sent to your email"
                : "Enter your email and password to access your account"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {!showOTP ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="name@company.com" 
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password"
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto flex items-center justify-center">
                    <KeyRound className="h-8 w-8 text-muted-foreground mb-4" />
                  </div>
                  <div className="flex justify-center">
                    <InputOTP 
                      maxLength={6} 
                      value={otp}
                      onChange={setOTP}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Didn't receive the code? <Button variant="link" type="button" className="p-0" onClick={() => toast({ title: "New code sent" })}>Resend</Button>
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading || (showOTP && otp.length !== 6)}>
                {isLoading 
                  ? 'Processing...' 
                  : showOTP 
                    ? 'Verify & Sign in' 
                    : 'Continue'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {!showOTP && (
          <div className="text-center text-sm text-muted-foreground">
            <p className="mt-4">Demo accounts:</p>
            <p>Email: admin@trackatease.com | Password: admin123</p>
            <p>Email: john@trackatease.com | Password: john123</p>
            <p className="mt-2 text-xs">Note: Use code 123456 for OTP verification in this demo</p>
          </div>
        )}
      </div>
    </div>
  );
}
