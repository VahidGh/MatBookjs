import React, { useState, useEffect } from 'react';
import { useNotebookState } from './NotebookSidebar';
import styles from './NotebookContent.module.scss';
import { executeCode } from '../../utils/codeRunner';

interface OutputTab {
    id: string;
    content: any;
    title: string;
}

export const NotebookContent: React.FC = () => {
    const notebookState = useNotebookState();
    const currentNotebook = notebookState.currentNotebook;
    const [tabs, setTabs] = useState<OutputTab[]>([{ id: 'main', content: null, title: 'Main Output' }]);
    const [activeTab, setActiveTab] = useState('main');

    useEffect(() => {
        if (notebookState.output?.[0]?.inNewTab) {
            const output = notebookState.output[0];
            const cellIndex = currentNotebook.cells.findIndex(cell => cell.id === output.id);
            const newTab = {
                id: output.id,
                content: output,
                title: `Cell #${cellIndex + 1}`
            };
            setTabs(prev => [...prev, newTab]);
            setActiveTab(output.id);
        }
    }, [notebookState.output]);    

    const handleRunInNewTab = (output: any, cellId: string) => {
        const newTab = {
            id: cellId,
            content: output,
            title: `Cell #${cellId} Output`
        };
        setTabs([...tabs, newTab]);
        setActiveTab(cellId);
    };

    const renderOutput = (output:any) => {
        if (!output) return null;
        
        return (
            <iframe 
                srcDoc={executeCode(output.content)}
                style={{ width: '100%', height: '100%', border: 'none' }}
                sandbox="allow-scripts"
            />
        );
    };
    

    return (
        <div className={styles.outputPanel}>
            <div className={styles.tabBar}>
                {tabs.map(tab => (
                    <div 
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.title}
                        {tab.id !== 'main' && (
                            <button 
                                className={styles.closeTab}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTabs(tabs.filter(t => t.id !== tab.id));
                                    setActiveTab('main');
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.outputContent}>
            {renderOutput(activeTab === 'main' ? 
                    notebookState.output?.[0] : 
                    tabs.find(t => t.id === activeTab)?.content
                )}
            </div>
        </div>
    );
};
