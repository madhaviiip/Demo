import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'customer' | 'driver' | 'admin';
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

type AuthMethod = 'email' | 'phone';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
      } else {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(profileData as Profile);
  };

  const signUp = async (
    value: string,
    password: string,
    fullName: string,
    role: 'customer' | 'driver' | 'admin',
    method: AuthMethod
  ) => {
    const redirectUrl = `${window.location.origin}/`;

    const payload =
      method === 'email'
        ? {
            email: value,
            password,
            options: {
              emailRedirectTo: redirectUrl,
              data: { full_name: fullName, role }
            }
          }
        : {
            phone: value,
            password,
            options: {
              data: { full_name: fullName, role }
            }
          };

    const { data, error } = await supabase.auth.signUp(payload as any);

    if (error) {
      toast.error(error.message);
      return { error };
    }

    const userId = data.user?.id;

    if (userId) {
      await supabase.from('profiles').insert([
        {
          id: userId,
          full_name: fullName,
          email: method === 'email' ? value : null,
          phone: method === 'phone' ? value : null,
          role,
        }
      ]);
      fetchProfile(userId);
    }

    toast.success(
      method === 'email'
        ? 'Check your email to verify your account!'
        : 'Sign-up successful!'
    );

    return { error: null };
  };

  const signIn = async (
    value: string,
    password: string,
    method: AuthMethod
  ) => {
    const payload =
      method === 'email'
        ? { email: value, password }
        : { phone: value, password };

    const { data, error } = await supabase.auth.signInWithPassword(payload as any);

    if (error) {
      toast.error(error.message);
      return { error };
    }

    const userId = data.user?.id;
    if (userId) fetchProfile(userId);

    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed out successfully');
      setUser(null);
      setProfile(null);
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };
};
