import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Truck, UserCheck, Shield } from 'lucide-react';

export default function Auth() {
  const { user, profile, signUp, signIn, signInWithPhone, signUpWithPhone, confirmOTP } = useAuth();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'driver'>('customer');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [otpSent, setOtpSent] = useState(false);

  if (user && profile) {
    switch (profile.role) {
      case 'customer':
        return <Navigate to="/customer" replace />;
      case 'driver':
        return <Navigate to="/driver" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
    }
  }

  const handleEmailAuth = async (mode: 'signin' | 'signup') => {
    setLoading(true);
    if (mode === 'signup') {
      await signUp({ email, password, fullName, role });
    } else {
      await signIn({ email, password });
    }
    setLoading(false);
  };

  const handlePhoneAuth = async (mode: 'signin' | 'signup') => {
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUpWithPhone({ phone, fullName, role });
        setOtpSent(true);
      } else {
        await signInWithPhone(phone);
        setOtpSent(true);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleOtpVerify = async () => {
    setLoading(true);
    try {
      await confirmOTP(phone, otp);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">Login / Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full" onValueChange={(value) => setTab(value as 'email' | 'phone')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />

              <Label className="mt-2">Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

              <Label className="mt-2">Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

              <Label className="mt-2">Role</Label>
              <Select value={role} onValueChange={(val) => setRole(val as 'customer' | 'driver')}>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex justify-between mt-4">
                <Button onClick={() => handleEmailAuth('signin')} disabled={loading}>Sign In</Button>
                <Button onClick={() => handleEmailAuth('signup')} variant="outline" disabled={loading}>Sign Up</Button>
              </div>
            </TabsContent>

            <TabsContent value="phone">
              {!otpSent ? (
                <>
                  <Label>Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />

                  <Label className="mt-2">Phone</Label>
                  <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" />

                  <Label className="mt-2">Role</Label>
                  <Select value={role} onValueChange={(val) => setRole(val as 'customer' | 'driver')}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex justify-between mt-4">
                    <Button onClick={() => handlePhoneAuth('signin')} disabled={loading}>Send OTP (Login)</Button>
                    <Button onClick={() => handlePhoneAuth('signup')} variant="outline" disabled={loading}>Send OTP (Signup)</Button>
                  </div>
                </>
              ) : (
                <>
                  <Label>Enter OTP</Label>
                  <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" />
                  <Button onClick={handleOtpVerify} className="mt-4 w-full" disabled={loading}>Verify OTP</Button>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

