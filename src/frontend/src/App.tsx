import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CivicServicesPage from './pages/CivicServicesPage';
import ComplaintsPage from './pages/ComplaintsPage';
import TransportPage from './pages/TransportPage';
import EmergencyPage from './pages/EmergencyPage';
import UtilitiesPage from './pages/UtilitiesPage';
import EngagementPage from './pages/EngagementPage';
import TourismPage from './pages/TourismPage';
import BusinessPage from './pages/BusinessPage';
import PaymentsPage from './pages/PaymentsPage';
import AlertsPage from './pages/AlertsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const civicServicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/civic-services',
  component: CivicServicesPage,
});

const complaintsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/complaints',
  component: ComplaintsPage,
});

const transportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transport',
  component: TransportPage,
});

const emergencyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/emergency',
  component: EmergencyPage,
});

const utilitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/utilities',
  component: UtilitiesPage,
});

const engagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/engagement',
  component: EngagementPage,
});

const tourismRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tourism',
  component: TourismPage,
});

const businessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/business',
  component: BusinessPage,
});

const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payments',
  component: PaymentsPage,
});

const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/alerts',
  component: AlertsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  civicServicesRoute,
  complaintsRoute,
  transportRoute,
  emergencyRoute,
  utilitiesRoute,
  engagementRoute,
  tourismRoute,
  businessRoute,
  paymentsRoute,
  alertsRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
