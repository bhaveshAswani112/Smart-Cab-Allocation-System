import { Trip } from "../models/trip.js";
import { Cab } from "../models/cab.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Client } from '@googlemaps/google-maps-services-js';

// Create an instance of the Google Maps client
const client = new Client({});

const createTrip = asyncHandler(async (req, res) => {
    const { startLocation, endLocation } = req.body;

    try {
        if (!startLocation?.coordinates || !endLocation?.coordinates) {
            return res.status(400).json(
                new ApiResponse(400, {}, 'Invalid location data')
            );
        }

        // Fetch all available cabs
        const availableCabs = await Cab.find({ status: 'idle' });

        if (availableCabs.length === 0) {
            return res.status(404).json(
                new ApiResponse(404, {}, 'No cabs available')
            );
        }

        let nearestCab = null;
        let minDuration = Infinity;

        // Find the nearest cab based on travel time
        for (const cab of availableCabs) {
            const [cabLng, cabLat] = cab.location.coordinates;
            const [startLng, startLat] = startLocation.coordinates;

            const response = await client.directions({
                params: {
                    origin: `${cabLat},${cabLng}`,
                    destination: `${startLat},${startLng}`,
                    mode: 'driving', // Specify driving mode
                    departure_time: 'now', // Consider current traffic conditions
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            });

            const duration = response.data.routes[0].legs[0].duration_in_traffic.value;
            console.log(duration)

            if (duration < minDuration) {
                minDuration = duration;
                nearestCab = cab;
            }
        }

        // Create the trip
        const trip = new Trip({
            startLocation: { type: 'Point', coordinates: startLocation.coordinates },
            endLocation: { type: 'Point', coordinates: endLocation.coordinates },
            cabId: nearestCab._id,
            userId: req.user._id,
        });

        // Update cab status
        nearestCab.status = 'engaged';
        await nearestCab.save();

        // Save the trip
        await trip.save();

        return res.status(201).json(
            new ApiResponse(201, { trip }, 'Trip created successfully')
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json(
            new ApiResponse(500, {}, `Error creating trip: ${error.message}`)
        );
    }
});



export { createTrip };
