/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.vue",
    ],
    theme: {
        extend: {
            fontFamily: {
                bebas: ["Bebas Neue", "serif"],
                poppins: ["Aeonik", "sans-serif"], // ← CAMBIADO: Aeonik en vez de Aspekta
                aeonik: ["Aeonik", "sans-serif"],
                sans: ["Aeonik", "system-ui", "-apple-system", "sans-serif"],
            },
            colors: {
                // Colores originales mantenidos para compatibilidad
                azul: "#224483",
                negro: "#242424",
                
                // Nuevos colores corporativos de la empresa legal
                primary: "#0B0D40",     // Primary color
                secondary: "#30348C",   // Secondary color
                tertiary: "#5E608C",    // Tertiary color  
                light: "#F2F2F2",       // White/Light color
                accent: "#0D0D0D",      // Accent/Dark color
                
                // Colores oficiales Home Delivery Logistics (Manual de Marca)
                // Proporción de uso: White (mayor), Cerise (30%), Android Green (30%), Cerulean (30%), Spanish Gray (10%)
                'hd-android': '#8FBD44',        // Android Green - Color primario/CTA (30% uso aprox)
                'hd-spanish': '#969798',        // Spanish Gray - Color mínimo (10% uso)
                'hd-cerulean': '#2354B8',       // Cerulean Blue - Color acento (30% uso)
                'hd-cerise': '#DE3464',         // Cerise - Color secundario importante (30% uso)
                
                // Mantener compatibilidad con código anterior
                'hd-onyx': '#33393F',           
                'hd-green': '#8FBD44',          
                'hd-gray': '#969798',           
                'hd-blue': '#2354B8',
                'hd-cerise': '#DE3464',         // Cerise - Color acento rosa
                
                // Sobrescribir colores de Tailwind con nuestra paleta corporativa
                blue: {
                    50: "#f0f0ff",
                    100: "#e5e7ff",
                    200: "#cdcfff",
                    300: "#a5a9ff",
                    400: "#7c82ff",
                    500: "#5E608C",
                    600: "#30348C",
                    700: "#1e1f5c",
                    800: "#0B0D40",
                    900: "#050620",
                    950: "#030412",
                },
                gray: {
                    50: "#F2F2F2",
                    100: "#e8e8e8",
                    200: "#d4d4d4",
                    300: "#b8b8b8",
                    400: "#969696",
                    500: "#7a7a7a",
                    600: "#666666",
                    700: "#525252",
                    800: "#404040",
                    900: "#262626",
                    950: "#0D0D0D",
                },
            },
        },
    },
    plugins: [
        require("tailwindcss-animated"),
        function ({ addUtilities }) {
            const newUtilities = {
                ".scrollbar-hide": {
                    /* IE and Edge */
                    "-ms-overflow-style": "none",

                    /* Firefox */
                    "scrollbar-width": "none",

                    /* Safari and Chrome */
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                },
            };

            addUtilities(newUtilities);
        },
        // Otros plugins si los tienes
    ],
};
