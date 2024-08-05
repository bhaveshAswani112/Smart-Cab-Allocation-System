import { io } from '../server';
import {Cab} from "../models/cab";

io.on('connection', (socket) => {
    socket.on('updateLocation', async ({ cabId, coordinates }) => {
        try {
            const cab = await Cab.findOneAndUpdate(
                { cabId },
                { location: { type: 'Point', coordinates } },
                { new: true }
            );
            io.emit('locationUpdated', cab);
        } catch (error) {
            console.error(error);
        }
    });
});
