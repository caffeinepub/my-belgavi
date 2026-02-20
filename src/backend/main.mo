import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Float "mo:core/Float";



actor {
  include MixinStorage();

  // Authentication state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ComplaintStatus = {
    #pending;
    #inProgress;
    #resolved;
  };

  public type Complaint = {
    id : Text;
    userId : Principal;
    description : Text;
    category : Text;
    location : Text;
    photo : ?Storage.ExternalBlob;
    status : ComplaintStatus;
    rating : ?Nat;
    feedback : ?Text;
    photoUrl : ?Text;
    latitude : ?Float;
    longitude : ?Float;
  };

  public type Vehicle = {
    id : Text;
    name : Text;
    latitude : Float; // Range: -90 (min) to 90 (max)
    longitude : Float; // Range: -180 (min) to 180 (max)
    vehicleType : VehicleType;
    timestamp : Int;
  };

  public type VehicleType = {
    #car;
    #bus;
    #truck;
    #train;
    #bike;
    #ambulance;
    #police;
    #fireTruck;
    #other : Text;
  };

  public type UserProfile = {
    name : Text;
    phone : ?Text;
    email : ?Text;
    address : ?Text;
  };

  public type TrainStation = {
    name : Text;
    code : Text;
    location : Text;
  };

  public type TrainRoute = {
    trainNumber : Text;
    trainName : Text;
    origin : TrainStation;
    destination : TrainStation;
    stops : [TrainStation];
    schedule : [TrainStopTime];
  };

  public type TrainStopTime = {
    station : TrainStation;
    arrivalTime : ?Text;
    departureTime : ?Text;
  };

  // Persistent Storage
  let complaints = Map.empty<Text, Complaint>();
  let vehicleLocations = Map.empty<Text, Vehicle>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let trainRoutes = Map.empty<Text, TrainRoute>();

  // Services - just in-memory data
  let propertyTaxURL = "http://propertytax.belagavicorporation.gov.in";
  let waterBillURL = "https://belagavicorporation.gov.in/water-bill-payment";
  let electricityBoardURL = "http://bescom.org";
  let tradeLicenseRenewalURL = "https://belagavicorporation.gov.in/trade-license-renewal";
  let birthCertsURL = "https://belagavicorporation.gov.in/birth-certificates";
  let deathCertsURL = "https://belagavicorporation.gov.in/death-certificates";

  var complaintCounter = 0;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Complaint Management
  public shared ({ caller }) func submitComplaint(
    description : Text,
    category : Text,
    location : Text,
    photo : ?Storage.ExternalBlob,
    latitude : ?Float,
    longitude : ?Float,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit complaints");
    };

    let complaintId = complaintCounter.toText();
    complaintCounter += 1;

    let complaint : Complaint = {
      id = complaintId;
      userId = caller;
      description;
      category;
      location;
      photo;
      status = #pending;
      rating = null;
      feedback = null;
      photoUrl = null;
      latitude;
      longitude;
    };

    complaints.add(complaintId, complaint);
    complaintId;
  };

  // Upload photo and get URL
  public shared ({ caller }) func uploadComplaintPhoto(complaintId : Text, photo : Storage.ExternalBlob, photoUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload photos");
    };

    let complaint = switch (complaints.get(complaintId)) {
      case (?c) { c };
      case (null) { Runtime.trap("Complaint not found") };
    };

    // Verify ownership
    if (complaint.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only upload photos to your own complaints");
    };

    let updatedComplaint : Complaint = {
      id = complaint.id;
      userId = complaint.userId;
      description = complaint.description;
      category = complaint.category;
      location = complaint.location;
      photo = ?photo;
      status = complaint.status;
      rating = complaint.rating;
      feedback = complaint.feedback;
      photoUrl = ?photoUrl;
      latitude = complaint.latitude;
      longitude = complaint.longitude;
    };

    complaints.add(complaintId, updatedComplaint);

    switch (updatedComplaint.photoUrl) {
      case (?url) { url };
      case (null) { Runtime.trap("Photo not found") };
    };
  };

  public query ({ caller }) func getComplaint(complaintId : Text) : async Complaint {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view complaints");
    };

    let complaint = switch (complaints.get(complaintId)) {
      case (?c) { c };
      case (null) { Runtime.trap("Complaint not found") };
    };

    // Verify ownership or admin access
    if (complaint.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own complaints");
    };

    complaint;
  };

  public query ({ caller }) func getAllComplaints() : async [Complaint] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all complaints");
    };
    complaints.values().toArray();
  };

  public shared ({ caller }) func updateComplaintStatus(complaintId : Text, status : ComplaintStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update status");
    };

    let complaint = switch (complaints.get(complaintId)) {
      case (?c) { c };
      case (null) { Runtime.trap("Complaint not found") };
    };

    let updatedComplaint : Complaint = {
      id = complaint.id;
      userId = complaint.userId;
      description = complaint.description;
      category = complaint.category;
      location = complaint.location;
      photo = complaint.photo;
      status;
      rating = complaint.rating;
      feedback = complaint.feedback;
      photoUrl = complaint.photoUrl;
      latitude = complaint.latitude;
      longitude = complaint.longitude;
    };

    complaints.add(complaintId, updatedComplaint);
  };

  public shared ({ caller }) func addComplaintRating(complaintId : Text, rating : Nat, feedback : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can rate complaints");
    };

    let complaint = switch (complaints.get(complaintId)) {
      case (?c) { c };
      case (null) { Runtime.trap("Complaint not found") };
    };

    // Verify ownership
    if (complaint.userId != caller) {
      Runtime.trap("Unauthorized: Can only rate your own complaints");
    };

    if (complaint.status != #resolved) {
      Runtime.trap("Can only rate resolved complaints");
    };

    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let updatedComplaint : Complaint = {
      id = complaint.id;
      userId = complaint.userId;
      description = complaint.description;
      category = complaint.category;
      location = complaint.location;
      photo = complaint.photo;
      status = complaint.status;
      rating = ?rating;
      feedback = ?feedback;
      photoUrl = complaint.photoUrl;
      latitude = complaint.latitude;
      longitude = complaint.longitude;
    };

    complaints.add(complaintId, updatedComplaint);
  };

  public query ({ caller }) func getUserComplaints() : async [Complaint] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view complaints");
    };

    complaints.values().toArray().filter(func(c) { c.userId == caller });
  };

  public query ({ caller }) func getComplaintsByStatus(status : ComplaintStatus) : async [Complaint] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view complaints by status");
    };

    complaints.values().toArray().filter(func(c) { c.status == status });
  };

  public query ({ caller }) func getServiceLinks() : async {
    propertyTaxURL : Text;
    waterBillURL : Text;
    electricityBoardURL : Text;
    tradeLicenseRenewalURL : Text;
    birthCertsURL : Text;
    deathCertsURL : Text;
  } {
    {
      propertyTaxURL;
      waterBillURL;
      electricityBoardURL;
      tradeLicenseRenewalURL;
      birthCertsURL;
      deathCertsURL;
    };
  };

  // Train Schedule Management
  public shared ({ caller }) func addTrainRoute(route : TrainRoute) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add routes");
    };
    trainRoutes.add(route.trainNumber, route);
  };

  public query ({ caller }) func getTrainRoute(trainNumber : Text) : async TrainRoute {
    switch (trainRoutes.get(trainNumber)) {
      case (?route) { route };
      case (null) { Runtime.trap("Train route not found") };
    };
  };

  public query ({ caller }) func getAllTrainRoutes() : async [TrainRoute] {
    trainRoutes.values().toArray();
  };

  public query ({ caller }) func getTrainsByStation(stationCode : Text) : async [TrainRoute] {
    trainRoutes.values().toArray().filter(
      func(route) {
        route.origin.code == stationCode or route.destination.code == stationCode or route.stops.any(
          func(station) { station.code == stationCode }
        )
      }
    );
  };

  // Get trains between two stations
  public query ({ caller }) func getTrainsBetweenStations(originCode : Text, destinationCode : Text) : async [TrainRoute] {
    trainRoutes.values().toArray().filter(
      func(route) {
        ((route.origin.code == originCode and route.destination.code == destinationCode) or (route.origin.code == destinationCode and route.destination.code == originCode))
      }
    );
  };

  // Live GPS Vehicle Tracking
  public shared ({ caller }) func addOrUpdateVehicleLocation(
    vehicleId : Text,
    latitude : Float,
    longitude : Float,
    timestamp : Int,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update vehicle locations");
    };

    if ((-90.0 > latitude) or (latitude > 90.0)) {
      Runtime.trap("Invalid latitude. It must be between -90 and 90");
    };

    if ((-180.0 > longitude) or (longitude > 180.0)) {
      Runtime.trap("Invalid longitude. It must be between -180 and 180");
    };

    let vehicle : Vehicle = {
      id = vehicleId;
      name = vehicleId;
      latitude;
      longitude;
      vehicleType = #car; // Default vehicle type
      timestamp;
    };

    vehicleLocations.add(vehicleId, vehicle);
  };

  public query ({ caller }) func getVehicleLocation(vehicleId : Text) : async Vehicle {
    switch (vehicleLocations.get(vehicleId)) {
      case (?vehicle) { vehicle };
      case (null) { Runtime.trap("Vehicle location not found") };
    };
  };

  public query ({ caller }) func getAllVehicleLocations() : async [Vehicle] {
    vehicleLocations.values().toArray();
  };

  public query ({ caller }) func getVehicleLocations() : async [Vehicle] {
    vehicleLocations.values().toArray();
  };

  public query ({ caller }) func getVehicleLocationsInBounds(north : Float, south : Float, east : Float, west : Float) : async [Vehicle] {
    vehicleLocations.values().toArray().filter(
      func(vehicle) {
        vehicle.latitude <= north and vehicle.latitude >= south and vehicle.longitude >= west and vehicle.longitude <= east
      }
    );
  };

  // Remove vehicle location
  public shared ({ caller }) func removeVehicleLocation(vehicleId : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove vehicle locations");
    };
    vehicleLocations.remove(vehicleId);
  };

  // Update vehicle location and keep history (return previous location)
  public shared ({ caller }) func updateVehicleLocationWithHistory(
    vehicleId : Text,
    name : Text,
    latitude : Float,
    longitude : Float,
    vehicleType : VehicleType,
    timestamp : Int,
  ) : async ?Vehicle {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update vehicle locations");
    };

    if ((-90.0 > latitude) or (latitude > 90.0)) {
      Runtime.trap("Invalid latitude. It must be between -90 and 90");
    };

    if ((-180.0 > longitude) or (longitude > 180.0)) {
      Runtime.trap("Invalid longitude. It must be between -180 and 180");
    };

    let previousLocation = vehicleLocations.get(vehicleId);

    let vehicle : Vehicle = {
      id = vehicleId;
      name;
      latitude;
      longitude;
      vehicleType;
      timestamp;
    };

    vehicleLocations.add(vehicleId, vehicle);
    previousLocation;
  };

  public query ({ caller }) func getLatestVehicleLocations(count : Nat) : async [Vehicle] {
    let allVehicles = vehicleLocations.values().toArray();
    if (allVehicles.size() <= count) {
      return allVehicles;
    };

    Array.tabulate<Vehicle>(
      count,
      func(i) { allVehicles[i] },
    );
  };
};

