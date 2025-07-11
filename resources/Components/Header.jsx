import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import LanguageSelector from './LanguageSelector.jsx';

export default function Header({ language, setLanguage, t, scrollToSection }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 transition-all duration-500">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className={`flex items-center space-x-3 transform transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                        <div className="relative">
                            <FileText className="h-10 w-10 text-[#36C4E4] transform hover:rotate-12 transition-transform duration-300" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#36C4E4] rounded-full animate-pulse"></div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-[#36C4E4] bg-gradient-to-r from-[#36C4E4] to-[#2BA3C4] bg-clip-text text-transparent">
                                Dokux
                            </div>
                            <div className="text-sm text-gray-600">Asesoría y Gestión</div>
                        </div>
                    </div>
                    
                    <nav className="hidden md:flex space-x-8 items-center">
                        {Object.entries(t.nav).map(([key, value], index) => (
                            <button 
                                key={key}
                                onClick={() => scrollToSection(key)} 
                                className={`text-gray-700 hover:text-[#36C4E4] transition-all duration-300 relative group transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {value}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#36C4E4] group-hover:w-full transition-all duration-300"></span>
                            </button>
                        ))}
                        
                        <LanguageSelector 
                            language={language} 
                            setLanguage={setLanguage}
                            className={`${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}
                            style={{ transitionDelay: '500ms' }}
                        />
                    </nav>

                    <div className="md:hidden flex items-center space-x-3">
                        <LanguageSelector 
                            language={language} 
                            setLanguage={setLanguage}
                            className="px-2 py-1"
                        />
                        
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110"
                        >
                            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                                <div className={`w-full h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
                                <div className={`w-full h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                                <div className={`w-full h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-500 ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="py-4 border-t border-gray-200 mt-4">
                        <div className="flex flex-col space-y-4">
                            {Object.entries(t.nav).map(([key, value], index) => (
                                <button 
                                    key={key}
                                    onClick={() => {
                                        scrollToSection(key);
                                        setIsMenuOpen(false);
                                    }} 
                                    className={`text-left text-gray-700 hover:text-[#36C4E4] transition-all duration-300 transform ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'}`}
                                    style={{ transitionDelay: `${index * 50}ms` }}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}