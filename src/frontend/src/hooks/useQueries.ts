import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Complaint, ComplaintStatus, TrainRoute, Vehicle } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetServiceLinks() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['serviceLinks'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getServiceLinks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserComplaints() {
  const { actor, isFetching } = useActor();

  return useQuery<Complaint[]>({
    queryKey: ['userComplaints'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserComplaints();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15000, // Poll every 15 seconds for real-time updates
  });
}

export function useSubmitComplaint() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      description,
      category,
      location,
      photo,
      latitude,
      longitude,
    }: {
      description: string;
      category: string;
      location: string;
      photo?: ExternalBlob;
      latitude?: number;
      longitude?: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitComplaint(
        description,
        category,
        location,
        photo || null,
        latitude ?? null,
        longitude ?? null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['allComplaints'] });
    },
  });
}

export function useAddComplaintRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      complaintId,
      rating,
      feedback,
    }: {
      complaintId: string;
      rating: number;
      feedback: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addComplaintRating(complaintId, BigInt(rating), feedback);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['allComplaints'] });
    },
  });
}

export function useGetAllComplaints() {
  const { actor, isFetching } = useActor();

  return useQuery<Complaint[]>({
    queryKey: ['allComplaints'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllComplaints();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000, // Poll every 10 seconds for admin dashboard
  });
}

export function useUpdateComplaintStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ complaintId, status }: { complaintId: string; status: ComplaintStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateComplaintStatus(complaintId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['userComplaints'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Train Schedule Queries
export function useGetAllTrainRoutes() {
  const { actor, isFetching } = useActor();

  return useQuery<TrainRoute[]>({
    queryKey: ['trainRoutes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTrainRoutes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTrainRoute(trainNumber: string) {
  const { actor, isFetching } = useActor();

  return useQuery<TrainRoute>({
    queryKey: ['trainRoute', trainNumber],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTrainRoute(trainNumber);
    },
    enabled: !!actor && !isFetching && !!trainNumber,
  });
}

export function useGetTrainsByStation(stationCode: string) {
  const { actor, isFetching } = useActor();

  return useQuery<TrainRoute[]>({
    queryKey: ['trainsByStation', stationCode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrainsByStation(stationCode);
    },
    enabled: !!actor && !isFetching && !!stationCode,
  });
}

export function useGetTrainsBetweenStations(originCode: string, destinationCode: string) {
  const { actor, isFetching } = useActor();

  return useQuery<TrainRoute[]>({
    queryKey: ['trainsBetweenStations', originCode, destinationCode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrainsBetweenStations(originCode, destinationCode);
    },
    enabled: !!actor && !isFetching && !!originCode && !!destinationCode,
  });
}

// Vehicle Tracking Queries
export function useGetAllVehicleLocations() {
  const { actor, isFetching } = useActor();

  return useQuery<Vehicle[]>({
    queryKey: ['vehicleLocations'],
    queryFn: async () => {
      if (!actor) {
        console.log('[Vehicle Tracking] Actor not available');
        return [];
      }
      console.log('[Vehicle Tracking] Fetching vehicle locations from backend...');
      try {
        const locations = await actor.getVehicleLocations();
        console.log('[Vehicle Tracking] Successfully fetched', locations.length, 'vehicle(s)');
        if (locations.length > 0) {
          console.log('[Vehicle Tracking] Vehicle data:', locations);
        }
        return locations;
      } catch (error) {
        console.error('[Vehicle Tracking] Error fetching vehicle locations:', error);
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Poll every 5 seconds for real-time updates
    staleTime: 0, // Always consider data stale to ensure fresh fetches
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useGetVehicleLocationsInBounds(
  north: number,
  south: number,
  east: number,
  west: number,
  enabled: boolean = true
) {
  const { actor, isFetching } = useActor();

  return useQuery<Vehicle[]>({
    queryKey: ['vehicleLocationsInBounds', north, south, east, west],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVehicleLocationsInBounds(north, south, east, west);
    },
    enabled: !!actor && !isFetching && enabled,
    refetchInterval: 5000,
    staleTime: 0,
  });
}

// Vehicle Location Update Mutation
export function useAddOrUpdateVehicleLocation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      vehicleId,
      latitude,
      longitude,
      timestamp,
    }: {
      vehicleId: string;
      latitude: number;
      longitude: number;
      timestamp?: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Validate coordinates
      if (latitude < -90 || latitude > 90) {
        throw new Error('Invalid latitude. Must be between -90 and 90');
      }
      if (longitude < -180 || longitude > 180) {
        throw new Error('Invalid longitude. Must be between -180 and 180');
      }

      const ts = timestamp || BigInt(Date.now() * 1000000); // Convert to nanoseconds
      console.log(`[Vehicle Update] Updating vehicle ${vehicleId} to (${latitude}, ${longitude})`);
      
      return actor.addOrUpdateVehicleLocation(vehicleId, latitude, longitude, ts);
    },
    onSuccess: (_, variables) => {
      console.log(`[Vehicle Update] Successfully updated vehicle ${variables.vehicleId}`);
      // Invalidate vehicle locations to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['vehicleLocations'] });
    },
    onError: (error, variables) => {
      console.error(`[Vehicle Update] Failed to update vehicle ${variables.vehicleId}:`, error);
    },
  });
}
