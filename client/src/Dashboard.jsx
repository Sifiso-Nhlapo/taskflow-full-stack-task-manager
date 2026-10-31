
import { useCallback, useEffect, useState } from 'react';
import './Dashboard.css';
import API_BASE_URL from './api';

function Dashboard({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFilter, setTaskFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
   });
   const filteredTasks = tasks.filter((task) => {
  if (taskFilter === 'pending') {
    return task.status !== 'completed';
  }

  if (taskFilter === 'completed') {
    return task.status === 'completed';
  }

  return true;
});

const isTaskOverdue = (task) => {
  if (!task.dueDate || task.status === 'completed') {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(task.dueDate);

  const localDueDate = new Date(
    dueDate.getUTCFullYear(),
    dueDate.getUTCMonth(),
    dueDate.getUTCDate()
  );

  return localDueDate < today;
};



const fetchTasks = useCallback(async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not load tasks.');
    }

    setError('');
    setTasks(Array.isArray(data) ? data : data.tasks || []);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [token]);

useEffect(() => {
  Promise.resolve().then(() => {
    fetchTasks();
  });
}, [fetchTasks]);

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const handleCreateTask = async (e) => {
  e.preventDefault();

  setSaving(true);
  setError('');

  try {
    const taskData = {
      ...formData,
      dueDate: formData.dueDate || null,
    };

    const isEditing = Boolean(editingTask);

    const url = isEditing
      ? `${API_BASE_URL}/api/tasks/${editingTask._id}`
      : `${API_BASE_URL}/api/tasks`;

    const response = await fetch(url, {
      method: isEditing ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'Could not save task.'
      );
    }

    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
    });

    setEditingTask(null);
    setShowForm(false);

    await fetchTasks();
  } catch (err) {
    setError(err.message);
  } finally {
    setSaving(false);
  }
};
  const handleToggleComplete = async (task) => {
  const newStatus =
    task.status === 'completed' ? 'pending' : 'completed';

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tasks/${task._id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not update task.');
    }

    await fetchTasks();
  } catch (err) {
    setError(err.message);
  }
};
const handleEditTask = (task) => {
  setEditingTask(task);
  setFormData({
    title: task.title || '',
    description: task.description || '',
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().split('T')[0]
      : '',
    priority: task.priority || 'medium',
  });

  setShowForm(true);
};
const handleDeleteTask = async (taskId) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this task? This action cannot be undone.'
  );

  if (!confirmed) {
    return;
  }

  try {
    setError('');

    const response = await fetch(
      `${API_BASE_URL}/api/tasks/${taskId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not delete task.');
    }

    await fetchTasks();
  } catch (err) {
    setError(err.message);
  }
};

  const completedTasks = tasks.filter(
    (task) => task.status === 'completed'
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === 'pending'
  ).length;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="dashboard-brand">
          <div className="brand-icon">T</div>
          <span>TaskFlow</span>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-heading">WORKSPACE</p>
          <a href="#overview" className="nav-link active">▦ Overview</a>
          <a href="#tasks" className="nav-link">✓ My Tasks</a>
        </nav>

        <button className="logout-button" onClick={onLogout}>
          ↪ Log out
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-date">YOUR PERSONAL WORKSPACE</p>
            <h1>Dashboard</h1>
            <p className="dashboard-subtitle">
              Stay organised and make progress every day.
            </p>
          </div>
          <div className="profile-avatar">U</div>
        </header>

        <section className="welcome-banner">
          <div>
            <p>WELCOME BACK!</p>
            <h2>Let's get things done.</h2>
            <span>Your goals are waiting. Make today count.</span>
          </div>
          <div className="welcome-symbol">✦</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <p>Total tasks</p>
            <h2>{tasks.length}</h2>
            <span>All your tasks</span>
          </div>

          <div className="stat-card">
            <p>Pending tasks</p>
            <h2>{pendingTasks}</h2>
            <span>Still to be completed</span>
          </div>

          <div className="stat-card">
            <p>Completed tasks</p>
            <h2>{completedTasks}</h2>
            <span>Great work!</span>
          </div>
        </section>

        <section className="tasks-section" id="tasks">
          {showForm && (
            <form className="task-form" onSubmit={handleCreateTask}>
              <h2>{editingTask ? 'Edit task' : 'Create a new task'}</h2>

              <div className="task-form-group">
                <label htmlFor="title">Task title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="What do you need to do?"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={120}
                  required
                />
              </div>

              <div className="task-form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Add some details about your task..."
                  value={formData.description}
                  onChange={handleChange}
                 rows={3}
                />
              </div>

              <div className="task-form-row">
                <div className="task-form-group">
                  <label htmlFor="dueDate">Due date</label>
                  <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="task-form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="task-form-actions">
                <button
                  type="submit"
                  className="save-task-button"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingTask
                      ? 'Save Changes'
                      : 'Save Task'}
                </button>

                <button
                  type="button"
                  className="cancel-task-button"
                  disabled={saving}
                  onClick={() => {
                    setFormData({
                      title: '',
                      description: '',
                      dueDate: '',
                      priority: 'medium'
                    });
                    setEditingTask(null);
                    setShowForm(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        
          <div className="section-heading">
            <div className="task-filters">
              <button
                className={taskFilter === 'all' ? 'active-filter' : ''}
                onClick={() => setTaskFilter('all')}
              >
                All Tasks
              </button>

              <button
                className={taskFilter === 'pending' ? 'active-filter' : ''}
                onClick={() => setTaskFilter('pending')}
              >
                Pending
              </button>

              <button
                className={taskFilter === 'completed' ? 'active-filter' : ''}
                onClick={() => setTaskFilter('completed')}
              >
                Completed
              </button>
            </div>
            <div>
              <h2>My Tasks</h2>
              <p>Keep track of everything you need to do.</p>
            </div>
            <button
              type="button"
              className="add-task-button"
              onClick={() => {
                setShowForm((previous) => !previous);
              }}
            >
              {showForm ? 'Cancel' : '+ Add Task'}
            </button>
          </div>

          {loading && <p className="task-message">Loading your tasks...</p>}

          {error && <p className="task-error">{error}</p>}

          {!loading && !error && tasks.length === 0 && (
            <div className="empty-state">
              <div>✓</div>
              <h3>No tasks yet</h3>
              <p>Your tasks will appear here when you create them.</p>
            </div>
          )}

          {!loading && !error && tasks.length > 0 && (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <article className="task-card" key={task._id}>
                  <div className="task-card-content">
                    <label className="complete-task">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => handleToggleComplete(task)}
                      />

                      <div>
                        <h3 className={task.status === 'completed' ? 'completed-title' : ''}>
                          {task.title}
                        </h3>
                        <p>{task.description || 'No description provided.'}</p>
                        {task.dueDate && (
                          <p className="task-due-date">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                        
                        {isTaskOverdue(task) && (
                          <span className="overdue-badge">
                            Overdue
                          </span>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="task-actions">
                    <div className="task-labels">
                      <span className={`priority-label ${task.priority}`}>
                        {task.priority}
                      </span>

                      <span className="status-label">{task.status}</span>
                    </div>

                    <button
                      type="button"
                      className="edit-task-button"
                      onClick={() => handleEditTask(task)}
                    >
                      Edit Task
                    </button>
                    <button
                      type="button"
                      className="delete-task-button"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
