import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileText, Building2, Droplets, CreditCard, Bus, MapPin, Users, AlertTriangle, LogIn } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LoginButton from '../components/LoginButton';

const quickAccessCards = [
  {
    title: 'Emergency Services',
    description: 'Quick access to police, hospitals, fire stations',
    icon: AlertCircle,
    path: '/emergency',
    variant: 'destructive' as const,
  },
  {
    title: 'File Complaint',
    description: 'Report civic issues with photo upload',
    icon: FileText,
    path: '/complaints',
    variant: 'default' as const,
  },
  {
    title: 'Civic Services',
    description: 'Property tax, water bills, licenses',
    icon: Building2,
    path: '/civic-services',
    variant: 'default' as const,
  },
  {
    title: 'Utilities',
    description: 'Water schedule, power alerts, garbage collection',
    icon: Droplets,
    path: '/utilities',
    variant: 'default' as const,
  },
  {
    title: 'Payments',
    description: 'Pay fines, parking fees, event tickets',
    icon: CreditCard,
    path: '/payments',
    variant: 'default' as const,
  },
  {
    title: 'Transport',
    description: 'Bus timings, parking, EV stations',
    icon: Bus,
    path: '/transport',
    variant: 'default' as const,
  },
  {
    title: 'Tourism',
    description: 'Explore Belgavi attractions and hotels',
    icon: MapPin,
    path: '/tourism',
    variant: 'default' as const,
  },
  {
    title: 'Engagement',
    description: 'Polls, events, news, community forum',
    icon: Users,
    path: '/engagement',
    variant: 'default' as const,
  },
];

const featuredAttractions = [
  {
    name: 'Belagavi Fort',
    image: '/assets/generated/belagavi-fort.dim_800x600.png',
    description: 'Historic fort with ancient architecture',
  },
  {
    name: 'Gokak Falls',
    image: '/assets/generated/gokak-falls.dim_800x600.png',
    description: 'Spectacular waterfall and natural beauty',
  },
  {
    name: 'Kapileshwar Temple',
    image: '/assets/generated/kapileshwar-temple.dim_800x600.png',
    description: 'Ancient temple with spiritual significance',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Login Landing Page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="max-w-4xl w-full space-y-8">
          {/* Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="/assets/generated/hero-banner.dim_1200x400.png"
              alt="My Belgavi"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center">
              <div className="container mx-auto px-8">
                <div className="flex items-center gap-4 mb-4">
                  <img src="/assets/generated/logo.dim_256x256.png" alt="My Belgavi" className="h-20 w-20" />
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">My Belgavi</h1>
                    <p className="text-xl text-white/90">Smart City Services at Your Fingertips</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Card */}
          <Card className="border-2">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold">Welcome to My Belgavi</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Your one-stop platform for all civic services, emergency assistance, transport information, and more. 
                  Access real-time updates, file complaints, pay bills, and explore the beautiful city of Belgavi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Civic Services</h3>
                    <p className="text-sm text-muted-foreground">File complaints, pay taxes, and access government services</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Emergency Services</h3>
                    <p className="text-sm text-muted-foreground">Quick access to police, hospitals, and fire stations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Bus className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Transport & GPS</h3>
                    <p className="text-sm text-muted-foreground">Live vehicle tracking, train schedules, and parking info</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Tourism</h3>
                    <p className="text-sm text-muted-foreground">Discover attractions, hotels, and local experiences</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <LoginButton />
                <p className="text-sm text-muted-foreground mt-4">
                  Sign in with Internet Identity to access all features
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Featured Attractions Preview */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Explore Belgavi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredAttractions.map((attraction) => (
                <Card key={attraction.name} className="overflow-hidden">
                  <img src={attraction.image} alt={attraction.name} className="w-full h-40 object-cover" />
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-1">{attraction.name}</h4>
                    <p className="text-sm text-muted-foreground">{attraction.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated User Dashboard
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary/20 to-secondary/20 p-8 md:p-12">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <img src="/assets/generated/logo.dim_256x256.png" alt="My Belgavi" className="h-20 w-20" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">My Belgavi</h1>
              <p className="text-xl text-muted-foreground">Smart City Services at Your Fingertips</p>
            </div>
          </div>
          <p className="text-lg text-foreground/80 mb-6">
            Access civic services, report issues, stay informed, and explore your city - all in one place.
          </p>
          <Button size="lg" onClick={() => navigate({ to: '/civic-services' })}>
            Get Started
          </Button>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccessCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.path}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  card.variant === 'destructive' ? 'border-destructive bg-destructive/5' : ''
                }`}
                onClick={() => navigate({ to: card.path })}
              >
                <CardContent className="p-6">
                  <div
                    className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 ${
                      card.variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Recent Alerts */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Recent Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Weather Alert</h3>
                  <p className="text-sm text-muted-foreground">Heavy rain expected in the evening. Stay safe!</p>
                  <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Droplets className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Water Supply</h3>
                  <p className="text-sm text-muted-foreground">Zone A water supply: 6 AM - 8 AM today</p>
                  <p className="text-xs text-muted-foreground mt-2">5 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Air Quality</h3>
                  <p className="text-sm text-muted-foreground">Air quality is good today. AQI: 45</p>
                  <p className="text-xs text-muted-foreground mt-2">1 hour ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Attractions */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Explore Belgavi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredAttractions.map((attraction) => (
            <Card key={attraction.name} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate({ to: '/tourism' })}>
              <img src={attraction.image} alt={attraction.name} className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{attraction.name}</h3>
                <p className="text-sm text-muted-foreground">{attraction.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
