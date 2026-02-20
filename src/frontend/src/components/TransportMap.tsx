import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Clock, AlertCircle, Loader2, Play, Pause } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetAllVehicleLocations, useAddOrUpdateVehicleLocation } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import type { Vehicle, VehicleType } from '../backend';
import { useIsCallerAdmin } from '../hooks/useQueries';

interface MapLocation {
  name: string;
  latitude: number;
  longitude: number;
  type: 'train' | 'parking' | 'ev';
}

interface TransportMapProps {
  locations: MapLocation[];
}

// Type declarations for Google Maps
declare global {
  interface Window {
    google: any;
  }
}

// Helper function to get vehicle type label
function getVehicleTypeLabel(vehicleType: VehicleType): string {
  if ('car' in vehicleType) return 'Car';
  if ('bus' in vehicleType) return 'Bus';
  if ('truck' in vehicleType) return 'Truck';
  if ('train' in vehicleType) return 'Train';
  if ('bike' in vehicleType) return 'Bike';
  if ('ambulance' in vehicleType) return 'Ambulance';
  if ('police' in vehicleType) return 'Police';
  if ('fireTruck' in vehicleType) return 'Fire Truck';
  if ('other' in vehicleType) return vehicleType.other || 'Other';
  return 'Unknown';
}

// Helper function to get vehicle icon color
function getVehicleIconColor(vehicleType: VehicleType): string {
  if ('ambulance' in vehicleType) return '#ef4444'; // red
  if ('police' in vehicleType) return '#3b82f6'; // blue
  if ('fireTruck' in vehicleType) return '#dc2626'; // dark red
  if ('bus' in vehicleType) return '#f97316'; // orange
  if ('train' in vehicleType) return '#8b5cf6'; // purple
  return '#ef4444'; // default red
}

export default function TransportMap({ locations }: TransportMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const vehicleMarkersRef = useRef<Map<string, any>>(new Map());
  const infoWindowRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { 
    data: vehicles = [], 
    isLoading: vehiclesLoading, 
    error: vehiclesError, 
    isFetched,
    dataUpdatedAt 
  } = useGetAllVehicleLocations();

  const { data: isAdmin = false } = useIsCallerAdmin();
  const addOrUpdateVehicle = useAddOrUpdateVehicleLocation();

  const centerLat = 15.8497;
  const centerLng = 74.4977;

  // Log vehicle data for debugging
  useEffect(() => {
    if (isFetched) {
      console.log('[TransportMap] Vehicle locations fetched:', vehicles.length, 'vehicle(s)');
      if (vehicles.length === 0) {
        console.log('[TransportMap] No vehicles currently being tracked');
      } else {
        console.log('[TransportMap] Vehicle details:', vehicles);
      }
    }
  }, [vehicles, isFetched, dataUpdatedAt]);

  // Log any errors
  useEffect(() => {
    if (vehiclesError) {
      console.error('[TransportMap] Error fetching vehicle locations:', vehiclesError);
    }
  }, [vehiclesError]);

  // Initialize Google Map
  useEffect(() => {
    if (!mapRef.current || googleMapRef.current) return;

    const initMap = () => {
      try {
        if (!window.google || !window.google.maps) {
          setMapError('Google Maps API not loaded');
          console.error('[TransportMap] Google Maps API not available');
          return;
        }

        const map = new window.google.maps.Map(mapRef.current!, {
          center: { lat: centerLat, lng: centerLng },
          zoom: 13,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        googleMapRef.current = map;
        infoWindowRef.current = new window.google.maps.InfoWindow();
        setMapLoaded(true);
        console.log('[TransportMap] Google Map initialized successfully');
      } catch (error) {
        console.error('[TransportMap] Error initializing map:', error);
        setMapError('Failed to initialize map');
      }
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDummy_Replace_With_Real_Key`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => {
        setMapError('Failed to load Google Maps');
        console.error('[TransportMap] Failed to load Google Maps script');
      };
      document.head.appendChild(script);
    }
  }, []);

  // Add static location markers
  useEffect(() => {
    if (!googleMapRef.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    locations.forEach((location) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: googleMapRef.current,
        title: location.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: location.type === 'train' ? '#f97316' : location.type === 'parking' ? '#3b82f6' : '#22c55e',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        const typeLabel = location.type === 'train' ? 'Train Station' : location.type === 'parking' ? 'Parking' : 'EV Charging';
        infoWindowRef.current?.setContent(`
          <div style="padding: 8px; font-family: system-ui;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600;">${location.name}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">${typeLabel}</p>
          </div>
        `);
        infoWindowRef.current?.open(googleMapRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    console.log(`[TransportMap] Added ${locations.length} static location markers to map`);
  }, [locations, mapLoaded]);

  // Add and update vehicle markers
  useEffect(() => {
    if (!googleMapRef.current || !mapLoaded) {
      console.log('[TransportMap] Map not ready for vehicle markers');
      return;
    }

    if (!vehicles || vehicles.length === 0) {
      // Remove all vehicle markers if no vehicles
      vehicleMarkersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      vehicleMarkersRef.current.clear();
      console.log('[TransportMap] No vehicles to display, cleared all vehicle markers');
      return;
    }

    console.log(`[TransportMap] Updating vehicle markers for ${vehicles.length} vehicle(s)`);

    const currentVehicleIds = new Set(vehicles.map((v) => v.id));
    const existingVehicleIds = new Set(vehicleMarkersRef.current.keys());

    // Remove markers for vehicles that no longer exist
    existingVehicleIds.forEach((id) => {
      if (!currentVehicleIds.has(id)) {
        const marker = vehicleMarkersRef.current.get(id);
        if (marker) {
          marker.setMap(null);
          vehicleMarkersRef.current.delete(id);
          console.log(`[TransportMap] Removed vehicle marker: ${id}`);
        }
      }
    });

    // Add or update vehicle markers
    vehicles.forEach((vehicle) => {
      const position = { lat: vehicle.latitude, lng: vehicle.longitude };
      let marker = vehicleMarkersRef.current.get(vehicle.id);

      if (marker) {
        // Update existing marker position
        const oldPosition = marker.getPosition();
        marker.setPosition(position);
        console.log(`[TransportMap] Updated vehicle ${vehicle.id} position from (${oldPosition.lat()}, ${oldPosition.lng()}) to (${position.lat}, ${position.lng})`);
      } else {
        // Create new marker
        const vehicleColor = getVehicleIconColor(vehicle.vehicleType);
        marker = new window.google.maps.Marker({
          position,
          map: googleMapRef.current,
          title: vehicle.name,
          icon: {
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: vehicleColor,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            rotation: 0,
          },
          zIndex: 1000,
          animation: window.google.maps.Animation.DROP,
        });

        marker.addListener('click', () => {
          const timestamp = new Date(Number(vehicle.timestamp) / 1000000);
          const timeStr = timestamp.toLocaleString();
          const vehicleTypeLabel = getVehicleTypeLabel(vehicle.vehicleType);
          
          infoWindowRef.current?.setContent(`
            <div style="padding: 10px; font-family: system-ui; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #111;">${vehicle.name}</h3>
              <div style="margin-bottom: 6px;">
                <span style="font-size: 12px; color: #666; font-weight: 500;">Type:</span>
                <span style="font-size: 12px; color: #111; margin-left: 4px;">${vehicleTypeLabel}</span>
              </div>
              <div style="margin-bottom: 6px;">
                <span style="font-size: 12px; color: #666; font-weight: 500;">Location:</span>
                <span style="font-size: 11px; color: #111; margin-left: 4px;">${vehicle.latitude.toFixed(6)}, ${vehicle.longitude.toFixed(6)}</span>
              </div>
              <div>
                <span style="font-size: 12px; color: #666; font-weight: 500;">Last Update:</span>
                <span style="font-size: 11px; color: #111; margin-left: 4px;">${timeStr}</span>
              </div>
            </div>
          `);
          infoWindowRef.current?.open(googleMapRef.current, marker);
        });

        vehicleMarkersRef.current.set(vehicle.id, marker);
        console.log(`[TransportMap] Added new vehicle marker: ${vehicle.id} (${vehicle.name}) at (${position.lat}, ${position.lng})`);
      }
    });

    console.log(`[TransportMap] Total vehicle markers on map: ${vehicleMarkersRef.current.size}`);
  }, [vehicles, mapLoaded, dataUpdatedAt]);

  // Test vehicle simulation
  const startSimulation = () => {
    if (simulationRunning) return;
    
    setSimulationRunning(true);
    console.log('[TransportMap] Starting test vehicle simulation');

    // Create test vehicles with different routes
    const testVehicles = [
      { id: 'test-bus-1', name: 'Test Bus 1', lat: centerLat, lng: centerLng, deltaLat: 0.001, deltaLng: 0.001 },
      { id: 'test-ambulance-1', name: 'Test Ambulance', lat: centerLat + 0.01, lng: centerLng - 0.01, deltaLat: -0.0008, deltaLng: 0.0012 },
    ];

    let step = 0;
    simulationIntervalRef.current = setInterval(() => {
      step++;
      testVehicles.forEach((vehicle) => {
        const newLat = vehicle.lat + (vehicle.deltaLat * step);
        const newLng = vehicle.lng + (vehicle.deltaLng * step);
        
        addOrUpdateVehicle.mutate({
          vehicleId: vehicle.id,
          latitude: newLat,
          longitude: newLng,
        });
      });
    }, 3000); // Update every 3 seconds
  };

  const stopSimulation = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setSimulationRunning(false);
    console.log('[TransportMap] Stopped test vehicle simulation');
  };

  // Cleanup simulation on unmount
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  if (mapError) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-2">Unable to load map</p>
          <p className="text-sm text-muted-foreground">{mapError}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Transport Locations & Live Vehicle Tracking
            </span>
            <div className="flex items-center gap-2">
              {vehiclesLoading && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading
                </Badge>
              )}
              {vehicles.length > 0 && (
                <Badge variant="default" className="flex items-center gap-1">
                  <Navigation className="h-3 w-3" />
                  {vehicles.length} Active
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {vehiclesError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load vehicle locations. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {isAdmin && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">Test Vehicle Simulation</p>
                <p className="text-xs text-muted-foreground">
                  {simulationRunning 
                    ? 'Simulating vehicle movement on the map' 
                    : 'Start simulation to test live vehicle tracking'}
                </p>
              </div>
              <Button
                variant={simulationRunning ? 'destructive' : 'default'}
                size="sm"
                onClick={simulationRunning ? stopSimulation : startSimulation}
                disabled={addOrUpdateVehicle.isPending}
              >
                {simulationRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="relative">
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg z-10">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Loading map...</p>
                </div>
              </div>
            )}
            <div ref={mapRef} className="w-full h-[500px] rounded-lg border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#f97316]" />
              <span>Train Stations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#3b82f6]" />
              <span>Parking Areas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
              <span>EV Charging Stations</span>
            </div>
          </div>

          {vehicles.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Active Vehicles
              </h4>
              <div className="space-y-2">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-2 bg-muted/30 rounded-md text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: getVehicleIconColor(vehicle.vehicleType) }}
                      />
                      <span className="font-medium">{vehicle.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {getVehicleTypeLabel(vehicle.vehicleType)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(Number(vehicle.timestamp) / 1000000).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
