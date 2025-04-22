
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart2, Lock, Mail, KeyRound, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Separate components for better organization
const LoginForm = ({ email, setEmail, password, setPassword, handleLogin, isLoading }) => (
  <form onSubmit={handleLogin}>
    <CardContent className="space-y-4">
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
    </CardContent>
    <CardFooter>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Login'}
      </Button>
    </CardFooter>
  </form>
);

const SignupForm = ({ 
  signupName, setSignupName,
  signupEmail, setSignupEmail,
  signupPassword, setSignupPassword,
  signupConfirmPassword, setSignupConfirmPassword,
  handleSignUp, isLoading 
}) => (
  <form onSubmit={handleSignUp}>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signupName">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="signupName"
            type="text" 
            placeholder="John Doe" 
            className="pl-10"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signupEmail">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="signupEmail"
            type="email" 
            placeholder="name@company.com" 
            className="pl-10"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signupPassword">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="signupPassword"
            type="password" 
            placeholder="••••••••" 
            className="pl-10"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signupConfirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="signupConfirmPassword"
            type="password" 
            placeholder="••••••••" 
            className="pl-10"
            value={signupConfirmPassword}
            onChange={(e) => setSignupConfirmPassword(e.target.value)}
            required
          />
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Create Account'}
      </Button>
    </CardFooter>
  </form>
);

export default function Login() {
  const [activeTab, setActiveTab] = useState<string>('login');
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Sign up state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupEmail || !signupPassword || !signupName || !signupConfirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (signupPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    const result = await signUp(signupEmail, signupPassword, signupName);
    setIsLoading(false);
    
    if (result.success) {
      setActiveTab('login');
      setEmail(signupEmail);
      setSignupEmail('');
      setSignupPassword('');
      setSignupName('');
      setSignupConfirmPassword('');
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
            <div className="w-full mb-4">
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <CardTitle>Login to your account</CardTitle>
                  <CardDescription>
                    Enter your email and password to access your account
                  </CardDescription>
                  <LoginForm 
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    handleLogin={handleLogin}
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="signup">
                  <CardTitle>Create a new account</CardTitle>
                  <CardDescription>
                    Enter your details to create a new account
                  </CardDescription>
                  <SignupForm 
                    signupName={signupName}
                    setSignupName={setSignupName}
                    signupEmail={signupEmail}
                    setSignupEmail={setSignupEmail}
                    signupPassword={signupPassword}
                    setSignupPassword={setSignupPassword}
                    signupConfirmPassword={signupConfirmPassword}
                    setSignupConfirmPassword={setSignupConfirmPassword}
                    handleSignUp={handleSignUp}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardHeader>
        </Card>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <Link to="/admin-setup" className="text-sm text-muted-foreground hover:text-primary">
              Admin Setup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
