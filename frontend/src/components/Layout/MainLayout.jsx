import { Layout, Menu, Button, Dropdown, Avatar } from 'antd';
import { 
  HomeOutlined, 
  ProjectOutlined, 
  UserOutlined, 
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined 
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Header, Content, Footer } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    ...(isAuthenticated
      ? [
          {
            key: '/dashboard',
            icon: <ProjectOutlined />,
            label: <Link to="/dashboard">Dashboard</Link>,
          },
        ]
      : []),
  ];

  const userMenuItems = isAuthenticated
    ? [
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: user?.username || 'User',
          disabled: true,
        },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Logout',
          onClick: handleLogout,
        },
      ]
    : [
        {
          key: 'login',
          icon: <LoginOutlined />,
          label: <Link to="/login">Login</Link>,
        },
        {
          key: 'register',
          icon: <UserAddOutlined />,
          label: <Link to="/register">Register</Link>,
        },
      ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 50px',
        background: '#001529'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            color: 'white', 
            fontSize: '20px', 
            fontWeight: 'bold',
            marginRight: '50px'
          }}>
            📊 Project Tracker
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ flex: 1, minWidth: 0, background: 'transparent' }}
          />
        </div>
        
        <div>
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar 
                style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button 
                type="default" 
                icon={<LoginOutlined />}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                type="primary" 
                icon={<UserAddOutlined />}
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </Header>

      <Content style={{ padding: '0 50px', marginTop: '20px' }}>
        <div style={{ 
          background: '#fff', 
          padding: 24, 
          minHeight: 380,
          borderRadius: '8px'
        }}>
          {children}
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Project Tracker ©{new Date().getFullYear()} - Lokesh Bhaskar
      </Footer>
    </Layout>
  );
};

export default MainLayout;