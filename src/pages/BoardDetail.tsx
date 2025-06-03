import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useStore } from '../store/useStore';
import { Column } from '../components/Column';
import type { Priority } from '../types'; // Import Priority type
import { MoveLeft, Plus, Trash2 } from 'lucide-react';

export const BoardDetail = () => {
    const { boardId } = useParams<{ boardId: string }>();
    const navigate = useNavigate();
    const { boards, columns, tasks, addColumn, deleteBoard } = useStore();
    const [newColumnTitle, setNewColumnTitle] = useState('');

    const [filterPriority, setFilterPriority] = useState<Priority | ''>('');
    const [filterAssignee, setFilterAssignee] = useState('');
    const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | ''>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const board = boards.find((b) => b.id === boardId);
    const boardColumns = columns
        .filter((c) => c.boardId === boardId)
        .sort((a, b) => a.order - b.order);

    if (!board) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-red-500">Board not found</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Back to Boards
                </button>
            </div>
        );
    }

    const handleCreateColumn = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newColumnTitle.trim()) return;

        addColumn({
            title: newColumnTitle.trim(),
            boardId: board.id,
            order: boardColumns.length,
        });
        setNewColumnTitle('');
    };

    const handleDeleteBoard = () => {
        if (window.confirm('Are you sure you want to delete this board?')) {
            deleteBoard(board.id);
            navigate('/');
        }
    };

    // Filter and sort tasks before passing to columns
    const filteredAndSortedTasks = tasks.filter(task => {
        // Filter by priority
        if (filterPriority && task.priority !== filterPriority) {
            return false;
        }
        // Filter by assignee (case-insensitive partial match)
        if (filterAssignee && !task.assignee.toLowerCase().includes(filterAssignee.toLowerCase())) {
            return false;
        }
        return true;
    }).sort((a, b) => {
        if (!sortBy) return 0; // No sorting

        let comparison = 0;
        if (sortBy === 'dueDate') {
            const dateA = new Date(a.dueDate).getTime();
            const dateB = new Date(b.dueDate).getTime();
            comparison = dateA - dateB;
        } else if (sortBy === 'priority') {
            const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            comparison = priorityOrder[b.priority] - priorityOrder[a.priority]; // High to Low by default
        }

        // Apply sort order
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="h-[100vh] bg-gray-900 text-white p-8">
                <div className="bg-gradient-to-br from-sky-600 to-blue-500 rounded-xl p-6 flex flex-col h-full">
                    <div className="flex-none mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-white">{board.title}</h1>
                                <p className="text-gray-300">
                                    Created: {new Date(board.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-4 py-2 border border-gray-300 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center gap-2 hover:cursor-pointer"
                                >
                                    <MoveLeft size={20} /> Back to Boards
                                </button>
                                <button
                                    onClick={handleDeleteBoard}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500
                                    flex items-center justify-center gap-2 hover:cursor-pointer"
                                >
                                    <Trash2 size={20} /> Delete Board
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-4 items-center">
                            <span className="text-gray-300">Filter by:</span>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value as Priority | '')}
                                className="px-3 py-1 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="">All Priorities</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            <input
                                type="text"
                                value={filterAssignee}
                                onChange={(e) => setFilterAssignee(e.target.value)}
                                placeholder="Filter by Assignee"
                                className="px-3 py-1 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                            />

                            <span className="text-gray-300 ml-4">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority' | '')}
                                className="px-3 py-1 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="">None</option>
                                <option value="dueDate">Due Date</option>
                                <option value="priority">Priority</option>
                            </select>
                            {sortBy && (
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                                    className="px-3 py-1 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            )}
                        </div>

                        <form onSubmit={handleCreateColumn} className="mt-4">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={newColumnTitle}
                                    onChange={(e) => setNewColumnTitle(e.target.value)}
                                    placeholder="Enter column title"
                                    className="w-[90%] h-12 bg-transparent placeholder:text-slate-400 text-white text-md border border-slate-200 rounded-md p-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                                <button
                                    type="submit"
                                    className="p-2 h-12 w-50 text-md bg-white text-blue-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2 hover:cursor-pointer"
                                >
                                    <Plus size={20} /> Add Column
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="flex-1 overflow-x-auto pb-4 hide-scrollbar">
                        <div className="flex gap-4 h-full items-start">
                            {boardColumns.map((column) => (
                                <Column
                                    key={column.id}
                                    column={column}
                                    // pass filtered and sorted tasks to columns
                                    tasks={filteredAndSortedTasks.filter((t) => t.columnId === column.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}; 