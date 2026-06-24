import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
  clienteSeleccionado?: string | null;
};

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function CentrarCliente({
  clientes,
  clienteSeleccionado,
}: Props) {
  const map = useMap();

  useEffect(() => {
    if (!clienteSeleccionado) return;

    const cliente = clientes.find((c) => c._id === clienteSeleccionado);
    if (!cliente) return;

    map.flyTo([cliente.latitud, cliente.longitud], 15, {
      duration: 1.2,
    });
  }, [clienteSeleccionado, clientes, map]);

  return null;
}

export default function SuperMap({ clientes, clienteSeleccionado }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <MapContainer
        center={[-32.4075, -63.2402]}
        zoom={7}
        scrollWheelZoom
        className="h-[420px] w-full"
      >
        <CentrarCliente
          clientes={clientes}
          clienteSeleccionado={clienteSeleccionado}
        />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {clientes.map((cliente) => (
          <Marker
            key={cliente._id}
            position={[cliente.latitud, cliente.longitud]}
            icon={markerIcon}
          >
            <Popup>
              <strong className="text-gray-900 dark:text-gray-100">{cliente.nombre}</strong>
              <br />
              <span className="text-gray-600 dark:text-gray-400">{cliente.tipo}</span>
              <br />
              <span className="text-gray-500 dark:text-gray-400">
                {cliente.localidad}, {cliente.provincia}
              </span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}