import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';

export default function DraggableMarkerMap({ initialAddress, initialPosition, onAddressUpdate }: any) {
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const geocoderRef = useRef<any>(null);
    const [loading, setLoading] = useState(true);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [address, setAddress] = useState('');
    const [position, setPosition] = useState(
        initialPosition
    );

    useEffect(() => {
        const loadMap = async () => {
            try {
                const loader = new Loader({
                    apiKey: import.meta.env.VITE_MAP_API_KEY,
                    libraries: ['places'],
                    version: 'weekly',
                });

                await loader.load();
                setMapLoaded(true);
            } catch (error) {
                console.error('Error al cargar Google Maps:', error);
                setLoading(false);
            }
        };

        loadMap();
    }, []);

    useEffect(() => {
        if (!mapLoaded || !mapRef.current) return;

        const initMap = () => {
            try {
                const map = new window.google.maps.Map(mapRef.current, {
                    center: position,
                    zoom: 15,
                });

                geocoderRef.current = new window.google.maps.Geocoder();

                markerRef.current = new window.google.maps.Marker({
                    position,
                    map,
                    draggable: true,
                    title: "Arrástrame para seleccionar ubicación",
                });

                reverseGeocode(position);

                markerRef.current.addListener('dragend', (e: any) => {
                    const newPos = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                    };
                    setPosition(newPos);
                    reverseGeocode(newPos);
                });

                map.addListener('click', (e: any) => {
                    const newPos = {
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                    };
                    markerRef.current.setPosition(newPos);
                    setPosition(newPos);
                    reverseGeocode(newPos);
                });

                setLoading(false);
            } catch (error) {
                console.error('Error al inicializar el mapa:', error);
                setLoading(false);
            }
        };

        initMap();
    }, [mapLoaded]);

    const reverseGeocode = ({ lat, lng }: any) => {
        if (!geocoderRef.current) return;

        geocoderRef.current.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
            if (status === 'OK' && results[0]) {
                const addr = results[0].formatted_address;
                setAddress(addr);
                onAddressUpdate?.({
                    address: addr,
                    latitude: lat,
                    longitude: lng,
                    place_id: results[0].place_id,
                });
            }
        });
    };

    if (!mapRef.current) {
        return (
            <div className="p-4 text-center">
                <div ref={mapRef} className="w-full h-96" />
                Cargando mapa...
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div ref={mapRef} className="w-full h-96 rounded-lg border" style={{ display: loading ? 'none' : 'block' }} />

            {loading && (
                <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                    <p>Cargando mapa...</p>
                </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Dirección seleccionada:</h3>
                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="La dirección se completará automáticamente"
                    rows={3}
                />
                <div className="mt-2 text-sm text-gray-600">
                    <p>Coordenadas: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}</p>
                </div>
            </div>
        </div>
    );
}