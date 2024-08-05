import { Cab } from "../models/cab.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllCabs = asyncHandler(async (req, res) => {
    try {
        const cabs = await Cab.find();
        return res.status(200).json(
            new ApiResponse(200, { cabs }, 'Cabs fetched successfully')
        );
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, {}, `Error fetching cabs: ${error.message}`)
        );
    }
});

const updateCabLocation = asyncHandler(async (req, res) => {
    const { cabId, coordinates } = req.body;
    try {
        const cab = await Cab.findOneAndUpdate(
            { cabId },
            { location: { type: 'Point', coordinates } },
            { new: true }
        );

        if (!cab) {
            return res.status(404).json(
                new ApiResponse(404, {}, 'Cab not found')
            );
        }

        return res.status(200).json(
            new ApiResponse(200, { cab }, 'Cab location updated successfully')
        );
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, {}, `Error updating cab location: ${error.message}`)
        );
    }
});

const addCab = asyncHandler(async (req, res) => {
    const { cabId, location } = req.body;

    try {
        const existed = await Cab.findOne({
            cabId
        })
        if(existed){
            return res.status(400).json(
                new ApiResponse(400, {}, 'Cab with this cab id already exist')
            );
        }
        const cab = await Cab.create({
            cabId,
            location
        });
        return res.status(201).json(
            new ApiResponse(201, { cab }, 'Cab allocated successfully')
        );
    } catch (error) {
        console.error("Error from addCab: " + error.message);
        return res.status(500).json(
            new ApiResponse(500, {}, 'Error during cab allocation')
        );
    }
});

export { getAllCabs, updateCabLocation, addCab };
