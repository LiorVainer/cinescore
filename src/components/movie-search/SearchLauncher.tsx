'use client';

import {useState, useCallback} from 'react';
import {FiltersProvider} from './FiltersContext';
import {SearchButton} from './SearchButton';
import {SearchModalOrDrawer} from './SearchModalOrDrawer';

export function SearchLauncher() {
    const [open, setOpen] = useState(false);

    const handleOpen = useCallback(() => {
        setOpen(true);
    }, []);

    const handleOpenChange = useCallback((next: boolean) => {
        setOpen(next);
    }, []);

    return (
        <FiltersProvider>
            <SearchButton onClick={handleOpen} />
            <SearchModalOrDrawer open={open} onOpenChange={handleOpenChange} />
        </FiltersProvider>
    );
}
