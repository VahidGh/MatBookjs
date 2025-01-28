export interface INotebook {
    id: string;
    title: string;
    content: string;
    author: string;
    lastModified: string;
    cells: INotebookCell[];
}

export type CellType = 'code' | 'text' | 'math' | 'visualization';

export interface INotebookCell {
    id: string;
    type: CellType;
    content: string;
}

export interface INotebookState {
    notebooks: INotebook[];
    currentNotebook: INotebook | null;
    output: any[];
    loadNotebook: (id: string) => void;
    createNewNotebook: () => void;
    saveNotebook: (notebook: INotebook) => void;
    addCell: (type: CellType) => void;
    updateNotebook: (notebook: INotebook) => void;
    updateOutput: (output: any[]) => void;
    runInNewTab: (cell: any) => void;
}