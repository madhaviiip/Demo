import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Truck, UserCheck, Shield } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function Auth() {
  const { user, profile, signUp, signIn } = useAuth();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'driver' | 'admin'>('customer');
  const [loading, setLoading] = useState(false);

  if (user && profile) {
    switch (profile.role) {
      case 'customer':
        return <Navigate to="/customer" replace />;
      case 'driver':
        return <Navigate to="/driver" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signUp(identifier, password, fullName, role, authMethod); // custom hook should support this
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(identifier, password, authMethod); // custom hook should support this
    setLoading(false);
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'customer':
        return <UserCheck className="w-5 h-5" />;
      case 'driver':
        return <Truck className="w-5 h-5" />;
      case 'admin':
        return <Shield className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-clean flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Dhobi Dash</CardTitle>
          <CardDescription>20-minute laundry pickup & delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <ToggleGroup type="single" value={authMethod} onValueChange={(val) => setAuthMethod(val as 'email' | 'phone')} className="w-full justify-center mb-4">
            <ToggleGroupItem value="email" className="px-4 py-1">Email</ToggleGroupItem>
            <ToggleGroupItem value="phone" className="px-4 py-1">Phone</ToggleGroupItem>
          </ToggleGroup>

          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Sign In */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-id">{authMethod === 'email' ? 'Email' : 'Phone'}</Label>
                  <Input
                    id="signin-id"
                    type={authMethod === 'email' ? 'email' : 'tel'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={authMethod === 'email' ? 'you@example.com' : '+91XXXXXXXXXX'}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-id">{authMethod === 'email' ? 'Email' : 'Phone'}</Label>
                  <Input
                    id="signup-id"
                    type={authMethod === 'email' ? 'email' : 'tel'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={authMethod === 'email' ? 'you@example.com' : '+91XXXXXXXXXX'}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">I want to join as a:</Label>
                  <Select value={role} onValueChange={(value: 'customer' | 'driver' | 'admin') => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon('customer')}
                          <span>Customer</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="driver">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon('driver')}
                          <span>Driver</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon('admin')}
                          <span>Admin</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

