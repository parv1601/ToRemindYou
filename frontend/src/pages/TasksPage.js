// src/pages/TasksPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const API_URL = 'http://localhost:5000/api/tasks';

// Styled Components for Aesthetic Look
const TaskPageContainer = styled.div`
  padding: 20px 0;
`;

const TaskForm = styled.form`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  flex-grow: 1;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #580894;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TaskItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-size: 1rem;
`;

const TaskInfo = styled.div`
  flex-grow: 1;
`;

const DeleteButton = styled(Button)`
  background-color: #ff6b6b;
  margin-left: 10px;
  padding: 8px 12px;

  &:hover {
    background-color: #ff4757;
  }
`;

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [recurrenceDays, setRecurrenceDays] = useState(7);
  const [loading, setLoading] = useState(true);

  // --- API Functions ---

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName || !recurrenceDays) return;

    try {
      const res = await axios.post(API_URL, {
        name: taskName,
        recurrenceDays: Number(recurrenceDays),
      });
      setTasks([...tasks, res.data]); // Add new task to the list
      setTaskName('');
      setRecurrenceDays(7);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };
  
  // This function simulates manually marking a task as "done", which resets the timer.
  const handleMarkDone = async (task) => {
      try {
          // Update the task's lastSentDate to now, effectively resetting the cron timer.
          const res = await axios.put(`${API_URL}/${task._id}`, {
              lastSentDate: new Date().toISOString(),
          });
          
          // Update the local state with the returned task data
          setTasks(tasks.map(t => (t._id === task._id ? res.data : t)));
          
      } catch (err) {
          console.error('Failed to mark task as done:', err);
      }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskPageContainer>
      <h2>💖 Manage Recurring Tasks</h2>
      
      {/* Task Creation Form */}
      <TaskForm onSubmit={handleSubmit}>
        <Input 
          type="text" 
          placeholder="New Task Name (e.g., Laundry, Eyebrows)"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
        <InputGroup>
            <Input 
                type="number" 
                placeholder="Recur every (days)"
                value={recurrenceDays}
                onChange={(e) => setRecurrenceDays(e.target.value)}
                min="1"
                required
            />
            <Button type="submit" disabled={!taskName || !recurrenceDays}>
                Add Task
            </Button>
        </InputGroup>
      </TaskForm>

      {/* Task List */}
      <TaskList>
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No recurring tasks set yet! Add one above.</p>
        ) : (
          tasks.map(task => (
            <TaskItem key={task._id}>
              <TaskInfo>
                <p><strong>{task.name}</strong></p>
                <p style={{fontSize: '0.8rem', color: '#666'}}>
                    Reminds every {task.recurrenceDays} days.
                </p>
                <p style={{fontSize: '0.7rem', color: 'var(--primary-color)'}}>
                    Last Sent: {new Date(task.lastSentDate).toLocaleDateString()}
                </p>
              </TaskInfo>
              <div>
                <Button onClick={() => handleMarkDone(task)} style={{ marginRight: '10px', backgroundColor: '#4CAF50' }}>
                    Done
                </Button>
                <DeleteButton onClick={() => handleDelete(task._id)}>
                    Remove
                </DeleteButton>
              </div>
            </TaskItem>
          ))
        )}
      </TaskList>
    </TaskPageContainer>
  );
};

export default TasksPage;