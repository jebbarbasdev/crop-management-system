import { useRef, KeyboardEvent } from 'react';

export const useTableNavigation = () => {
    const tableRef = useRef<HTMLTableElement>(null);

    const findNextInput = (currentElement: HTMLElement, direction: 'up' | 'down' | 'left' | 'right'): HTMLElement | null => {
        const currentRow = currentElement.closest('tr');
        if (!currentRow || !currentRow.parentElement) return null;

        const rows = Array.from(currentRow.parentElement.children) as HTMLTableRowElement[];
        const currentRowIndex = rows.indexOf(currentRow);
        const currentCell = currentElement.closest('td');
        if (!currentCell) return null;

        const cells = Array.from(currentRow.cells);
        const currentCellIndex = cells.indexOf(currentCell as HTMLTableCellElement);

        let nextElement: HTMLElement | null = null;

        switch (direction) {
            case 'down':
                if (currentRowIndex < rows.length - 1) {
                    const nextRow = rows[currentRowIndex + 1];
                    const nextCell = nextRow.cells[currentCellIndex];
                    nextElement = nextCell.querySelector('input, select') as HTMLElement;
                }
                break;
            case 'up':
                if (currentRowIndex > 0) {
                    const prevRow = rows[currentRowIndex - 1];
                    const prevCell = prevRow.cells[currentCellIndex];
                    nextElement = prevCell.querySelector('input, select') as HTMLElement;
                }
                break;
            case 'right':
                if (currentCellIndex < cells.length - 1) {
                    const nextCell = cells[currentCellIndex + 1];
                    nextElement = nextCell.querySelector('input, select') as HTMLElement;
                }
                break;
            case 'left':
                if (currentCellIndex > 0) {
                    const prevCell = cells[currentCellIndex - 1];
                    nextElement = prevCell.querySelector('input, select') as HTMLElement;
                }
                break;
        }

        return nextElement;
    };

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (e.shiftKey) {
                    const nextElement = findNextInput(target, 'up');
                    if (nextElement) {
                        nextElement.focus();
                        if (nextElement instanceof HTMLInputElement) {
                            nextElement.select();
                        }
                    }
                } else {
                    const nextElement = findNextInput(target, 'down');
                    if (nextElement) {
                        nextElement.focus();
                        if (nextElement instanceof HTMLInputElement) {
                            nextElement.select();
                        }
                    }
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                const upElement = findNextInput(target, 'up');
                if (upElement) {
                    upElement.focus();
                    if (upElement instanceof HTMLInputElement) {
                        upElement.select();
                    }
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                const downElement = findNextInput(target, 'down');
                if (downElement) {
                    downElement.focus();
                    if (downElement instanceof HTMLInputElement) {
                        downElement.select();
                    }
                }
                break;
            case 'ArrowLeft':
                // Para inputs numéricos, siempre navegar con la flecha izquierda
                e.preventDefault();
                const leftElement = findNextInput(target, 'left');
                if (leftElement) {
                    leftElement.focus();
                    if (leftElement instanceof HTMLInputElement) {
                        leftElement.select();
                    }
                }
                break;
            case 'ArrowRight':
                // Para inputs numéricos, siempre navegar con la flecha derecha
                e.preventDefault();
                const rightElement = findNextInput(target, 'right');
                if (rightElement) {
                    rightElement.focus();
                    if (rightElement instanceof HTMLInputElement) {
                        rightElement.select();
                    }
                }
                break;
        }
    };

    const handleSelectKeyDown = (e: KeyboardEvent<HTMLSelectElement>) => {
        const target = e.target as HTMLSelectElement;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (e.shiftKey) {
                    const nextElement = findNextInput(target, 'up');
                    if (nextElement) {
                        nextElement.focus();
                        if (nextElement instanceof HTMLInputElement) {
                            nextElement.select();
                        }
                    }
                } else {
                    const nextElement = findNextInput(target, 'down');
                    if (nextElement) {
                        nextElement.focus();
                        if (nextElement instanceof HTMLInputElement) {
                            nextElement.select();
                        }
                    }
                }
                break;
            case 'ArrowUp':
                if (target.selectedIndex === 0) {
                    e.preventDefault();
                    const upElement = findNextInput(target, 'up');
                    if (upElement) {
                        upElement.focus();
                        if (upElement instanceof HTMLInputElement) {
                            upElement.select();
                        }
                    }
                }
                break;
            case 'ArrowDown':
                if (target.selectedIndex === target.options.length - 1) {
                    e.preventDefault();
                    const downElement = findNextInput(target, 'down');
                    if (downElement) {
                        downElement.focus();
                        if (downElement instanceof HTMLInputElement) {
                            downElement.select();
                        }
                    }
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                const leftElement = findNextInput(target, 'left');
                if (leftElement) {
                    leftElement.focus();
                    if (leftElement instanceof HTMLInputElement) {
                        leftElement.select();
                    }
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                const rightElement = findNextInput(target, 'right');
                if (rightElement) {
                    rightElement.focus();
                    if (rightElement instanceof HTMLInputElement) {
                        rightElement.select();
                    }
                }
                break;
        }
    };

    return {
        tableRef,
        handleInputKeyDown,
        handleSelectKeyDown,
    };
}; 