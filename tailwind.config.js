/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                game: ['"Chakra Petch"', 'sans-serif'], // Sci-fi/Game header font
                mono: ['"JetBrains Mono"', 'monospace'], // Clean code font
                body: ['"Nunito"', 'sans-serif'], // Readable UI font
            },
            colors: {
                arcade: {
                    bg: "#1a1a2e",     // Deep Navy
                    card: "#16213e",   // Dark Blue Grey
                    primary: "#e94560", // Pop Red/Pink
                    secondary: "#0f3460", // Muted Blue
                    accent: "#ffd700",  // Gold/Coin
                    success: "#4cc9f0", // Bright Cyan
                },
            },
            boxShadow: {
                'game-card': '0 8px 0 rgba(0,0,0,0.5)',
                'game-btn': '0 6px 0 #9d162e', // Darker shade of primary
                'game-btn-hover': '0 3px 0 #9d162e',
                'game-input': 'inset 0 4px 8px rgba(0,0,0,0.3)',
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'bounce-short': 'bounce-short 0.5s infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'bounce-short': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                }
            }
        },
    },
    plugins: [],
};