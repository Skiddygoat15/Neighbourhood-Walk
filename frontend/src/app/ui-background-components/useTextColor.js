// ui-background-components/useTextColor.js
import { useState, useEffect } from 'react';

const useTextColor = () => {
    const [textColor, setTextColor] = useState('text-black');

    useEffect(() => {

        const currentHour = new Date().getHours();
        if (currentHour >= 6 && currentHour < 17) {
            setTextColor('text-black');
        } else {
            setTextColor('text-white');
        }
    }, []);

    return textColor;
};

export default useTextColor;
