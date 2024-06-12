import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, notification } from 'antd';
import './Login.css'
import { loginWithUsername } from '../../services/authServices';
import { setCookie } from '../../utils/cookies';
//import { actionTypes } from '../../reducer';

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const openNotification = useCallback((message: string, isError?: boolean) => {
        api[isError ? 'error' : 'success']({
          message: isError ? 'Error': 'Success',
          description: message,
          placement: 'top',
          
        });
      }, [api]);

    const onFinish = async (values: any) => {
        const loginState = await loginWithUsername( values.username, values.password);
        if (loginState.status === 200 && loginState.headers && loginState.data) {
            dispatch({ type: 'setUser', payload: loginState.data });
            setCookie('token', loginState.headers['x-auth-token'], 1);
            
            navigate('/orders');
        } else 
            openNotification('There is no user!', true)
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        username?: string;
        password?: string;
        remember?: string;
    };

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
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type='link' onClick={() => navigate('/logup')}>Create account</Button>
                    <Button type="primary" htmlType="submit">
                        Sign In
                    </Button>
                    
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
