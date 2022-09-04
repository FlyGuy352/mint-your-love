import { useEffect, useRef, useState } from 'react';

export const useOutsideAlerter = () => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    const handleClickOutside = () => {
        if (ref.current && !ref.current.contains(event.target)) {
            setVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [ref]);

    return { visible, setVisible, ref };
};