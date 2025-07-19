import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        try {
            const savedLang = localStorage.getItem("currentLanguage");
            if (!savedLang) return null;
            
            // Verificar si los datos parecen ser JSON válido
            if (savedLang.startsWith("U2FsdGVkX1")) {
                // Los datos están encriptados, limpiar localStorage y retornar null
                localStorage.removeItem("currentLanguage");
                return null;
            }
            
            return JSON.parse(savedLang);
        } catch (error) {
            // Si hay error al parsear, limpiar localStorage y retornar null
            console.warn("Error parsing currentLanguage data, clearing localStorage:", error);
            localStorage.removeItem("currentLanguage");
            return null;
        }
    });

    const [translations, setTranslations] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Usar useCallback para memoizar la función
    const loadTranslations = useCallback(async (langId, signal) => {
        try {
            setLoading(true);
            setError(null);
            //MODIFICAR CON FECH xautoken
            const res = await axios.get(`/api/translations/${langId}`, {
                signal, // Para cancelar peticiones anteriores
            });
            //console.log(res.data);
            setTranslations(res.data);
        } catch (err) {
            if (!axios.isCancel(err)) {
                console.error("Error loading translations:", err);
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // 2. Verificar que tenemos un ID válido
        if (!currentLanguage?.id) return;

        // 3. Usar AbortController para evitar race conditions
        const abortController = new AbortController();

        loadTranslations(currentLanguage.id, abortController.signal);

        return () => abortController.abort();
    }, [currentLanguage?.id, loadTranslations]); // 4. Agregar dependencia

    const changeLanguage = async (lang) => {
        try {
            // 5. Validar estructura del objeto lang
            if (!lang?.id || !lang?.name) {
                throw new Error("Invalid language object");
            }

            localStorage.setItem("currentLanguage", JSON.stringify(lang));
            setCurrentLanguage(lang);
        } catch (err) {
            console.error("Error changing language:", err);
            setError(err.message);
        }
    };

    return (
        <LanguageContext.Provider
            value={{
                currentLanguage,
                changeLanguage,
                translations,
                loading,
                error,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};
