import { useState, useEffect } from "react";
import socketService from "../services/socket";

/**
 * Hook to manage global activity events (the "Pulse")
 */
const useActivityPulse = (maxEvents = 5) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const handleNewActivity = (event) => {
            setEvents((prev) => {
                // Prevent duplicates based on ID
                if (prev.some(e => e.id === event.id)) return prev;
                
                // Add new event at the top, limit to maxEvents
                const updated = [event, ...prev].slice(0, maxEvents);
                return updated;
            });
        };

        socketService.connect();
        socketService.socket?.on("global_activity", handleNewActivity);

        return () => {
            socketService.socket?.off("global_activity", handleNewActivity);
        };
    }, [maxEvents]);

    return events;
};

export default useActivityPulse;
