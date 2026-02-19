import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Menu, X, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LoginButton from './LoginButton';
import ProfileSetupModal from './ProfileSetupModal';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';

const navItems = [
  { path: '/', label: 'Home', icon: '/assets/generated/logo.dim_256x256.png' },
  { path: '/civic-services', label: 'Civic Services', icon: '/assets/generated/civic-icon.dim_96x96.png' },
  { path: '/complaints', label: 'Complaints', icon: '/assets/generated/complaints-icon.dim_96x96.png' },
  { path: '/transport', label: 'Transport', icon: '/assets/generated/transport-icon.dim_96x96.png' },
  { path: '/emergency', label: 'Emergency', icon: '/assets/generated/emergency-icon.dim_128x128.png' },
  { path: '/utilities', label: 'Utilities', icon: '/assets/generated/utilities-icon.dim_96x96.png' },
  { path: '/engagement', label: 'Engagement', icon: '/assets/generated/engagement-icon.dim_96x96.png' },
  { path: '/tourism', label: 'Tourism', icon: '/assets/generated/tourism-icon.dim_96x96.png' },
  { path: '/business', label: 'Business', icon: '/assets/generated/business-icon.dim_96x96.png' },
  { path: '/payments', label: 'Payments', icon: '/assets/generated/payments-icon.dim_96x96.png' },
  { path: '/alerts', label: 'Alerts', icon: '/assets/generated/alerts-icon.dim_96x96.png' },
];

const protectedRoutes = [
  '/civic-services',
  '/complaints',
  '/transport',
  '/utilities',
  '/engagement',
  '/business',
  '/payments',
  '/alerts',
  '/admin',
  '/tourism',
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Redirect to home if trying to access protected route without authentication
  useEffect(() => {
    if (!isAuthenticated && protectedRoutes.includes(currentPath)) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, currentPath, navigate]);

  const handleNavigation = (path: string) => {
    // Allow navigation to home and emergency for all users
    if (!isAuthenticated && path !== '/' && path !== '/emergency') {
      navigate({ to: '/' });
      setMobileMenuOpen(false);
      return;
    }
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('/')}>
            <img src="/assets/generated/logo.dim_256x256.png" alt="My Belgavi" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">My Belgavi</h1>
              <p className="text-xs text-muted-foreground">Smart City Services</p>
            </div>
          </div>

          {/* Desktop Navigation - Only show if authenticated */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 6).map((item) => (
                <Button
                  key={item.path}
                  variant={currentPath === item.path ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleNavigation(item.path)}
                  className="gap-2"
                >
                  <img src={item.icon} alt="" className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {/* Emergency Button - Always Visible */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleNavigation('/emergency')}
              className="gap-2 font-semibold"
            >
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Emergency</span>
            </Button>

            <LoginButton />

            {/* Mobile Menu - Only show if authenticated */}
            {isAuthenticated && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <nav className="flex flex-col gap-2 mt-8">
                    {navItems.map((item) => (
                      <Button
                        key={item.path}
                        variant={currentPath === item.path ? 'default' : 'ghost'}
                        onClick={() => handleNavigation(item.path)}
                        className="justify-start gap-3"
                      >
                        <img src={item.icon} alt="" className="h-5 w-5" />
                        {item.label}
                      </Button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} My Belgavi. All rights reserved.</p>
            <p>
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Profile Setup Modal */}
      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
