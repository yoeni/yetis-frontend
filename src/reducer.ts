import { LatLng } from "leaflet";

export enum OrderState {
    pending,
    preparing,
    onRoad,
    cancelled,
    delivered
}
export enum UserType {
    admin,
    courier,
    customer
}
export interface IUser {
    id: string;
    name: string;
    username: string;
    email: string;
    last_login: string;
    location: string;
    usertype: UserType;
}
export interface ICourier {
    id: string;
    name: string;
    location?: string;
    orders?: IOrder[];
}
export interface ICustomer {
    id: string;
    name: string;
}
export interface IOrder {
    id: string;
    content: string;
    created_at: string
    customer: ICustomer;
    courier: ICourier;
    location: string;
    status: OrderState;
}



export interface IState {
    user: IUser | undefined;
    location: LatLng | undefined;
}
const initalState: IState ={
    user: undefined,
    location: undefined,
}
export const Reducer = (state = initalState, action: any): IState => {
    switch (action.type) {
        case 'setUser':
            return { ...state, user: action.payload };
        case 'setLocation':
            return { ...state, location: action.payload };
        default:
            return state;
    }
};

