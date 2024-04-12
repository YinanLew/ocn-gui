
import React from 'react';
import { useLanguage } from '../utils/languageContext';

const LanguageSwitcher: React.FC = () => {
    const { setLanguage } = useLanguage();

    const handleChangeLanguage = (newLanguage: string) => {
        setLanguage(newLanguage);
    };

    return (
        <div>
            <button onClick={() => handleChangeLanguage('en')}>English</button>
            <button onClick={() => handleChangeLanguage('cn')}>Chinese</button>
        </div>
    );
};

export default LanguageSwitcher;
