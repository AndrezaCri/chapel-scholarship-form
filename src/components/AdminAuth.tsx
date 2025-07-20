
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, User } from 'lucide-react';

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

const AdminAuth = ({ onAuthSuccess }: AdminAuthProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (email.toLowerCase() === 'dljackson1277@gmail.com') {
      setTimeout(() => {
        toast({
          title: "Access granted!",
          description: "Welcome to the admin panel."
        });
        onAuthSuccess();
        setIsLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        toast({
          title: "Access denied",
          description: "Only authorized users can access this area.",
          variant: "destructive"
        });
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-form border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Admin Access
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-sm font-medium flex items-center gap-1">
                <User className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all duration-200 focus:shadow-elegant min-h-[44px] text-base"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:opacity-90 transition-all min-h-[48px] text-base"
            >
              {isLoading ? 'Verifying...' : 'Access Admin Panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
