import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

type Cliente = {
  _id: string;
  nombre: string;
  tipo: string;
  localidad: string;
  provincia: string;
  pais: string;
  latitud: number;
  longitud: number;
};

type Props = {
  clientes: Cliente[];
};

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function SuperMap({ clientes }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">
      <MapContainer
        center={[-32.4075, -63.2402]}
        zoom={7}
        scrollWheelZoom
        className="h-[420px] w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {clientes.map((cliente) => (
          <Marker
            key={cliente._id}
            position={[cliente.latitud, cliente.longitud]}
            icon={markerIcon}
          >
            <Popup>
              <strong>{cliente.nombre}</strong>
              <br />
              {cliente.tipo}
              <br />
              {cliente.localidad}, {cliente.provincia}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}