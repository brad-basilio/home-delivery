import React from 'react';

export default function LanguageSelector({ language, setLanguage, className = '' }) {
    return (
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 transition-all duration-300 ${className}`}>
            <button
                onClick={() => setLanguage('es')}
                className={`flex items-center space-x-1 px-2 py-1 rounded transition-all duration-300 transform hover:scale-110 ${
                    language === 'es' 
                        ? 'bg-[#36C4E4] text-white shadow-md' 
                        : 'hover:bg-gray-200 text-gray-600'
                }`}
            >
                <div className="text-lg">🇪🇸</div>
                <span className="text-xs font-medium">ES</span>
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
                onClick={() => setLanguage('en')}
                className={`flex items-center space-x-1 px-2 py-1 rounded transition-all duration-300 transform hover:scale-110 ${
                    language === 'en' 
                        ? 'bg-[#36C4E4] text-white shadow-md' 
                        : 'hover:bg-gray-200 text-gray-600'
                }`}
            >
                <div className="text-lg">🇺🇸</div>
                <span className="text-xs font-medium">EN</span>
            </button>
        </div>
    );
}