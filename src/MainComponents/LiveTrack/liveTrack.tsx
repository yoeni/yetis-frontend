import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { Avatar, Flex, Modal, Rate, notification } from 'antd';
import { LayersControl, MapContainer, TileLayer, useMap } from 'react-leaflet';
import L, { latLng, LatLng } from 'leaflet';
import 'leaflet-routing-machine';
import { IOrder, IState, IUser } from '../../reducer';
import './assesment.scss';
import TextArea from 'antd/es/input/TextArea';
import { useSelector } from 'react-redux';
import { getCookie } from '../../utils/cookies';
import { getLatLngFromString, getLocationFromString } from '../../utils/globalFuncs';
import RoutingControl from './components/RoutingControl';
import { loadavg } from 'os';
interface LiveTrackProps {
  orders: IOrder[];
  mainLoc: string;
}
const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];


const LiveTrack: React.FC<LiveTrackProps> = ({ mainLoc, orders }) => {
  const [myLocation, setCourierLocation] = useState(getLatLngFromString(mainLoc));
  const location = useSelector((state: IState) => state.location);

  const [api, contextHolder] = notification.useNotification();
  const [routes, setRoutes] = useState<JSX.Element[]>([]);
  const updateRoutes = useCallback(() => {
    console.log('REfresed')
    if (orders.length ==  0) {
      return;
    }
    const closest = findClosestLocation(orders);
    setRoutes(orders.map(order => (
      <RoutingControl
        key={order.id}
        notif={openNotification}
        order={order}
        from={myLocation}
        to={getLatLngFromString(order.location)}
        update={nextToCurrent}
        selected={order.id === closest}
      />
    )));
  }, [orders, myLocation]);
  
  
const nextToCurrent = (loc: LatLng) => {
  setCourierLocation(loc);
}
useEffect(() => {
  updateRoutes();
}, [myLocation, updateRoutes])
  useEffect(() => {
    const interval = setInterval(() => {
      if (location)
          setCourierLocation(location)
    }, 5000);

    return () => clearInterval(interval);
  }, [location]);

  const openNotification = useCallback((message: string, isError?: boolean) => {
    api[isError ? 'error' : 'success']({
      message: isError ? 'Error' : 'Success',
      description: message,
      placement: 'top',

    });
  }, [api]);
  const findClosestLocation = (orders: IOrder[]) => {
    let closestOrder = orders[0];
    let closestDistance = myLocation.distanceTo(getLatLngFromString(closestOrder.location));

    orders.forEach(order => {
      const orderLocation = getLatLngFromString(order.location);
      const distance = myLocation.distanceTo(orderLocation);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestOrder = order;
      }
    });

    return closestOrder.id;
  };

  return (
    <>
      <MapContainer center={myLocation} zoom={18} maxZoom={19} minZoom={1} style={{ height: 600, width: '100%' }}>

        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              noWrap={false}
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Dark">
            <TileLayer
              noWrap={false}
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="OpenStreet">
            <TileLayer
              noWrap={false}
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        {
          routes
        }
        </LayersControl>


      </MapContainer>
    </>
  );
};

export default LiveTrack;