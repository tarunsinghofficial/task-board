import { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useStore } from '../store/useStore';
import { TaskCard } from '../components/TaskCard';
import type { Column as ColumnType, Task, Priority } from '../types';

interface ColumnProps {
    column: ColumnType;
    tasks: Task[];
}

export const Column = ({ column, tasks }: ColumnProps) => {
    const { deleteColumn, moveTask, addTask, updateColumn } = useStore();
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [isEditingColumn, setIsEditingColumn] = useState(false);
    const [newTitle, setNewTitle] = useState(column.title);
    const ref = useRef<HTMLDivElement>(null);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'TASK',
        drop: (item: { id: string; columnId: string }, monitor) => {
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset || !ref.current) return;

            const columnRect = ref.current.getBoundingClientRect();
            const hoverClientY = clientOffset.y - columnRect.top;

            const taskElements = Array.from(ref.current.querySelectorAll('.task-card'));
            let newIndex = tasks.length;

            for (let i = 0; i < taskElements.length; i++) {
                const taskRect = taskElements[i].getBoundingClientRect();
                const taskMiddleY = (taskRect.top + taskRect.bottom) / 2;

                if (hoverClientY < taskMiddleY) {
                    newIndex = i;
                    break;
                }
            }

            moveTask(item.id, item.columnId, column.id, newIndex);

        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    drop(ref);

    const handleCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const newTask = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            creator: 'User',
            priority: formData.get('priority') as Priority,
            dueDate: formData.get('dueDate') as string,
            assignee: formData.get('assignee') as string,
            columnId: column.id,
        };

        if (newTask.title.trim()) {
            addTask(newTask);
            form.reset();
            setIsCreatingTask(false);
        }
    };

    const handleUpdateTitle = () => {
        if (newTitle.trim() && newTitle !== column.title) {
            updateColumn(column.id, { title: newTitle.trim() });
        }
        setIsEditingColumn(false);
    };

    const handleColumnDelete = () => {
        if (window.confirm('Are you sure you want to delete this column?')) {
            deleteColumn(column.id);
        }
    }

    return (
        <div
            ref={ref}
            className={`w-80 max-h-[70vh] flex-shrink-0 bg-gray-800 rounded-lg flex flex-col overflow-hidden ${isOver ? 'bg-gray-700' : ''
                }`}
        >
            <div className="p-4 flex-none">
                <div className="flex justify-between items-center">
                    {isEditingColumn ? (
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onBlur={handleUpdateTitle}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
                            className="w-[90%] h-12 bg-transparent placeholder:text-slate-400 text-white text-md border border-slate-200 rounded-md p-3 transition duration-30  0 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            autoFocus
                        />
                    ) : (
                        <h3
                            className="text-lg font-semibold text-white cursor-pointer"
                            onClick={() => setIsEditingColumn(true)}
                        >
                            {column.title}
                        </h3>
                    )}
                    <button
                        onClick={handleColumnDelete}
                        className="text-red-500 hover:text-red-700 ml-2"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto hide-scrollbar flex-1">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}

                <div className="flex-none pt-4">
                    {isCreatingTask ? (
                        <form onSubmit={handleCreateTask} className="space-y-2">
                            <input
                                name="title"
                                type="text"
                                placeholder="Task title"
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Task description"
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                rows={2}
                            />
                            <select
                                name="priority"
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800"
                                defaultValue="medium"
                            >
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>
                            <input
                                name="dueDate"
                                type="date"
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                required
                            />
                            <input
                                name="assignee"
                                type="text"
                                placeholder="Assignee"
                                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreatingTask(false)}
                                    className="px-3 py-1 text-gray-400 hover:text-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Add Task
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsCreatingTask(true)}
                            className="w-full py-2 text-sm text-gray-400 hover:text-gray-200 border border-dashed border-gray-600 rounded hover:border-gray-400"
                        >
                            + Add Task
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}; 