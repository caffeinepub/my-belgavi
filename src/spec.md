# Specification

## Summary
**Goal:** Fix the GPS vehicle tracking feature on the transport map so that live vehicle locations are displayed and updated in real-time.

**Planned changes:**
- Debug and fix the vehicle location fetching from backend getVehicleLocations query
- Verify backend query returns valid vehicle data with required fields (id, name, latitude, longitude, type)
- Configure frontend useQueries hook with proper refetch intervals and error handling
- Fix Google Maps marker management to properly display, update, and remove vehicle markers without duplicates

**User-visible outcome:** Users can see real-time vehicle positions on the transport map, with markers that automatically update their locations as vehicles move.
