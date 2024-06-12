import { OrderState } from "../reducer";
import { SendDelete, SendGet, SendPost, SendPut } from "../utils/request";

export const generateFakeOrders = async (token: string) => {
    const generateState = await SendGet('order/create-fake-orders', token);
    if (generateState.status != 200)
        return generateState;

    return await getAllOrders(token);
}
export const getAllOrders = async (token: string) =>{
    return await SendGet(
        'orders',
        token,
    );
};

export const getOrderById = async (orderId: string, token: string) =>{
    return await SendGet(
        'order/id/'+orderId,
        token,
    );
};
export const getOrderByCourier = async (id: string, token: string) =>{
    return await SendGet(
        'order/courier/'+id,
        token,
    );
};
export const createOrder = async (content: string, orderedBy: string, location: string, token: string) =>{
    return await SendPost(
        'order/create',{
            content,
            orderedBy,
            location
        },
        token,
    );
};
export const assignOrder = async (id: string, courierId: string, token: string) =>{
    return await SendPut(
        'order/assign',{
            id,
            courierId
        },
        token,
    );
};
export const updateOrderStatus = async (id: string, state: OrderState, token: string) =>{
    return await SendPut(
        'order/status',{
            id,
            state
        },
        token,
    );
};
export const deleteOrder = async (id:string, token: string) =>{
    return await SendDelete(
        'order/delete',{
            id
        },
        token,
    );
};