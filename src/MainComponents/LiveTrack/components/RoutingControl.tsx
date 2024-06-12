import { useMap } from 'react-leaflet';
import L, { LatLng } from 'leaflet';
import { useEffect, useRef } from 'react';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import { IOrder } from '../../../reducer';
import { useDispatch } from 'react-redux';

interface RoutingControlProps {
  order: IOrder;
  from: L.LatLng;
  to: L.LatLng;
  update: (loc: LatLng) => void;
  selected?: boolean;
  notif: (message: string, isError?: boolean) => void;
}

const RoutingControl: React.FC<RoutingControlProps> = ({ notif, order, update, selected, from, to }) => {
  const map = useMap();
  const dispatch = useDispatch();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map) return;

    const myIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/206/206857.png",
      iconSize: [40, 40]
    });
    const icon = L.icon({
      iconUrl: "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
      iconSize: [40, 40]
    });

    try {
      if (routingControlRef.current) {
        routingControlRef.current.getPlan().setWaypoints([]);
        map.removeControl(routingControlRef.current);
      }

      const routingControl = L.Routing.control({
        waypoints: [from, to],
        plan: L.Routing.plan([from, to], {
          createMarker: function (i, wp) {
            if (i === 0 && !selected) return false;
            const marker = L.marker(wp.latLng, {
              draggable: false,
              icon: (selected && i === 0) ? myIcon : icon,
            });
            if (i !== 0) {
              marker.bindPopup(
                `<p><b>Customer: </b>${order.customer.name}</p>
                <p><b>Status: </b>${order.status}</p>
                <p><b>Created Date: </b>${order.created_at}</p>
                <p><b>Location: </b>${order.location}</p>`
              );
            }
            return marker;
          },
          addWaypoints: false,
          draggableWaypoints: false,
        }),
        lineOptions: {
          styles: [{ color: selected ? 'red' : 'blue', weight: 4, fill: false, stroke: true, opacity: 1 }],
          extendToWaypoints: false,
          missingRouteTolerance: 10,
        },
        addWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
        waypointMode: 'snap',
        show: false, 
      });

      routingControl.addTo(map);
      routingControl.on('routesfound', (e: any) => {
        if (selected) {
          const wayRoutes = e.routes;
          const next = wayRoutes[0].coordinates[10] as unknown as LatLng;

          dispatch({ type: 'setLocation', payload: next });
        }
      });

      routingControlRef.current = routingControl;
    } catch (e: any) {
      notif(e.message, true);
    }

    return () => {
      if (routingControlRef.current) {
        try {
          routingControlRef.current.getPlan().setWaypoints([]);
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        } catch (e: any)  {
          
        }
      }
    };
  }, [map, from, to, selected, dispatch, notif, order]);

  return null;
};

export default RoutingControl;
