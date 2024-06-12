import React, { useEffect, useState } from "react";
import {
  CrownOutlined,
  DesktopOutlined,
  LogoutOutlined,
  PieChartOutlined,
  ProfileFilled,
  UserOutlined,
} from "@ant-design/icons";
import { Flex, MenuProps } from "antd";
import { Avatar, Breadcrumb, Button, Layout, List, Menu, Popover, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie } from "../utils/cookies";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../services/authServices";
import { IState, UserType } from "../reducer";
import { timeAgo } from "../utils/globalFuncs";

interface pageLayoutProps {
  children: JSX.Element;
  headerDefault?: boolean;
  data?: any;
  requireAuth?: boolean;
}


const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const getMenuItems = (type: UserType) => {
  const items: MenuItem[] = [
    getItem("Orders", "/orders", <PieChartOutlined />)
  ];

  if (type === UserType.admin) {
    items.push(getItem("Couriers", "/couriers", <DesktopOutlined />));
  }

  return items;
};

const ContentLayout = (props: pageLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userSelector = useSelector((state: IState) => state.user);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, [])


  useEffect(() => {
    async function loginCheck() {
      const token = getCookie('token')
      if (props.requireAuth && !token) {
        navigate('/login');
      }
      if (token && userSelector === undefined) {

        const verifiedState = await verifyToken(token);
        if (verifiedState.status === 200 && verifiedState.data) {
          dispatch({ type: 'setUser', payload: verifiedState.data });

          console.log(userSelector);
          setComp(props.children);
        } else
          navigate('/login');
      } else {
        setComp(props.children);
      }
    }
    loginCheck();
  }, [dispatch, navigate, currentPath,props, userSelector])

  const [comp, setComp] = useState(<Flex justify={'center'} align={'center'} style={{ height: 600 }}>LOADING</Flex>);
  return (
    <main>
      <Layout>
        <Header style={{ display: "flex", alignItems: "center" }}>
          <div className="demo-logo" style={{ fontFamily: 'Agency Fb', fontSize: '35px', color: 'white' }}>Yetis+</div>
          <div style={{ width: '-webkit-fill-available' }}>
            <Button type="primary" danger style={{ float: 'right' }} onClick={() => { setCookie('token', undefined, 1); navigate('/login'); }}><LogoutOutlined /></Button>
            <Button style={{ float: 'right', marginRight: '5px' }} ><ProfileFilled />{userSelector?.name}</Button>
          </div>
        </Header>
        <Content>
          <Breadcrumb style={{ margin: "0x 0" }}>
          </Breadcrumb>
          <Layout
            style={{
              padding: "0px 0",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: '100vh'
            }}
          >
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
            >
              <div className="demo-logo-vertical" />
              <Menu
                theme="dark"
                defaultSelectedKeys={['/' + currentPath]}
                mode="inline"
                items={getMenuItems(userSelector?.usertype!)}
                onClick={(e) => { navigate(e.key) }}
              />
            </Sider>
            <Content>
              {comp}
              <Footer style={{ textAlign: "center" }}>
                Created by Sezer YILDIRIM
              </Footer>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </main>
  );
};

export default ContentLayout;
