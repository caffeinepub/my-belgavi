import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, AlertCircle } from 'lucide-react';
import { emergencyData } from '../data/emergencyData';

export default function EmergencyPage() {
  return (
    <div className="space-y-8">
      {/* Emergency Button */}
      <Card className="border-destructive bg-destructive/5">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/assets/generated/emergency-icon.dim_128x128.png"
              alt="Emergency"
              className="h-24 w-24"
            />
            <div>
              <h2 className="text-2xl font-bold mb-2">Emergency Services</h2>
              <p className="text-muted-foreground mb-4">
                In case of emergency, call the appropriate service immediately
              </p>
            </div>
            <div className="flex gap-4">
              <Button size="lg" variant="destructive" className="gap-2" asChild>
                <a href="tel:100">
                  <Phone className="h-5 w-5" />
                  Police: 100
                </a>
              </Button>
              <Button size="lg" variant="destructive" className="gap-2" asChild>
                <a href="tel:108">
                  <Phone className="h-5 w-5" />
                  Ambulance: 108
                </a>
              </Button>
              <Button size="lg" variant="destructive" className="gap-2" asChild>
                <a href="tel:101">
                  <Phone className="h-5 w-5" />
                  Fire: 101
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Police Stations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Police Stations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyData.policeStations.map((station, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{station.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{station.address}</span>
                </div>
                <a
                  href={`tel:${station.phone}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {station.phone}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Hospitals */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Hospitals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyData.hospitals.map((hospital, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{hospital.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{hospital.address}</span>
                </div>
                <a
                  href={`tel:${hospital.phone}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {hospital.phone}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Fire Stations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Fire Stations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyData.fireStations.map((station, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{station.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{station.address}</span>
                </div>
                <a
                  href={`tel:${station.phone}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {station.phone}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Blood Banks */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Blood Banks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyData.bloodBanks.map((bank, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{bank.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{bank.address}</span>
                </div>
                <a
                  href={`tel:${bank.phone}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {bank.phone}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
