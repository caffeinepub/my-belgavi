import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useGetAllTrainRoutes,
  useGetTrainsByStation,
  useGetTrainsBetweenStations,
} from '../hooks/useQueries';
import { Train, MapPin, Clock, Search, ArrowRight, Filter } from 'lucide-react';
import type { TrainRoute } from '../backend';

export default function TrainSchedule() {
  const [searchMode, setSearchMode] = useState<'all' | 'station' | 'route'>('all');
  const [stationCode, setStationCode] = useState('');
  const [originCode, setOriginCode] = useState('');
  const [destinationCode, setDestinationCode] = useState('');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');

  const { data: allRoutes, isLoading: loadingAll } = useGetAllTrainRoutes();
  const { data: stationRoutes, isLoading: loadingStation } = useGetTrainsByStation(stationCode);
  const { data: routeTrains, isLoading: loadingRoute } = useGetTrainsBetweenStations(
    originCode,
    destinationCode
  );

  const getDisplayRoutes = (): TrainRoute[] => {
    let routes: TrainRoute[] = [];
    
    if (searchMode === 'station' && stationCode) {
      routes = stationRoutes || [];
    } else if (searchMode === 'route' && originCode && destinationCode) {
      routes = routeTrains || [];
    } else {
      routes = allRoutes || [];
    }

    if (destinationFilter !== 'all') {
      routes = routes.filter(
        (route) =>
          route.destination.code === destinationFilter ||
          route.destination.name.toLowerCase().includes(destinationFilter.toLowerCase())
      );
    }

    return routes;
  };

  const isLoading = loadingAll || loadingStation || loadingRoute;
  const displayRoutes = getDisplayRoutes();

  const uniqueDestinations = Array.from(
    new Set((allRoutes || []).map((route) => route.destination.name))
  );

  const formatTime = (time?: string) => {
    if (!time) return '-';
    return time;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="h-5 w-5" />
            Train Schedule Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={searchMode === 'all' ? 'default' : 'outline'}
              onClick={() => setSearchMode('all')}
              size="sm"
            >
              All Trains
            </Button>
            <Button
              variant={searchMode === 'station' ? 'default' : 'outline'}
              onClick={() => setSearchMode('station')}
              size="sm"
            >
              By Station
            </Button>
            <Button
              variant={searchMode === 'route' ? 'default' : 'outline'}
              onClick={() => setSearchMode('route')}
              size="sm"
            >
              Between Stations
            </Button>
          </div>

          {searchMode === 'station' && (
            <div className="space-y-2">
              <Label htmlFor="stationCode">Station Code</Label>
              <div className="flex gap-2">
                <Input
                  id="stationCode"
                  placeholder="e.g., BGM, UBL, KLB"
                  value={stationCode}
                  onChange={(e) => setStationCode(e.target.value.toUpperCase())}
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {searchMode === 'route' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originCode">Origin Station Code</Label>
                <Input
                  id="originCode"
                  placeholder="e.g., BGM"
                  value={originCode}
                  onChange={(e) => setOriginCode(e.target.value.toUpperCase())}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationCode">Destination Station Code</Label>
                <Input
                  id="destinationCode"
                  placeholder="e.g., UBL, KLB, GOA"
                  value={destinationCode}
                  onChange={(e) => setDestinationCode(e.target.value.toUpperCase())}
                />
              </div>
            </div>
          )}

          {searchMode === 'all' && uniqueDestinations.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="destinationFilter" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Destination
              </Label>
              <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                <SelectTrigger id="destinationFilter">
                  <SelectValue placeholder="All Destinations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  {uniqueDestinations.map((dest) => (
                    <SelectItem key={dest} value={dest}>
                      {dest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : displayRoutes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Train className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchMode === 'all'
                ? 'No train schedules available. Contact admin to add train routes.'
                : 'No trains found for the selected criteria.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayRoutes.map((route) => (
            <Card key={route.trainNumber} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Train className="h-5 w-5" />
                      {route.trainName}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="font-mono">
                        {route.trainNumber}
                      </Badge>
                      <span className="flex items-center gap-1">
                        {route.origin.name} ({route.origin.code})
                        <ArrowRight className="h-3 w-3" />
                        {route.destination.name} ({route.destination.code})
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Route Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
                        <div>
                          <span className="font-medium">Origin:</span> {route.origin.name}
                          <br />
                          <span className="text-muted-foreground text-xs">
                            {route.origin.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5" />
                        <div>
                          <span className="font-medium">Destination:</span> {route.destination.name}
                          <br />
                          <span className="text-muted-foreground text-xs">
                            {route.destination.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {route.schedule && route.schedule.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Detailed Schedule
                      </h4>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-semibold">Station</TableHead>
                              <TableHead className="font-semibold">Code</TableHead>
                              <TableHead className="font-semibold">Arrival</TableHead>
                              <TableHead className="font-semibold">Departure</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {route.schedule.map((stop, index) => (
                              <TableRow key={index} className="hover:bg-muted/30">
                                <TableCell className="font-medium">{stop.station.name}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {stop.station.code}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                  {formatTime(stop.arrivalTime)}
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                  {formatTime(stop.departureTime)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}

                  {route.stops && route.stops.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Intermediate Stops</h4>
                      <div className="flex flex-wrap gap-2">
                        {route.stops.map((stop, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {stop.name} ({stop.code})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
