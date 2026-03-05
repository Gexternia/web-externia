/**
 * ServiceCard.tsx
 * Glassmorphism card with Framer Motion hover effects (client:visible).
 */
import { motion } from "framer-motion";

interface ServiceCardProps {
    title: string;
    description: string;
    icon: string;
}

export default function ServiceCard({ title, description, icon }: ServiceCardProps) {
    return (
        <motion.article
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors duration-300 hover:border-azul/60 sm:p-8"
        >
            {/* Glow effect behind card on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ boxShadow: "0 0 30px #0070f340, inset 0 0 30px #0070f310" }}
            />

            {/* Icon */}
            <motion.span
                className="mb-4 inline-block text-4xl"
                whileHover={{ scale: 1.2, rotate: 8 }}
                transition={{ type: "spring", stiffness: 400 }}
            >
                {icon}
            </motion.span>

            {/* Title */}
            <h3 className="mb-2 text-lg font-bold text-blanco sm:text-xl">
                {title}
            </h3>

            {/* Description */}
            <p className="text-sm leading-relaxed text-gray-400 sm:text-base">
                {description}
            </p>
        </motion.article>
    );
}
