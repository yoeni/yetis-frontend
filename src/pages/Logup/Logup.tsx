import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Select, notification } from 'antd';
import './Logup.css';
import { MapContainer as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from 'leaflet';
import locationPng from "../../images/location.png";
import { getMyIp, registerUser } from '../../services/userServices';
import { getLocationFromString } from '../../utils/globalFuncs';

interface LogupProps {}

const Logup: React.FC<LogupProps> = () => {
    const [selectedLoc, setLoc] = useState<number[] | null>();
    const markerRef = useRef<any>(null);
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const openNotification = useCallback((message: string, isError?: boolean) => {
        api[isError ? 'error' : 'success']({
          message: isError ? 'Error': 'Success',
          description: message,
          placement: 'top',
          
        });
      }, [api]);

    useEffect(() => {
        const fetchData = async () => {
            const ipReq = await getMyIp();
            if (ipReq.status == 200){
                const loc = ipReq.data.latitude+','+ipReq.data.longitude;
                setLoc(getLocationFromString(loc));
                return;
            }
            openNotification('An error occured when get location!', true);
        };
        fetchData();
    }, []);

    const onFinish = async (values: any) => {
        console.log(values)
        if (values.name && 
            values.username && 
            values.password &&
            values.passwordAgain &&
            values.password === values.passwordAgain &&
            values.mail && 
            selectedLoc) {
                console.log ('trying');
                const state = await registerUser(values.username, values.mail, values.password, 2, values.name, selectedLoc[0].toString() + ',' + selectedLoc[1].toString())
                if (state.status === 200)
                    openNotification('Successfully registered!');
                    return;
            }
        
        openNotification('An error occured!', true);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        name?: string;
        username?: string;
        password?: string;
        passwordAgain?: string;
        mail?: string;
        native?: string;
        remember?: string;

    };

    const eventHandlers = useMemo(
        () => ({
          dragend() {
            const marker = markerRef.current;
            if (marker != null) {
                const loc = marker.getLatLng();
                setLoc([loc.lat, loc.lng]);
            }
          },
        }),
        [],
      )
    return (
        <div className='login-container'>
            {contextHolder}
            <div className='logo-title'>Yetis</div>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Password Again"
                    name="passwordAgain"
                    rules={[{ required: true, message: 'Please input your password again!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item<FieldType>
                    label="E-mail"
                    name="mail"
                    rules={[{ required: true, message: 'Please input your mail!' }]}
                >
                    <Input type='mail' />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Location"
                >
                {selectedLoc && 
                    <LeafletMap
                    center={[selectedLoc[0],selectedLoc[1]]}
                    zoom={16}
                    maxZoom={20}
                    attributionControl={true}
                    zoomControl={true}
                    doubleClickZoom={true}
                    scrollWheelZoom={true}
                    dragging={true}
                    easeLinearity={0.35}
                    style={{ height: '200px'}}
                >
                    <TileLayer
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                    <Marker 
                    ref={markerRef}
                    eventHandlers={eventHandlers}
                    position={[selectedLoc[0],selectedLoc[1]]}
                    draggable={true}
                    icon={new Icon({ iconUrl: locationPng, iconSize: [40, 50] })}
                    
                    >
                        <Popup >
                            Here is your location.
                        </Popup>

                    </Marker>
                </LeafletMap>}
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }} style={{ display: 'flex', justifyContent: 'end', flexDirection: 'column'}}>
                    <Button type='link' onClick={() => navigate('/login')}>Log in</Button>
                    <Button type="primary" htmlType="submit">
                        Sign Up
                    </Button>
                    
                </Form.Item>
            </Form>
        </div>
    );
};

export default Logup;
