import React, { createContext, useContext, useState } from 'react';
import clsx from 'clsx';
import { INotebookState } from './types';
import { NotebookTimeline } from './NotebookTimeline';
import { NotebookContent } from './NotebookContent';
import styles from './NotebookSidebar.module.scss';
import Split from 'react-split';

export const NotebookSidebar = () => {
    const notebookState = useNotebookState();
    const [activeNotebook, setActiveNotebook] = useState<string | null>(null);
    const [isMenuVisible, setMenuVisible] = useState(false);

    const handleNotebookSelect = (notebookId: string) => {
        setActiveNotebook(notebookId);
        notebookState.loadNotebook(notebookId);
        setMenuVisible(false);
    };

    const notebookMenu = (
        <div className={styles.topSplit}>
            <div className={styles.notebookList}>
                {notebookState.notebooks.map((notebook) => (
                    <div key={notebook.id} className={styles.notebookGroup}>
                        <div className={styles.notebookTitle}>
                            {notebook.title}
                        </div>
                        <div 
                            className={clsx(
                                styles.notebook,
                                activeNotebook === notebook.id && styles.active
                            )}
                            onClick={() => handleNotebookSelect(notebook.id)}
                        >
                            <div className={styles.notebookMeta}>
                                <span>{notebook.lastModified}</span>
                                <span>{notebook.author}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.controls}>
                <button onClick={notebookState.createNewNotebook}>
                    New Notebook
                </button>
            </div>
        </div>
    );

    return (
        <div className={styles.notebookSidebar}>
            <Split 
                className={styles.splitWrapper}
                sizes={[33, 67]}
                minSize={[200, 400]}
                gutterStyle={() => ({
                    backgroundColor: '#ddd',
                    width: '8px',
                    cursor: 'col-resize'
                })}
            >
                <div className={styles.timeline}>
                    <NotebookTimeline />
                </div>
                <div className={styles.content}>
                    <NotebookContent />
                </div>
            </Split>
        </div>
    );
};
export const NotebookStateContext = createContext<INotebookState>(null!);

export function useNotebookState() {
    return useContext(NotebookStateContext);
}
