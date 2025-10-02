import { Button, Typography, Row, Col, Card } from 'antd';
import { 
  ProjectOutlined, 
  CheckCircleOutlined, 
  SafetyOutlined,
  RocketOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ marginBottom: '60px' }}>
        <RocketOutlined style={{ fontSize: '72px', color: '#1890ff', marginBottom: '20px' }} />
        <Title level={1}>Welcome to Project Tracker</Title>
        <Paragraph style={{ fontSize: '18px', maxWidth: '700px', margin: '20px auto' }}>
          Organize your projects and tasks efficiently. Track progress, manage deadlines, 
          and boost productivity with our intuitive project management tool.
        </Paragraph>
        
        <div style={{ marginTop: '30px' }}>
          {isAuthenticated ? (
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button 
                type="primary" 
                size="large"
                style={{ marginRight: '15px' }}
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
              <Button 
                size="large"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </div>


    </div>
  );
};

export default Home;