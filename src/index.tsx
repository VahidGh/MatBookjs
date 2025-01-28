import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { NotebookSidebar, NotebookStateContext } from './components/NotebookSidebar/NotebookSidebar';
import { INotebook, CellType } from './components/NotebookSidebar/types';
import { v4 as uuidv4 } from 'uuid';

const createInitialNotebook = () => ({
    id: uuidv4(),
    title: 'New Notebook',
    content: '',
    author: 'User',
    lastModified: new Date().toISOString(),
    cells: []
});

const App = () => {
    const loadSavedState = () => {
        const savedNotebook = localStorage.getItem('currentNotebook');
        return savedNotebook ? JSON.parse(savedNotebook) : createInitialNotebook();
    };
    
    const [currentNotebook, setCurrentNotebook] = useState<INotebook>(loadSavedState());
    const [notebooks, setNotebooks] = useState<INotebook[]>([]);
    const [output, setOutput] = useState<any[]>([]);

    useEffect(() => {
        localStorage.setItem('currentNotebook', JSON.stringify(currentNotebook));
    }, [currentNotebook]);

    const runInNewTab = (cell: any) => {
        // This will be handled by NotebookContent component
        const tabOutput = {
            id: cell.id,
            type: cell.type,
            content: cell.content,
            output: cell.type === 'code' ? `Output of: ${cell.content}` : cell.content,
            inNewTab: true
        };
        setOutput([tabOutput]);
    };

    const updateOutput = (newOutput: any[]) => {
        setOutput(newOutput);
    };

    const updateNotebook = (notebook: INotebook) => {
        setCurrentNotebook(notebook);
        setNotebooks(notebooks.map(n => n.id === notebook.id ? notebook : n));
    };
    
    const addCell = (type: CellType) => {
        if (currentNotebook) {
            const newCell = {
                id: uuidv4(),
                type,
                content: ''
            };
            
            const updatedNotebook = {
                ...currentNotebook,
                cells: [...currentNotebook.cells, newCell]
            };
            
            setCurrentNotebook(updatedNotebook);
        }
    };

    const notebookState = {
        notebooks,
        currentNotebook,
        output,
        loadNotebook: (id: string) => {},
        createNewNotebook: () => {},
        saveNotebook: (notebook: INotebook) => {},
        addCell: (type: CellType) => {},
        updateNotebook,
        updateOutput,
        runInNewTab
    };

    return (
        <NotebookStateContext.Provider value={notebookState}>
            <NotebookSidebar />
        </NotebookStateContext.Provider>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);