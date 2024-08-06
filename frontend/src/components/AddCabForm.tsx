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
import { addCab } from "@/services/cabService";

const defaultCenter = { lat: 22.54992, lng: 88.3392 };
const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const formSchema = z.object({
  cabId: z.string().min(1, {
    message: "Cab ID is required.",
  }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

const MapComponent = ({ onLocationSelect }: { onLocationSelect: (location: { lat: number; lng: number }) => void }) => {
  const map = useMap();

  React.useEffect(() => {
    if (map) {
      const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          onLocationSelect({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }
      };

      map.addListener("click", handleMapClick);
    }
  }, [map, onLocationSelect]);

  return null;
};

export function AddCabForm() {
  const { toast } = useToast();
  const [cabLocation, setCabLocation] = React.useState<{ lat: number; lng: number } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cabId: "",
      location: defaultCenter,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const cabData = {
        cabId: values.cabId,
        location: {
          type: "Point",
          coordinates: [values.location.lng, values.location.lat] as [number, number],
        },
      };
      await addCab(cabData);
      toast({
        title: "Cab Added Successfully",
        description: "The cab has been added to the system.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Add Cab",
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
            mapId={"cab-map"}
          >
            <MapComponent 
              onLocationSelect={(location) => {
                setCabLocation(location);
                form.setValue('location', location);
              }}
            />
            {cabLocation && (
              <AdvancedMarker position={cabLocation}>
                <Pin background={'#4285F4'} glyphColor={'#FFF'} borderColor={'#FFF'} />
              </AdvancedMarker>
            )}
          </Map>
        </APIProvider>

        <FormField
          control={form.control}
          name="cabId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cab ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter cab ID" {...field} />
              </FormControl>
              <FormDescription>
                Unique identifier for the cab.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cab Location</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Click on the map to set" 
                  value={field.value ? `${field.value.lat}, ${field.value.lng}` : ''} 
                  readOnly 
                />
              </FormControl>
              <FormDescription>
                Click on the map to set the cab's location.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Add Cab</Button>
      </form>
    </Form>
  );
}