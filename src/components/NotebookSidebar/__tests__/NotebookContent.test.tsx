import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotebookContent } from '../NotebookContent';
import { NotebookStateContext } from '../NotebookSidebar';

const mockNotebookState = {
    notebooks: [],
    currentNotebook: {
        id: '1',
        title: 'Test Notebook',
        content: '',
        author: 'Test Author',
        lastModified: '2024-01-20',
        cells: [
            {
                id: 'cell1',
                type: 'code' as const,
                content: 'console.log("test")'
            },
            {
                id: 'cell2',
                type: 'math' as const,
                content: 'E = mc^2'
            }
        ]
    },
    loadNotebook: jest.fn(),
    createNewNotebook: jest.fn(),
    saveNotebook: jest.fn()
};
describe('NotebookContent', () => {
    it('renders cells correctly', () => {
        render(
            <NotebookStateContext.Provider value={mockNotebookState}>
                <NotebookContent />
            </NotebookStateContext.Provider>
        );
        
        expect(screen.getByText('console.log("test")')).toBeInTheDocument();
        expect(screen.getByText('E = mc^2')).toBeInTheDocument();
    });

    it('enables cell editing on click', () => {
        render(
            <NotebookStateContext.Provider value={mockNotebookState}>
                <NotebookContent />
            </NotebookStateContext.Provider>
        );
        
        const codeCell = screen.getByText('console.log("test")');
        fireEvent.click(codeCell);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
});