import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TrainStation {
    code: string;
    name: string;
    location: string;
}
export type VehicleType = {
    __kind__: "bus";
    bus: null;
} | {
    __kind__: "car";
    car: null;
} | {
    __kind__: "fireTruck";
    fireTruck: null;
} | {
    __kind__: "train";
    train: null;
} | {
    __kind__: "truck";
    truck: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "bike";
    bike: null;
} | {
    __kind__: "ambulance";
    ambulance: null;
} | {
    __kind__: "police";
    police: null;
};
export interface TrainStopTime {
    arrivalTime?: string;
    station: TrainStation;
    departureTime?: string;
}
export interface TrainRoute {
    destination: TrainStation;
    trainNumber: string;
    origin: TrainStation;
    trainName: string;
    stops: Array<TrainStation>;
    schedule: Array<TrainStopTime>;
}
export interface Complaint {
    id: string;
    status: ComplaintStatus;
    latitude?: number;
    userId: Principal;
    description: string;
    photoUrl?: string;
    feedback?: string;
    longitude?: number;
    category: string;
    rating?: bigint;
    photo?: ExternalBlob;
    location: string;
}
export interface Vehicle {
    id: string;
    latitude: number;
    vehicleType: VehicleType;
    name: string;
    longitude: number;
    timestamp: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
    address?: string;
    phone?: string;
}
export enum ComplaintStatus {
    resolved = "resolved",
    pending = "pending",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComplaintRating(complaintId: string, rating: bigint, feedback: string): Promise<void>;
    addOrUpdateVehicleLocation(vehicleId: string, latitude: number, longitude: number, timestamp: bigint): Promise<void>;
    addTrainRoute(route: TrainRoute): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllComplaints(): Promise<Array<Complaint>>;
    getAllTrainRoutes(): Promise<Array<TrainRoute>>;
    getAllVehicleLocations(): Promise<Array<Vehicle>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getComplaint(complaintId: string): Promise<Complaint>;
    getComplaintsByStatus(status: ComplaintStatus): Promise<Array<Complaint>>;
    getLatestVehicleLocations(count: bigint): Promise<Array<Vehicle>>;
    getServiceLinks(): Promise<{
        propertyTaxURL: string;
        waterBillURL: string;
        electricityBoardURL: string;
        deathCertsURL: string;
        birthCertsURL: string;
        tradeLicenseRenewalURL: string;
    }>;
    getTrainRoute(trainNumber: string): Promise<TrainRoute>;
    getTrainsBetweenStations(originCode: string, destinationCode: string): Promise<Array<TrainRoute>>;
    getTrainsByStation(stationCode: string): Promise<Array<TrainRoute>>;
    getUserComplaints(): Promise<Array<Complaint>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVehicleLocation(vehicleId: string): Promise<Vehicle>;
    getVehicleLocations(): Promise<Array<Vehicle>>;
    getVehicleLocationsInBounds(north: number, south: number, east: number, west: number): Promise<Array<Vehicle>>;
    isCallerAdmin(): Promise<boolean>;
    removeVehicleLocation(vehicleId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitComplaint(description: string, category: string, location: string, photo: ExternalBlob | null, latitude: number | null, longitude: number | null): Promise<string>;
    updateComplaintStatus(complaintId: string, status: ComplaintStatus): Promise<void>;
    updateVehicleLocationWithHistory(vehicleId: string, name: string, latitude: number, longitude: number, vehicleType: VehicleType, timestamp: bigint): Promise<Vehicle | null>;
    uploadComplaintPhoto(complaintId: string, photo: ExternalBlob, photoUrl: string): Promise<string>;
}
