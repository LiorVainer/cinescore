import { useEffect } from 'react';

export const useOutsideClick = (
    // Allow the ref to be nullable which is the default from useRef(null)
    ref: React.RefObject<HTMLElement | null>,
    callback: (event: MouseEvent | TouchEvent) => void,
) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node | null;
            // DO NOTHING if the element being clicked is the target element or their children
            if (!ref.current || (target && ref.current.contains(target))) {
                return;
            }
            callback(event);
        };

        document.addEventListener('mousedown', listener as EventListener);
        document.addEventListener('touchstart', listener as EventListener);

        return () => {
            document.removeEventListener('mousedown', listener as EventListener);
            document.removeEventListener('touchstart', listener as EventListener);
        };
    }, [ref, callback]);
};
