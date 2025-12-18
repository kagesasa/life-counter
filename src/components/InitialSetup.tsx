import React, { useState } from 'react';
import logo from '../assets/logo.png';

interface InitialSetupProps {
    onComplete: (data: { birthDate: string; sleep: number; work: number; lifespan: number }) => void;
}

export function InitialSetup({ onComplete }: InitialSetupProps) {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');

    // Defaults hidden from UI
    const sleep = 7;
    const work = 8;
    const lifespan = 90;

    const normalizeInput = (value: string) => {
        return value.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!year || !month || !day) return;

        // Pad month/day
        const y = year.padStart(4, '0');
        const m = month.padStart(2, '0');
        const d = day.padStart(2, '0');
        const birthDate = `${y}-${m}-${d}`;

        const dateObj = new Date(birthDate);
        if (isNaN(dateObj.getTime())) return;

        onComplete({
            birthDate,
            sleep,
            work,
            lifespan
        });
    };

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 text-white text-center">

            {/* Logo Section - Small Fixed Width */}
            <div className="mb-6 flex justify-center w-full">
                <img src={logo} alt="Kappa" className="w-12 invert" />
            </div>

            <h1 className="text-xl md:text-2xl font-bold mb-8 tracking-widest text-white">
                人生残り時間カウンター
            </h1>

            <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col items-center animate-fade-in">
                <div className="space-y-3 w-full flex flex-col items-center">
                    <label className="block text-sm font-bold tracking-wider text-white">
                        生年月日
                    </label>

                    {/* Gray Container for Date Inputs with Static Labels */}
                    <div className="bg-gray-600 rounded-full px-8 py-3 flex items-center justify-center gap-6 w-auto min-w-[320px]">

                        {/* Year */}
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="1990"
                                value={year}
                                onChange={(e) => setYear(normalizeInput(e.target.value))}
                                className="w-16 bg-transparent border-none text-right text-xl font-bold focus:outline-none placeholder-gray-400 text-white"
                            />
                            <span className="text-white text-lg font-bold">年</span>
                        </div>

                        {/* Month */}
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="1"
                                value={month}
                                onChange={(e) => setMonth(normalizeInput(e.target.value))}
                                className="w-10 bg-transparent border-none text-right text-xl font-bold focus:outline-none placeholder-gray-400 text-white"
                            />
                            <span className="text-white text-lg font-bold">月</span>
                        </div>

                        {/* Day */}
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="1"
                                value={day}
                                onChange={(e) => setDay(normalizeInput(e.target.value))}
                                className="w-10 bg-transparent border-none text-right text-xl font-bold focus:outline-none placeholder-gray-400 text-white"
                            />
                            <span className="text-white text-lg font-bold">日</span>
                        </div>
                    </div>
                </div>

                {/* Space before button */}
                <div className="h-16"></div>

                <button
                    type="submit"
                    disabled={!year || !month || !day}
                    className="px-12 py-3 bg-gray-200 text-black font-bold tracking-widest text-lg hover:bg-white transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    現実をみる
                </button>
            </form>
        </div>
    );
}
