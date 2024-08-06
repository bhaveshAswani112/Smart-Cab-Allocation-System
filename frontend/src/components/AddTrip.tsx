import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { createTrip } from "../services/tripService"; 

const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

const defaultCenter = { lat: 22.54992, lng: 88.3392 };

const formSchema = z.object({
  startLocation: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  endLocation: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});


const MapComponent = ({ onEndLocationSelect }: { onEndLocationSelect: (location: { lat: number; lng: number }) => void }) => {
  const map = useMap();

  React.useEffect(() => {
    if (map) {
      const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          onEndLocationSelect({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }
      };

      map.addListener("click", handleMapClick);

    }
  }, [map, onEndLocationSelect]);

  return null;
};




export default function TripForm() {
  const { toast } = useToast();
  const [startLocation, setStartLocation] = React.useState<{ lat: number; lng: number } | null>(null);
  const [endLocation, setEndLocation] = React.useState<{ lat: number; lng: number } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startLocation: defaultCenter,
      endLocation: defaultCenter,
    },
  });

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          form.setValue("startLocation", userLocation);
          setStartLocation(userLocation);
        },
        (error) => {
          console.error("Error detecting location:", error);
          toast({
            title: "Location Detection Failed",
            description: "Please enter your start location manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      toast({
        title: "Geolocation Not Supported",
        description: "Please enter your start location manually.",
        variant: "destructive",
      });
    }
  }, [form, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        startLocation: {
          type: "Point",
          coordinates: [values.startLocation.lat, values.startLocation.lng] as [number, number]
        },
        endLocation: {
          type: "Point",
          coordinates: [values.endLocation.lat, values.endLocation.lng] as [number, number]
        }
      };
      await createTrip(data.startLocation, data.endLocation);
      toast({
        title: "Trip Created",
        description: "Your trip has been created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Trip Creation Failed",
        description: error.response.data.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
        <APIProvider apiKey={googleApiKey}>
          <Map
            style={{ width: '100%', height: '400px' }}
            defaultCenter={defaultCenter}
            defaultZoom={14}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId={"trip-map"}
          >
            <MapComponent 
              onEndLocationSelect={(location) => {
                setEndLocation(location);
                form.setValue('endLocation', location);
              }}
            />
            {startLocation && (
              <AdvancedMarker position={startLocation}>
                <Pin background={'#4285F4'} glyphColor={'#FFF'} borderColor={'#FFF'} />
              </AdvancedMarker>
            )}
            {endLocation && (
              <AdvancedMarker position={endLocation}>
                <Pin background={'#EA4335'} glyphColor={'#FFF'} borderColor={'#FFF'} />
              </AdvancedMarker>
            )}
          </Map>
        </APIProvider>

        <FormField
          control={form.control}
          name="startLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Location</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Automatically detected" 
                  value={field.value ? `${field.value.lat}, ${field.value.lng}` : ''} 
                  readOnly 
                />
              </FormControl>
              <FormDescription>
                Your trip's starting point.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Location</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Click on the map to set" 
                  value={field.value ? `${field.value.lat}, ${field.value.lng}` : ''} 
                  readOnly 
                />
              </FormControl>
              <FormDescription>
                Click on the map to set your destination.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Create Trip</Button>
      </form>
    </Form>
  );
}
