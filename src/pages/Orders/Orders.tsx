import React, { useCallback, useEffect, useState } from 'react';
import { ICourier, IOrder, IState, IUser, OrderState, UserType } from '../../reducer';
import { useSelector } from 'react-redux';
import { getCookie } from '../../utils/cookies';
//import Material from './components/matertialComponent';
import { Flex, FormInstance, MenuProps, Tag } from 'antd';
import { Input, Space, Button, Form, notification, Menu } from 'antd';
import { OrderedListOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Order from './components/orderComponent';
import LiveTrack from '../../MainComponents/LiveTrack/liveTrack';
import './Order.css'
import { assignOrder, generateFakeOrders, getAllOrders, getOrderByCourier, updateOrderStatus } from '../../services/orderServices';
import { deleteUserByType, getUsersByType } from '../../services/userServices';

interface OrdersProps { }

const Orders: React.FC<OrdersProps> = () => {
  const userSelector = useSelector((state: IState) => state.user);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [couriers, setCouriers] = useState<ICourier[]>([]);
  const [selectedOrder, selectOrder] = useState<IOrder | null>();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = useCallback((message: string, isError?: boolean) => {
    api[isError ? 'error' : 'success']({
      message: isError ? 'Error' : 'Success',
      description: message,
      placement: 'top',

    });
  }, [api]);

  const getCouriers = useCallback(async () => {
    const token = getCookie('token');
    if (token) {
      const state = await getUsersByType(UserType.courier, token);
      if (state.status === 200 && state.data[0]) {
        setCouriers(state.data);
        return;
      }
    }

    openNotification('An error occured when get couriers', true);
  }, [openNotification]);

  useEffect(() => {
    if (userSelector) {
      getCouriers();
      getOrders();
    }
  }, [userSelector]);
  




  const closeLiveTrack = () => {
    selectOrder(null);
  }
  const selectOpenOrder = (targerOrder: IOrder) => {
    selectOrder(targerOrder);
  }
  const getOrders = async () => {
    const token = getCookie('token');
    if (userSelector && token) {
      console.log(userSelector);
      const ordersReq = userSelector.usertype === UserType.admin ? await getAllOrders(token) : await getOrderByCourier(userSelector.id, token);
      if (ordersReq.status == 200) {
        setOrders(ordersReq.data || []);
      } else
        openNotification('An error occured!', true);

    }
  }
  const resetData = async () => {
    const token = getCookie('token');
    if (userSelector && token) {
      const status = await deleteUserByType(UserType.customer, token);
      if (status.status == 200) {
        await generateFakeOrders(token);
        await getOrders();
      } else
        openNotification('An error occured!', true);

    }
  }
  const assignOrderToCourier = async (orderId: string, courierId: string) => {
    const token = getCookie('token');
    if (token) {
      const state = await assignOrder(orderId, courierId, token);
      if (state.status == 200) {
        const updateState = await updateOrderStatus(orderId, OrderState.onRoad, token);
        if (updateState.status == 200)
          openNotification('Successfully!');

      }
      else
        openNotification('An error occured!', true);
    }
  }
  const updateOrderState = async (orderId: string, state: OrderState) => {
    const token = getCookie('token');
    if (token) {
      const updateState = await updateOrderStatus(orderId, state, token);
      if (updateState.status == 200) {
        openNotification('Successfully!');
        if (userSelector?.usertype == UserType.courier)
            getOrders();
      }
      else
        openNotification('An error occured!', true);
    }
  };

  return (
    <div style={{ height: '95%', padding: "0 24px" }}>
      {contextHolder}
      <Flex justify={'flex-start'} align={'center'} className='order-header' gap={10} style={{ padding: 10 }}>
        <Tag>Orders</Tag>
        { userSelector?.usertype == UserType.admin &&
        <>
          <Button type='primary' onClick={getOrders}>Get Orders</Button>
          <Button type='primary' danger onClick={resetData}>Reset All Data</Button>
        </>
        }
      </Flex>
      <div style={{ height: '90%', overflowY: 'auto' }}>
        
        { userSelector?.usertype == UserType.courier && <LiveTrack orders={orders.filter(order => order.status == OrderState.onRoad)} mainLoc={userSelector?.location!}/> }
        {
        orders.map((order) => {
          return <Order user={userSelector!} key={order.id} orderData={order} updateState={updateOrderState} assignOrder={assignOrderToCourier} couriersData={couriers} />
        })
      }</div>
    </div>
  );
};

export default Orders;
