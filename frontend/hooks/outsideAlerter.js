import { useEffect, useRef, useState } from 'react';

export const useOutsideAlerter = alertClickInside => {
    const ref = useRef();
    const [visible, setVisible] = useState(false);

    const handleClickOutside = () => {
        if (!ref.current?.contains(event.target)) {
            setVisible(false);
        } else if (alertClickInside) {
            setVisible(true);
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