/**
 * ThemeToggle.tsx
 * A sleek dark/light mode toggle button.
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Check saved preference
        const saved = localStorage.getItem("theme");
        if (saved === "light") {
            setIsDark(false);
            document.documentElement.classList.add("light");
        }
    }, []);

    const toggle = () => {
        const next = !isDark;
        setIsDark(next);
        if (next) {
            document.documentElement.classList.remove("light");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.add("light");
            localStorage.setItem("theme", "light");
        }
        // Dispatch custom event so HeroContent can react
        window.dispatchEvent(new CustomEvent("themechange", { detail: { isDark: next } }));
    };

    return (
        <motion.button
            onClick={toggle}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed top-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full border border-white/20 backdrop-blur-md bg-white/10 shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 hover:border-white/40"
            aria-label="Toggle theme"
            style={{ pointerEvents: "auto" }}
        >
            {isDark ? (
                /* Sun icon for switching to light */
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                /* Moon icon for switching to dark */
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </motion.button>
    );
}
