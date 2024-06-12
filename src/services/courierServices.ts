import { SendDelete, SendGet, SendPost, SendPut } from "../utils/request";

export const getAllCouriers = async (token: string) =>{
    return await SendGet(
        'couriers',
        token,
    );
};

export const getCourierById = async (orderId: string, token: string) =>{
    return await SendGet(
        'courier/id/'+orderId,
        token,
    );
};
export const getCourierOrders = async (id: string, token: string) =>{
    return await SendGet(
        'courier/order/'+id,
        token,
    );
};
export const deleteCourierById = async (id:string, token: string) =>{
    return await SendDelete(
        'courier/delete',{
            id
        },
        token,
    );
};