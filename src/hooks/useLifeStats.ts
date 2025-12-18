import { useState, useEffect } from 'react';
import { LifeCalculator, type LifeStats, type UserSettings } from '../logic/lifeCalculator';

const calculator = new LifeCalculator();

export function useLifeStats(settings: UserSettings) {
    const [stats, setStats] = useState<LifeStats>(() => calculator.calculate(settings));

    useEffect(() => {
        // Initial calc
        setStats(calculator.calculate(settings));

        // Update every second (or frame?) for the "Remaining Seconds" to feel alive?
        // User requirement: "All results recalculated immediately on slider change"
        // "Animation of 0.2-0.4s" suggests UI animation, not necessarily data ticking.
        // However, "Remaining Seconds" implies a ticker.
        const interval = setInterval(() => {
            setStats(calculator.calculate(settings));
        }, 1000);

        return () => clearInterval(interval);
    }, [settings]);

    return stats;
}
