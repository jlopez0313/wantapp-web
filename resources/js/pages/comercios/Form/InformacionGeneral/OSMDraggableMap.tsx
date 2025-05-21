import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';

// Fix para iconos de Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerIconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function OSMDraggableMap({ initialPosition, onAddressUpdate }: any) {
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [position, setPosition] = useState(initialPosition || { lat: 19.4326, lng: -99.1332 });
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = L.map(mapRef.current).setView([position.lat, position.lng], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        markerRef.current = L.marker([position.lat, position.lng], {
            draggable: true,
            icon: DefaultIcon
        }).addTo(map);

        reverseGeocode(position.lat, position.lng);

        markerRef.current.on('dragend', (e: any) => {
            const newPos = {
                lat: e.target.getLatLng().lat,
                lng: e.target.getLatLng().lng,
            };
            setPosition(newPos);
            reverseGeocode(newPos.lat, newPos.lng);
        });

        map.on('click', (e: any) => {
            const newPos = {
                lat: e.latlng.lat,
                lng: e.latlng.lng,
            };
            markerRef.current.setLatLng(newPos);
            setPosition(newPos);
            reverseGeocode(newPos.lat, newPos.lng);
        });

        return () => {
            map.remove();
        };
    }, []);

    const reverseGeocode = async (lat: number, lng: number) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();

            if (data.display_name) {
                const addr = data.display_name;
                setAddress(addr);
                if (onAddressUpdate) {
                    onAddressUpdate({
                        address: addr,
                        latitude: lat,
                        longitude: lng,
                        osm_id: data.osm_id,
                        addressDetails: data.address
                    });
                }
            }
        } catch (error) {
            console.error('Error en reverse geocoding:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div ref={mapRef} className="w-full h-96 rounded-lg border" />

            <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Dirección seleccionada:</h3>
                {loading ? (
                    <p className="text-gray-500">Buscando dirección...</p>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
}