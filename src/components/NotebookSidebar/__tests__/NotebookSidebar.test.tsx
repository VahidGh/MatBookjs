import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotebookSidebar, NotebookStateContext } from '../NotebookSidebar';

const mockNotebookState = {
    notebooks: [
        {
            id: '1',
            title: 'Test Notebook',
            content: '',
            author: 'Test Author',
            lastModified: '2024-01-20',
            cells: []
        }
    ],
    currentNotebook: null,
    loadNotebook: jest.fn(),
    createNewNotebook: jest.fn(),
    saveNotebook: jest.fn()
};

describe('NotebookSidebar', () => {
    it('renders notebook list', () => {
        render(
            <NotebookStateContext.Provider value={mockNotebookState}>
                <NotebookSidebar />
            </NotebookStateContext.Provider>
        );
        
        const menuButton = screen.getByText('Show Menu');
        fireEvent.click(menuButton);
        expect(screen.getByText('Test Notebook')).toBeInTheDocument();
    });

    it('handles notebook selection', async () => {
        const { container } = render(
            <NotebookStateContext.Provider value={mockNotebookState}>
                <NotebookSidebar />
            </NotebookStateContext.Provider>
        );
        
        const menuButton = screen.getByText('Show Menu');
        fireEvent.click(menuButton);
        
        const notebookElement = container.querySelector('.notebook');
        if (notebookElement) {
            fireEvent.click(notebookElement);
        }
        
        await waitFor(() => {
            expect(mockNotebookState.loadNotebook).toHaveBeenCalledWith('1');
        });
    });});