import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { PlusCircle, Trash2Icon } from 'lucide-react';

export const BoardView = () => {
    const navigate = useNavigate();

    const { boards, addBoard, deleteBoard } = useStore();
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateBoard = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newBoardTitle.trim()) {
            alert('Please enter a title!');
            return;
        }

        try {
            console.log('Creating new board with title:', newBoardTitle.trim());
            addBoard({ title: newBoardTitle.trim() });
            alert(`${newBoardTitle} is created!`);
            setNewBoardTitle('');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating board:', error);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('Title changed:', e.target.value);
        setNewBoardTitle(e.target.value);
    };

    const handleBoardDelete = (boardId: string) => {
        if (window.confirm('Are you sure want to delete this board?')) {
            deleteBoard(boardId);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className='flex flex-col items-center justify-center space-y-4'>
                <h1 className="text-2xl md:text-3xl lg:text-5xl text-blue-500 font-bold">Welcome to Tasks Board</h1>
                <p className="text-gray-700 italic text-md">Get started by creating your new tasks board below!</p>
            </div>
            <div className='mt-10'>
                <div className='flex justify-between'>
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-8">Your Boards</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mb-8 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 hover:cursor-pointer"
                    >
                        <PlusCircle size={20} />
                        Create New Board
                    </button>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Board</h2>
                            <form onSubmit={handleCreateBoard} className="space-y-4">
                                <div>
                                    <label htmlFor="boardTitle" className="block text-sm font-medium text-gray-700">Board Title</label>
                                    <input
                                        type="text"
                                        id="boardTitle"
                                        value={newBoardTitle}
                                        onChange={handleTitleChange}
                                        placeholder="Enter board title"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 hover:cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer"
                                    >
                                        Create Board
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Updated At
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {boards.map((board) => (
                                <tr key={board.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => navigate(`/board/${board.id}`)}
                                            className="text-blue-600 hover:text-blue-800 font-medium hover:cursor-pointer"
                                        >
                                            {board.title}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {new Date(board.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {new Date(board.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td onClick={() => handleBoardDelete(board.id)} className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center">
                                        <Trash2Icon size={18} className='text-red-800' />
                                        <button

                                            className="text-red-600 hover:text-red-800 ml-2"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}; 