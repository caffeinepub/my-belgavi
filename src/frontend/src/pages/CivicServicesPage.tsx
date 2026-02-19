import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Droplets, Zap, Building2, FileCheck } from 'lucide-react';
import { useGetServiceLinks } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

const serviceIcons = {
  propertyTax: Building2,
  waterBill: Droplets,
  electricity: Zap,
  tradeLicense: FileCheck,
  birthCerts: FileText,
  deathCerts: FileText,
};

export default function CivicServicesPage() {
  const { data: links, isLoading } = useGetServiceLinks();

  const services = [
    {
      key: 'propertyTax',
      title: 'Property Tax Payment',
      description: 'Pay your property tax online quickly and securely',
      url: links?.propertyTaxURL,
    },
    {
      key: 'waterBill',
      title: 'Water Bill Payment',
      description: 'View and pay your water bills online',
      url: links?.waterBillURL,
    },
    {
      key: 'electricity',
      title: 'Electricity Bill (HESCOM)',
      description: 'Access HESCOM portal for electricity bill payment',
      url: links?.electricityBoardURL,
    },
    {
      key: 'tradeLicense',
      title: 'Trade License Renewal',
      description: 'Renew your trade license online',
      url: links?.tradeLicenseRenewalURL,
    },
    {
      key: 'birthCerts',
      title: 'Birth Certificate',
      description: 'Apply for or download birth certificates',
      url: links?.birthCertsURL,
    },
    {
      key: 'deathCerts',
      title: 'Death Certificate',
      description: 'Apply for or download death certificates',
      url: links?.deathCertsURL,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Civic Services</h1>
        <p className="text-lg text-muted-foreground">
          Access government services and pay bills online
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Note:</strong> These links connect to Belagavi City Corporation services. Integration points are ready for live API connections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = serviceIcons[service.key as keyof typeof serviceIcons];
          return (
            <Card key={service.key} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <Button
                  className="w-full gap-2"
                  onClick={() => window.open(service.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Access Service
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
