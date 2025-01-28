import React from 'react';
import { useNotebookState } from './NotebookSidebar';
import styles from './NotebookTimeline.module.scss';
import { v4 as uuidv4 } from 'uuid';
import Editor from "@monaco-editor/react";

export const NotebookTimeline: React.FC = () => {
    const notebookState = useNotebookState();
    const currentNotebook = notebookState.currentNotebook;

    const handleAddCell = (type: 'code' | 'text', index: number) => {
        const newCell = {
            id: uuidv4(),
            type,
            content: '',
            isEditing: true
        };
        
        if (currentNotebook) {
            const updatedCells = [...currentNotebook.cells];
            updatedCells.splice(index + 1, 0, newCell);
            notebookState.updateNotebook({
                ...currentNotebook,
                cells: updatedCells
            });
        }
    };

    const handleDeleteCell = (index: number) => {
        if (window.confirm('Are you sure you want to delete this cell?')) {
            const updatedCells = currentNotebook.cells.filter((_, i) => i !== index);
            notebookState.updateNotebook({
                ...currentNotebook,
                cells: updatedCells
            });
        }
    };

    const handleRunCell = (cell: any) => {
        const output = {
            id: cell.id,
            type: cell.type,
            content: cell.content,
            timestamp: new Date().toISOString()
        };
        notebookState.updateOutput([output]);
    };

    const handleRunInNewTab = (cell: any) => {
        const output = {
            id: cell.id,
            type: cell.type,
            content: cell.content,
            timestamp: new Date().toISOString(),
            inNewTab: true
        };
        notebookState.runInNewTab(output);
    };    

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, cellId: string) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
        
        const updatedCells = currentNotebook.cells.map(c => 
            c.id === cellId ? {...c, content: e.target.value} : c
        );
        notebookState.updateNotebook({
            ...currentNotebook,
            cells: updatedCells
        });
    };    
    
    return (
        <div className={styles.timeline}>
            <div className={styles.timelineHeader}>
                <h3>Notebook Timeline</h3>
            </div>
            <div className={styles.timelineContent}>
                {currentNotebook?.cells.map((cell, index) => (
                    <div key={cell.id} className={styles.cellContainer}>
                        <div className={styles.cellHeader}>
                            Cell #{index + 1} - {cell.type}
                        </div>
                        {cell.type === 'code' ? (
                            //TODO: fix the scroll issue with the editor
                            <Editor
                                height={`${Math.max(200, (cell.content.split('\n').length) * 20)}px`}
                                defaultLanguage="javascript"
                                value={cell.content}
                                onChange={(value) => {
                                    const updatedCells = currentNotebook.cells.map(c => 
                                        c.id === cell.id ? {...c, content: value || ''} : c
                                    );
                                    notebookState.updateNotebook({
                                        ...currentNotebook,
                                        cells: updatedCells
                                    });
                                }}
                                options={{
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    fontSize: 12,
                                    automaticLayout: true,
                                    wordWrap: 'on',
                                    lineNumbers: 'on',
                                    folding: true
                                }}
                            />
                        ) : (
                            <textarea 
                                className={styles.cellInput}
                                value={cell.content}
                                placeholder={`Enter your ${cell.type} here...`}
                                onChange={(e) => handleTextareaChange(e, cell.id)}
                            />
                        )}
                        <div className={styles.actionButtons}>
                            <button 
                                className={styles.actionButton}
                                onClick={() => handleAddCell('code', index)}
                            >
                                + Code
                            </button>
                            <button 
                                className={styles.actionButton}
                                onClick={() => handleAddCell('text', index)}
                            >
                                + Text
                            </button>
                            <button 
                                className={styles.actionButton}
                                onClick={() => handleRunCell(cell)}
                            >
                                ▶ Run
                            </button>
                            <button 
                                className={styles.actionButton}
                                onClick={() => handleRunInNewTab(cell)}
                            >
                                ▶ Run in Tab
                            </button>
                            <button 
                                className={styles.actionButton}
                                onClick={() => handleDeleteCell(index)}
                            >
                                ✕ Delete
                            </button>
                        </div>
                    </div>
                ))}
                {currentNotebook?.cells.length === 0 && (
                    <div className={styles.actionButtons}>
                        <button 
                            className={styles.actionButton}
                            onClick={() => handleAddCell('code', -1)}
                        >
                            + Code
                        </button>
                        <button 
                            className={styles.actionButton}
                            onClick={() => handleAddCell('text', -1)}
                        >
                            + Text
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
