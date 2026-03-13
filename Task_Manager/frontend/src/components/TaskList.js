import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import TaskForm from './TaskForm';
import './TaskList.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await taskService.getTasks();
            setTasks(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch tasks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            const response = await taskService.createTask(taskData);
            setTasks([response.data, ...tasks]);
            setShowForm(false);
        } catch (err) {
            setError('Failed to create task');
        }
    };

    const handleUpdateTask = async (id, taskData) => {
        try {
            const response = await taskService.updateTask(id, taskData);
            setTasks(tasks.map(task => task._id === id ? response.data : task));
            setEditingTask(null);
        } catch (err) {
            setError('Failed to update task');
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(id);
                setTasks(tasks.filter(task => task._id !== id));
            } catch (err) {
                setError('Failed to delete task');
            }
        }
    };

    const toggleComplete = async (task) => {
        await handleUpdateTask(task._id, { ...task, completed: !task.completed });
    };

    const getPriorityClass = (priority) => {
        return `priority-${priority}`;
    };

    if (loading) return <div className="loading">Loading tasks...</div>;

    return (
        <div className="task-list-container">
            <div className="header">
                <h1>Task Manager</h1>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Add New Task'}
                </button>
            </div>

            {error && <div className="error">{error}</div>}

            {showForm && (
                <TaskForm
                    onSubmit={handleCreateTask}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {editingTask && (
                <TaskForm
                    task={editingTask}
                    onSubmit={(data) => handleUpdateTask(editingTask._id, data)}
                    onCancel={() => setEditingTask(null)}
                />
            )}

            <div className="tasks">
                {tasks.length === 0 ? (
                    <p className="no-tasks">No tasks yet. Create your first task!</p>
                ) : (
                    tasks.map(task => (
                        <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                            <div className="task-content">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleComplete(task)}
                                    className="task-checkbox"
                                />
                                <div className="task-details">
                                    <h3 className="task-title">{task.title}</h3>
                                    {task.description && (
                                        <p className="task-description">{task.description}</p>
                                    )}
                                    <div className="task-meta">
                                        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                        {task.dueDate && (
                                            <span className="due-date">
                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="task-actions">
                                <button 
                                    className="btn btn-edit"
                                    onClick={() => setEditingTask(task)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="btn btn-delete"
                                    onClick={() => handleDeleteTask(task._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskList;