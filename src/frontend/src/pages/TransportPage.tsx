import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bus, Car, ParkingCircle, Zap, Phone, MapPin, Clock, Map as MapIcon } from 'lucide-react';
import { transportData } from '../data/transportData';
import TrainSchedule from '../components/TrainSchedule';
import TransportMap from '../components/TransportMap';

export default function TransportPage() {
  const mapLocations = [
    ...transportData.trainStations.map((station) => ({
      name: station.name,
      latitude: station.latitude,
      longitude: station.longitude,
      type: 'train' as const,
    })),
    ...transportData.parkingSpots.map((spot) => ({
      name: spot.location,
      latitude: spot.latitude,
      longitude: spot.longitude,
      type: 'parking' as const,
    })),
    ...transportData.evStations.map((station) => ({
      name: station.name,
      latitude: station.latitude,
      longitude: station.longitude,
      type: 'ev' as const,
    })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Transport & Traffic</h1>
        <p className="text-lg text-muted-foreground">
          Bus timings, train schedules, parking info, and EV charging stations
        </p>
      </div>

      <Tabs defaultValue="map">
        <TabsList className="grid w-full max-w-4xl grid-cols-6">
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="bus">Bus Routes</TabsTrigger>
          <TabsTrigger value="train">Train Schedule</TabsTrigger>
          <TabsTrigger value="taxi">Taxi/Auto</TabsTrigger>
          <TabsTrigger value="parking">Parking</TabsTrigger>
          <TabsTrigger value="ev">EV Stations</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-6">
          <TransportMap locations={mapLocations} />
        </TabsContent>

        <TabsContent value="bus" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transportData.busRoutes.map((route, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {route.routeNumber}
                    </div>
                    <CardTitle className="text-lg">{route.origin} - {route.destination}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Timings:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {route.timings.map((time, i) => (
                        <span key={i} className="px-2 py-1 bg-muted rounded text-sm">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="train" className="mt-6">
          <TrainSchedule />
        </TabsContent>

        <TabsContent value="taxi" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transportData.taxiServices.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{service.area}</span>
                  </div>
                  <a
                    href={`tel:${service.phone}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {service.phone}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="parking" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transportData.parkingSpots.map((spot, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ParkingCircle className="h-5 w-5" />
                    {spot.location}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-medium">{spot.capacity} vehicles</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available:</span>
                    <span className={`font-medium ${spot.available > 10 ? 'text-green-600' : 'text-amber-600'}`}>
                      {spot.available} spots
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ev" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transportData.evStations.map((station, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    {station.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{station.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{station.chargerType}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
