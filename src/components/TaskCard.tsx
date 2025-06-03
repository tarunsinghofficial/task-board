import { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { useStore } from '../store/useStore';
import type { Task } from '../types';

interface TaskCardProps {
    task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
    const { updateTask, deleteTask } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(task);
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'TASK',
        item: { id: task.id, columnId: task.columnId },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    drag(ref);

    const handleUpdateTask = () => {
        updateTask(task.id, editedTask);
        setIsEditing(false);
    };

    const handleTaskDelete = () => {
        if (window.confirm('Are you sure want to delete this task?')) {
            deleteTask(task.id);
        }
    }

    const priorityColors = {
        high: 'bg-red-100 text-red-800',
        medium: 'bg-yellow-100 text-yellow-800',
        low: 'bg-green-100 text-green-800',
    };

    return (
        <div
            ref={ref}
            className={`bg-white text-black rounded-lg shadow p-4 cursor-move ${isDragging ? 'opacity-50' : ''
                }`}
        >
            {isEditing ? (
                <div className="space-y-2 ">
                    <input
                        type="text"
                        value={editedTask.title}
                        onChange={(e) =>
                            setEditedTask({ ...editedTask, title: e.target.value })
                        }
                        className="w-full px-2 py-1  border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Task title"
                    />
                    <textarea
                        value={editedTask.description}
                        onChange={(e) =>
                            setEditedTask({ ...editedTask, description: e.target.value })
                        }
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Task description"
                        rows={3}
                    />
                    <select
                        value={editedTask.priority}
                        onChange={(e) =>
                            setEditedTask({
                                ...editedTask,
                                priority: e.target.value as Task['priority'],
                            })
                        }
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                    </select>
                    <input
                        type="date"
                        value={editedTask.dueDate}
                        onChange={(e) =>
                            setEditedTask({ ...editedTask, dueDate: e.target.value })
                        }
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        value={editedTask.assignee}
                        onChange={(e) =>
                            setEditedTask({ ...editedTask, assignee: e.target.value })
                        }
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Assignee"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdateTask}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <h4 className="font-medium">{task.title}</h4>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleTaskDelete}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="flex flex-wrap gap-2">
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}
                        >
                            {task.priority} Priority
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500">
                        Assigned to: {task.assignee}
                    </div>
                    <div className="text-sm text-gray-500">
                        Created by: {task.creator}
                    </div>
                </div>
            )}
        </div>
    );
}; 