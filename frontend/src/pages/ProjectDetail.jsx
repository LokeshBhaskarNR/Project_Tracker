import { useState, useEffect } from 'react';
import { 
  Button, 
  Typography, 
  Modal, 
  Form, 
  Input, 
  Select,
  Row,
  Col,
  Empty,
  Spin,
  Breadcrumb,
  message
} from 'antd';
import { 
  PlusOutlined, 
  ArrowLeftOutlined,
  HomeOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../services/api';
import TaskCard from '../components/TaskCard';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        projectsAPI.getOne(id),
        tasksAPI.getAll(id),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    form.resetFields();
    form.setFieldsValue({ status: 'TODO' });
    setModalVisible(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      title: task.title,
      description: task.description,
      status: task.status
    });
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingTask) {
        await tasksAPI.update(id, editingTask.id, values);
        message.success('Task updated successfully!');
      } else {
        await tasksAPI.create(id, values);
        message.success('Task created successfully!');
      }
      
      setModalVisible(false);
      form.resetFields();
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksAPI.delete(id, taskId);
      message.success('Task deleted successfully!');
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Loading project..." />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '20px' }}>
        <Breadcrumb.Item>
          <HomeOutlined onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <ProjectOutlined /> Projects
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{project?.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Button 
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/dashboard')}
        style={{ marginBottom: '20px' }}
      >
        Back to Dashboard
      </Button>

      <div style={{ 
        background: '#f0f2f5', 
        padding: '24px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <Title level={2} style={{ margin: 0 }}>
          {project?.name}
        </Title>
        <Paragraph style={{ margin: '12px 0 0 0', fontSize: '16px' }}>
          {project?.description || 'No description provided'}
        </Paragraph>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <Title level={3} style={{ margin: 0 }}>Tasks</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreateTask}
        >
          Add Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No tasks yet"
          style={{ marginTop: '40px' }}
        >
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreateTask}
          >
            Create Your First Task
          </Button>
        </Empty>
      ) : (
        <Row gutter={16}>
          {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
            <Col xs={24} md={8} key={status}>
              <div style={{ 
                background: '#fafafa', 
                padding: '16px', 
                borderRadius: '8px',
                minHeight: '400px'
              }}>
                <Title level={5} style={{ marginBottom: '16px' }}>
                  {status === 'TODO' && '📋 To Do'}
                  {status === 'IN_PROGRESS' && '🔄 In Progress'}
                  {status === 'DONE' && '✅ Done'}
                  <span style={{ 
                    marginLeft: '8px', 
                    fontSize: '14px', 
                    fontWeight: 'normal',
                    color: '#999'
                  }}>
                    ({getTasksByStatus(status).length})
                  </span>
                </Title>
                
                {getTasksByStatus(status).length === 0 ? (
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No tasks"
                  />
                ) : (
                  <div>
                    {getTasksByStatus(status).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        okText={editingTask ? 'Update' : 'Create'}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            name="title"
            label="Task Title"
            rules={[
              { required: true, message: 'Please enter task title!' },
              { max: 200, message: 'Title must be less than 200 characters!' }
            ]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { max: 1000, message: 'Description must be less than 1000 characters!' }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter task description (optional)"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[
              { required: true, message: 'Please select status!' }
            ]}
          >
            <Select>
              <Select.Option value="TODO">To Do</Select.Option>
              <Select.Option value="IN_PROGRESS">In Progress</Select.Option>
              <Select.Option value="DONE">Done</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectDetail;