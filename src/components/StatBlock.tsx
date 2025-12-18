import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface StatBlockProps {
    label: string;
    value: number | string;
    subLabel?: string;
    highlight?: boolean;
}

function AnimatedNumber({ value }: { value: number }) {
    // Use a spring for smooth transition of the number value
    const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
    const displayValue = useTransform(spring, (current: number) => Math.round(current).toLocaleString());

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{displayValue}</motion.span>;
}

export function StatBlock({ label, value, subLabel, highlight = false }: StatBlockProps) {
    // If value is a number, we animate it. If string (like typical dates), just show.
    const isNumber = typeof value === 'number';

    return (
        <div className={`flex flex-col items-center justify-center p-4 ${highlight ? 'bg-white/5' : ''}`}>
            <span className="text-sm text-gray-500 uppercase tracking-widest mb-2">{label}</span>
            <span className="text-4xl md:text-5xl font-mono font-light tracking-tighter text-white">
                {isNumber ? <AnimatedNumber value={value as number} /> : value}
            </span>
            {subLabel && <span className="text-xs text-gray-600 mt-1">{subLabel}</span>}
        </div>
    );
}
