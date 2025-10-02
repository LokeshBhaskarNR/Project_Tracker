import { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Modal, 
  Form, 
  Input, 
  Empty,
  Spin,
  Popconfirm,
  message
} from 'antd';
import { 
  PlusOutlined, 
  ProjectOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      message.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    form.setFieldsValue({
      name: project.name,
      description: project.description
    });
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingProject) {
        await projectsAPI.update(editingProject.id, values);
        message.success('Project updated successfully!');
      } else {
        await projectsAPI.create(values);
        message.success('Project created successfully!');
      }
      
      setModalVisible(false);
      form.resetFields();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      message.error('Failed to save project');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await projectsAPI.delete(id);
      message.success('Project deleted successfully!');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      message.error('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Loading projects..." />
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            <ProjectOutlined /> My Projects
          </Title>
          <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
            Manage and organize all your projects in one place
          </Paragraph>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleCreateProject}
        >
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No projects yet"
          style={{ marginTop: '60px' }}
        >
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreateProject}
          >
            Create Your First Project
          </Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {projects.map((project) => (
            <Col xs={24} sm={12} lg={8} key={project.id}>
              <Card
                hoverable
                actions={[
                  <EyeOutlined 
                    key="view" 
                    onClick={() => navigate(`/projects/${project.id}`)}
                  />,
                  <EditOutlined 
                    key="edit" 
                    onClick={() => handleEditProject(project)}
                  />,
                  <Popconfirm
                    key="delete"
                    title="Delete Project"
                    description="Are you sure you want to delete this project?"
                    onConfirm={() => handleDeleteProject(project.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteOutlined />
                  </Popconfirm>
                ]}
              >
                <Card.Meta
                  title={
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      marginBottom: '8px'
                    }}>
                      {project.name}
                    </div>
                  }
                  description={
                    <div>
                      <Paragraph 
                        ellipsis={{ rows: 3 }}
                        style={{ 
                          minHeight: '60px',
                          color: '#666',
                          marginBottom: '12px'
                        }}
                      >
                        {project.description || 'No description provided'}
                      </Paragraph>
                      <Text type="secondary">
                        {project.tasks?.length || 0} {project.tasks?.length === 1 ? 'task' : 'tasks'}
                      </Text>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        okText={editingProject ? 'Update' : 'Create'}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            name="name"
            label="Project Name"
            rules={[
              { required: true, message: 'Please enter project name!' },
              { max: 100, message: 'Name must be less than 100 characters!' }
            ]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { max: 500, message: 'Description must be less than 500 characters!' }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter project description (optional)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;