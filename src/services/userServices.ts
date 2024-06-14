import { UserType } from '../reducer';
import { SendDelete, SendGet, SendGetCustom, SendPost, SendPut } from '../utils/request';

export const registerUser = async (username: string, email: string, password: string,userType: number, name:string, location: string) => {
    return await SendPost(
        'user/signup',
        {
            username,
            email,
            password,
            userType,
            name,
            location
        },
    );
};
export const getUsersByType = async (type: UserType, token: string) => {
    return await SendGet(
        'users/type/'+type,
        token
    );
}
export const getMyIp = async () => {
    return await SendGetCustom('https://ipapi.co/json/');
}
export const getUserById = async (id: string, token: string) =>{
    return await SendGet(
        'user/id/' + id,
        token,
    );
};
export const getUserByUsername = async (username: string, token: string) =>{
    return await SendGet(
        'user/username/' + username,
        token,
    );
};

export const getAllUsers = async (token: string) =>{
    return await SendGet(
        'users',
        token,
    );
};

export const updateUserLocation = async (id: string, location: string, token: string) => {
    return await SendPut(
        'user/location',
        {
            id,
            location,
        },
        token,
    );
};
export const updateUserProfile= async (id: string, username: string, name: string, native_lang:string, token: string) => {
    return await SendPut(
        'user/profile',
        {
            id,
            username,
            name,
            native_lang
        },
        token,
    );
};
export const updateUserPassword = async (id: string, oldPassword: string, newPassword:string, token: string) => {
    return await SendPut(
        'user/updatepassword',
        {
            id: id,
            oldPassword: oldPassword,
            newPassword: newPassword,
        },
        token,
    );
};
export const deleteUser = async (id:string, token: string) => {
    return await SendDelete(
        'user/id/'+id,{},
        token,
    );
};
export const deleteUserByType = async (type: UserType, token: string) => {
    return await SendDelete(
        'user/type/'+type,{},
        token,
    );
};
