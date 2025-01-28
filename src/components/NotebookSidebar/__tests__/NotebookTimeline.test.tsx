import React from 'react';
import { render, screen } from '@testing-library/react';
import { NotebookTimeline } from '../NotebookTimeline';
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
                content: 'Test code content'
            }
        ]
    },
    loadNotebook: jest.fn(),
    createNewNotebook: jest.fn(),
    saveNotebook: jest.fn()
};

describe('NotebookTimeline', () => {
    it('displays cell previews', () => {
        render(
            <NotebookStateContext.Provider value={mockNotebookState}>
                <NotebookTimeline />
            </NotebookStateContext.Provider>
        );
        
        expect(screen.getByText('code')).toBeInTheDocument();
        expect(screen.getByText(/Test code content/)).toBeInTheDocument();
    });
});
