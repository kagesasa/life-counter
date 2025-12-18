import { useState, useRef } from 'react';
import { LifeSlider } from './LifeSlider';
import { StatBlock } from './StatBlock';
import type { LifeStats, UserSettings } from '../logic/lifeCalculator';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
    stats: LifeStats;
    settings: UserSettings;
    onUpdateLifespan: (years: number) => void;
    onReset: () => void;
}

// Random fleeting messages on slider change
const MESSAGES = [
    "春が1つ、消えました",
    "日曜の夜が減りました",
    "それでも、無限ではありません",
    "時間が、削がれました",
    "また一つ、誕生日が消滅",
    "終わりが近づいています",
    "ただの数字、しかし事実",
    "桜を見られる回数が減りました",
];

export function Dashboard({ stats, settings, onUpdateLifespan, onReset }: DashboardProps) {
    const [message, setMessage] = useState<string | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const handleSliderChange = (val: number) => {
        onUpdateLifespan(val);

        // Trigger random message
        const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        setMessage(randomMsg);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            setMessage(null);
        }, 2000); // Dissolve after 2s
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col max-w-xl mx-auto">
            {/* Header / Main Stat */}
            {/* Header / Main Stat */}
            <header className="mb-12 mt-8 text-center">
                <p className="text-gray-500 uppercase tracking-[0.3em] text-lg mb-2">人生使用率</p>
                <div className="text-8xl md:text-9xl font-bold tracking-tighter">
                    <span className="text-white">{stats.usedPercentage.toFixed(1)}</span>
                    <span className="text-4xl md:text-6xl text-gray-600 ml-2">%</span>
                </div>
            </header>

            {/* Slider Section */}
            <section className="mb-16 relative">
                <LifeSlider value={settings.lifespanYears} onChange={handleSliderChange} />

                {/* Fleeting Message Overlay */}
                <div className="h-8 mt-4 text-center">
                    <AnimatePresence mode="wait">
                        {message && (
                            <motion.p
                                key={message}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-gray-300 text-base font-mono italic"
                            >
                                {message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Main Stats Grid */}
            <section className="grid grid-cols-2 gap-10 mb-16">
                <StatBlock label="残り年数" value={stats.remainingYears} />
                <StatBlock label="残り日数" value={stats.remainingDays} />
                <StatBlock label="残り週数" value={stats.remainingWeeks} />
                <StatBlock label="残り時間" value={stats.remainingHours} />
            </section>

            <hr className="border-gray-900 mb-16" />

            {/* Experiences */}
            <section className="space-y-10 mb-16">
                <h3 className="text-gray-600 uppercase tracking-widest text-center text-sm mb-8">体験の残り回数</h3>
                <div className="grid grid-cols-2 gap-8">
                    <StatBlock label="残り春の回数" value={stats.remainingSprings} />
                    <StatBlock label="満月が見れる回数" value={stats.remainingFullMoons} />
                    <StatBlock label="残り日曜の夜" value={stats.remainingSundays} />
                    <StatBlock label="残り誕生日" value={stats.remainingBirthdays} />
                </div>
            </section>

            {/* Breakdown */}
            <section className="space-y-8 mb-16">
                <h3 className="text-gray-600 uppercase tracking-widest text-center text-sm mb-8">時間の内訳（仮定）</h3>
                <p className="text-center text-gray-500 text-xs mb-4">※睡眠{settings.dailySleepHours}時間、労働{settings.dailyWorkHours}時間で計算</p>
                <div className="grid grid-cols-1 gap-6">
                    <div className="flex justify-between items-center text-base border-b border-gray-900 pb-3">
                        <span className="text-gray-400">睡眠 ({settings.dailySleepHours}時間/日)</span>
                        <span className="font-mono text-xl">{stats.sleepHours.toLocaleString()} 時間</span>
                    </div>
                    <div className="flex justify-between items-center text-base border-b border-gray-900 pb-3">
                        <span className="text-gray-400">労働 ({settings.dailyWorkHours}時間/日)</span>
                        <span className="font-mono text-xl">{stats.workHours.toLocaleString()} 時間</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl font-bold mt-6">
                        <span className="text-white">自由時間</span>
                        <span className="font-mono text-white">{stats.freeHours.toLocaleString()} 時間</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-10">
                    <StatBlock label="映画 (2時間/本)" value={stats.moviesWatchable} subLabel="本" highlight />
                    <StatBlock label="本 (10時間/冊)" value={stats.booksReadable} subLabel="冊" highlight />
                </div>
            </section>

            <footer className="text-center text-gray-800 text-sm mt-auto pb-10 flex flex-col items-center gap-6">
                <p>これは、あなたの人生です。</p>
                <button
                    onClick={onReset}
                    className="text-gray-900 hover:text-red-900 transition-colors text-xs uppercase tracking-widest border-b border-transparent hover:border-red-900"
                >
                    データを破棄して最初に戻る
                </button>
            </footer>
        </div>
    );
}
