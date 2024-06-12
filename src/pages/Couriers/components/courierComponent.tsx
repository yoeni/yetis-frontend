import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Flex } from 'antd';
import { ICourier, IOrder, IUser, OrderState } from '../../../reducer';
import { DeleteFilled } from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import LiveTrack from '../../../MainComponents/LiveTrack/liveTrack';

interface CourierProps {
  courier: ICourier;
}

const CourierComponent: React.FC<CourierProps> = ({ courier }) => {

  const [isTrack, setTrack] = useState(false);
  return (
    <Card
      key={courier.id}
      style={{ marginTop: 16, overflowY: 'hidden' }}
      type="inner"
      title={courier.name}
      extra={courier.orders?.length! > 0 ? <Button type='dashed' danger={isTrack} onClick={() => setTrack(!isTrack)}> { isTrack ? 'Close Tracking' : 'Live Track!'}</Button> : <></>}
    >
      <p>Active Orders <b>{courier.orders?.length}</b> </p>
      { isTrack && 
        <LiveTrack orders={courier.orders!} mainLoc={courier.location!}/>
      }
    </Card>
  );
};

export default CourierComponent;
