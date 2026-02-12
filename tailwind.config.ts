import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    dark: 'hsl(var(--primary-dark))',
                    light: 'hsl(var(--primary-light))',
                },
                secondary: 'hsl(var(--secondary))',
                accent: 'hsl(var(--accent))',
                success: 'hsl(var(--success))',
                warning: 'hsl(var(--warning))',
                error: 'hsl(var(--error))',
                background: 'hsl(var(--background))',
                surface: {
                    DEFAULT: 'hsl(var(--surface))',
                    dark: 'hsl(var(--surface-dark))',
                },
                text: {
                    primary: 'hsl(var(--text-primary))',
                    secondary: 'hsl(var(--text-secondary))',
                    tertiary: 'hsl(var(--text-tertiary))',
                },
                border: {
                    DEFAULT: 'hsl(var(--border))',
                    hover: 'hsl(var(--border-hover))',
                },
            },
            boxShadow: {
                'sm': 'var(--shadow-sm)',
                'md': 'var(--shadow-md)',
                'lg': 'var(--shadow-lg)',
                'xl': 'var(--shadow-xl)',
            },
            backgroundImage: {
                'gradient-primary': 'var(--gradient-primary)',
                'gradient-success': 'var(--gradient-success)',
                'gradient-premium': 'var(--gradient-premium)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'slide-in-right': 'slideInRight 0.6s ease-out',
                'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};

export default config;
