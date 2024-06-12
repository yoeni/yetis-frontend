import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Dropdown, Flex, Space, Tag } from 'antd';
import { ICourier, IOrder, IUser, OrderState, UserType } from '../../../reducer';
import { DeleteFilled, DownOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import { getCookie } from '../../../utils/cookies';
import { getOrderById } from '../../../services/orderServices';

interface OrderProps {
  user: IUser;
  couriersData: ICourier[];
  orderData: IOrder;
  updateState: (orderId: string, state: OrderState) => Promise<void>
  assignOrder: (orderId: string, courierId: string) => Promise<void>
}

const Order: React.FC<OrderProps> = ({ user, couriersData, orderData, updateState, assignOrder }) => {
  const [order, setOrder] = useState<IOrder>(orderData);
  const [couriers, setCouriers] = useState<ICourier[]>(couriersData);

  useEffect(() => {
    setCouriers(couriersData);
  }, [couriersData])

  const refreshOrder = async () => {
    const token = getCookie('token');
    if (token) {
      const newOrderData = await getOrderById(order.id, token);
      if (newOrderData.status == 200) {
        setOrder(newOrderData.data[0]);

      }
    }
  };
    const getOrderActionBtns = useCallback(() => {
      if (order.status == OrderState.preparing) {
        if (user.usertype == UserType.admin)
          return (<Dropdown menu={{
            items: couriers.map(courier => {
              return {
                label: courier.name,
                key: courier.id,
                icon: <UserOutlined />
              }
            }),
            onClick: async (e: any) => { await assignOrder(order.id, e.key); await refreshOrder(); },
          }}>
            <Button>
              <Space>
                Assign
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>)
        return (<Button type='primary' onClick={() => updateOrder(OrderState.onRoad)}>Take It!</Button>);
      }

      if (order.status == OrderState.onRoad) {
        return (<Flex gap={5}>
          <Tag color="blue">{order.courier.name}</Tag>
          <Button type='primary' onClick={() => updateOrder(OrderState.delivered)}>Delivered!</Button>
          <Button type='primary' danger onClick={() => updateOrder(OrderState.cancelled)}>Canceled!</Button>
        </Flex>);
      }
      if (order.status == OrderState.delivered) {
        return (<Flex gap={5}>
          DELIVERED BY <Tag color="blue">{order.courier.name}</Tag>
        </Flex>);
      }
      if (order.status == OrderState.cancelled) {
        return (<Flex gap={5}>
          CANCELLED!
        </Flex>);
      }
      return <>Pending</>;
    }, [order, couriers]);


    const [actions, setActions] = useState<JSX.Element>(getOrderActionBtns());

    const updateOrder = async (state: OrderState) => {
      await updateState(order.id, state)
      await refreshOrder();
    }

    useEffect(() => {
      setActions(getOrderActionBtns());
    }, [order, couriers]);

    return (
      <Card
        key={order.id}
        style={{ marginTop: 16 }}
        type="inner"
        title={order.content}
        extra={<p>{new Date(order.created_at).toLocaleString()} | {order.customer.name} </p>}
      >
        {
          actions
        }
      </Card>
    );
  };

  export default Order;
