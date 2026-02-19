import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type OldVehicle = {
    id : Text;
    latitude : Float;
    longitude : Float;
    timestamp : Int;
  };

  type OldActor = {
    vehicleLocations : Map.Map<Text, OldVehicle>;
  };

  type NewVehicle = {
    id : Text;
    name : Text;
    latitude : Float;
    longitude : Float;
    vehicleType : {
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
    timestamp : Int;
  };

  type NewActor = {
    vehicleLocations : Map.Map<Text, NewVehicle>;
  };

  public func run(old : OldActor) : NewActor {
    let newVehicleLocations = old.vehicleLocations.map<Text, OldVehicle, NewVehicle>(
      func(_id, oldVehicle) {
        {
          oldVehicle with
          name = oldVehicle.id; // Use id as name
          vehicleType = #other("unknown"); // Default vehicle type
        };
      }
    );
    { vehicleLocations = newVehicleLocations };
  };
};
