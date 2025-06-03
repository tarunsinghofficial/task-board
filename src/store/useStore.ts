import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Board, Column, Task } from '../types';

interface BoardState {
    // state
    boards: Board[];
    columns: Column[];
    tasks: Task[];

    // Board actions
    addBoard: (board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>) => void;
    deleteBoard: (id: string) => void;

    // Column actions
    addColumn: (column: Omit<Column, 'id'>) => void;
    updateColumn: (id: string, column: Partial<Column>) => void;
    deleteColumn: (id: string) => void;
    reorderColumns: (columns: Column[]) => void;

    // Task actions
    addTask: (task: Omit<Task, 'id'>) => void;
    updateTask: (id: string, task: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    moveTask: (taskId: string, sourceColumnId: string, targetColumnId: string, newIndex: number) => void;
}

const initialState = {
    boards: [],
    columns: [],
    tasks: [],
};

export const useStore = create<BoardState>()(
    persist(
        (set) => {
            return {
                ...initialState,

                // Board actions
                addBoard: (board) => {
                    const newBoard = {
                        ...board,
                        id: crypto.randomUUID(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };
                    set((state) => {
                        const newState = {
                            boards: [...state.boards, newBoard],
                        };
                        console.log('Store: New state:', newState);
                        return newState;
                    });
                },


                deleteBoard: (id) => set((state) => ({
                    boards: state.boards.filter((b) => b.id !== id),
                    columns: state.columns.filter((c) => c.boardId !== id),
                    tasks: state.tasks.filter((t) =>
                        state.columns.find((c) => c.id === t.columnId)?.boardId !== id
                    ),
                })),

                // Column actions
                addColumn: (column) => {
                    const newColumn = {
                        ...column,
                        id: crypto.randomUUID(),
                    };
                    console.log('new column:', newColumn);
                    set((state) => {
                        const newState = {
                            columns: [...state.columns, newColumn],
                        };
                        return newState;
                    });
                },

                updateColumn: (id, column) => set((state) => ({
                    columns: state.columns.map((c) =>
                        c.id === id ? { ...c, ...column } : c
                    ),
                })),

                deleteColumn: (id) => set((state) => ({
                    columns: state.columns.filter((c) => c.id !== id),
                    tasks: state.tasks.filter((t) => t.columnId !== id),
                })),

                reorderColumns: (columns) => set(() => ({
                    columns,
                })),

                // Task actions
                addTask: (task) => {
                    const newTask = {
                        ...task,
                        id: crypto.randomUUID(),
                    };
                    console.log('new task:', newTask);
                    set((state) => {
                        const newState = {
                            tasks: [...state.tasks, newTask],
                        };
                        return newState;
                    });
                },

                updateTask: (id, task) => set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t.id === id ? { ...t, ...task } : t
                    ),
                })),

                deleteTask: (id) => set((state) => ({
                    tasks: state.tasks.filter((t) => t.id !== id),
                })),

                moveTask: (taskId, _sourceColumnId, targetColumnId, newIndex) => set((state) => {
                    const task = state.tasks.find((t) => t.id === taskId);
                    if (!task) return state;

                    // Filter out the task being moved
                    const updatedTasks = state.tasks.filter((t) => t.id !== taskId);

                    // Get tasks for the target column
                    const targetTasks = updatedTasks.filter((t) => t.columnId === targetColumnId);

                    // Insert the moved task at the new index
                    targetTasks.splice(newIndex, 0, { ...task, columnId: targetColumnId });

                    // Combine tasks back, ensuring tasks in other columns are included
                    return {
                        tasks: [
                            ...updatedTasks.filter((t) => t.columnId !== targetColumnId),
                            ...targetTasks,
                        ],
                    };
                }),
            };
        },
        {
            name: 'task-board-storage'
        }
    )
);