# Task Board Application

## Description

A simple task board application built with React and TypeScript like a Trello. This application allows users to create boards, add columns to boards, and add tasks to columns. Tasks can be moved and reordered using drag-and-drop, and filtered/sorted.

## Features

- **Board View:**
  - Create new boards.
  - View a list of all boards.
  - Navigate to a detailed view of a board.
  - Delete boards.
- **Board Detail Page:**
  - View columns within a board.
  - Add new columns.
  - Delete columns.
  - Add tasks within columns.
  - Edit task details (title, description, priority, due date, assignee).
  - Delete tasks.
  - Drag and drop tasks to move them between columns.
  - Drag and drop tasks to reorder them within the same column.
  - Filter tasks by priority and assignee.
  - Sort tasks by due date or priority.
- **State Management:** Data is managed using Zustand and persisted in Local Storage.

## Technologies Used

- React
- TypeScript
- Zustand (for state management)
- React DnD (for drag and drop)
- React Router (for navigation)
- Tailwind CSS (for styling)
- Vite (for development and building)

## Setup and Running the Project

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd task-board
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Start the development server:**

    ```bash
    npm run dev
    # or yarn dev
    ```

    The application will open in your browser, usually at `http://localhost:5173/`.

## Project Structure

```
src/
├── components/       # Reusable UI components (e.g., Column, TaskCard)
├── pages/            # Top-level components representing pages (BoardView, BoardDetail)
├── store/            # Zustand store definition
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component and routing
├── main.tsx          # Entry point
├── ...other files
```

## Screenshots

**1. Board View Page**
![image](https://github.com/user-attachments/assets/3f900b3b-9aa3-4e1c-b835-d9967e9495d0)

**2. Board Detail Page**
![image](https://github.com/user-attachments/assets/04720705-01ef-45f2-a7ad-700f78213df5)
