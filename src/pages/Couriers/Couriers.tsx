import React, { useCallback, useEffect, useState } from 'react';
import { ICourier, IOrder, IState, OrderState } from '../../reducer';
import { useSelector } from 'react-redux';
import { getCookie } from '../../utils/cookies';
//import Material from './components/matertialComponent';
import { Flex, FormInstance, MenuProps, Tag } from 'antd';
import { Input, Space, Button, Form, notification, Menu } from 'antd';
import { OrderedListOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Order from './components/courierComponent';
import LiveTrack from '../../MainComponents/LiveTrack/liveTrack';
import CourierComponent from './components/courierComponent';
import { getAllCouriers } from '../../services/courierServices';

interface CouriersProps {}

const Couriers: React.FC<CouriersProps> = () => {
    const userSelector = useSelector((state: IState) => state.user);
    const [couriers, setCouriers] = useState<ICourier[]>([]);
    const [api, contextHolder] = notification.useNotification();


    const openNotification = useCallback((message: string, isError?: boolean) => {
      api[isError ? 'error' : 'success']({
        message: isError ? 'Error': 'Success',
        description: message,
        placement: 'top',
        
      });
    }, [api]);

    const getCouriers = useCallback(async () => {
      const token = getCookie('token');
      if (token) {
        const state = await getAllCouriers(token);
        console.log(state)
        if (state.status === 200 && state.data) {
          setCouriers(state.data);
          return;
        }
      }
  
      openNotification('An error occured when get couriers', true);
    }, [openNotification]);

    
    useEffect(() => {
      if (userSelector) {
        getCouriers();
      }
    }, [userSelector]);


    
    

  return (
    <div style={{ height: '95%', padding: "0 24px" }}>
      {contextHolder}
      {/*<h2>{user?.name}</h2>*/}
      
      <Flex justify={'flex-start'} align={'center'} className='order-header' gap={10} style={{ padding: 10 }}><Tag>Couriers</Tag></Flex>
      <div >{
        couriers.map((courier) => {
          return <CourierComponent key={courier.id} courier={courier}/>
        })
      }</div>
    </div>
  );
};

export default Couriers;
