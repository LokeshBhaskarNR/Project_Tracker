import { Card, Tag, Space, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO':
        return 'default';
      case 'IN_PROGRESS':
        return 'processing';
      case 'DONE':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'DONE') {
      return <CheckCircleOutlined />;
    }
    return null;
  };

  return (
    <Card
      size="small"
      hoverable
      style={{ marginBottom: '12px' }}
      className={`status-${task.status.toLowerCase().replace('_', '-')}`}
    >
      <div style={{ marginBottom: '8px' }}>
        <strong style={{ fontSize: '14px' }}>{task.title}</strong>
      </div>
      
      {task.description && (
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          marginBottom: '8px',
          minHeight: '36px'
        }}>
          {task.description}
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '12px'
      }}>
        <Tag 
          color={getStatusColor(task.status)} 
          icon={getStatusIcon(task.status)}
        >
          {task.status.replace('_', ' ')}
        </Tag>
        
        <Space size="small">
          <Tooltip title="Edit Task">
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => onEdit(task)}
            />
          </Tooltip>
          <Tooltip title="Delete Task">
            <Button 
              type="text" 
              size="small" 
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(task.id)}
            />
          </Tooltip>
        </Space>
      </div>
    </Card>
  );
};

export default TaskCard;