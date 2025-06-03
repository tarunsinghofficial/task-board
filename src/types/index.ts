export interface Board {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface Column {
    id: string;
    title: string;
    boardId: string;
    order: number;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    creator: string;
    priority: Priority; // union type for priority
    dueDate: string;
    assignee: string;
    columnId: string;
}

export type Priority = 'high' | 'medium' | 'low'; // one of several types 
