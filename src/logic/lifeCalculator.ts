export interface LifeStats {
    usedPercentage: number;
    remainingYears: number;
    remainingDays: number;
    remainingWeeks: number;
    remainingHours: number;
    remainingSeconds: number; // for smooth animation potential

    // Experience
    remainingSprings: number;
    remainingBirthdays: number;
    remainingSundays: number;
    remainingFullMoons: number;

    // Time Breakdown (Remaining)
    sleepHours: number;
    workHours: number;
    freeHours: number; // Total free hours available in remaining life

    // Metaphors
    moviesWatchable: number; // 2 hours
    booksReadable: number; // 10 hours
}

export interface UserSettings {
    birthDate: string; // YYYY-MM-DD
    lifespanYears: number;
    dailySleepHours: number;
    dailyWorkHours: number;
}

export class LifeCalculator {
    private now: Date;

    constructor() {
        this.now = new Date();
    }

    calculate(settings: UserSettings): LifeStats {
        const birth = new Date(settings.birthDate);

        // Safety check for invalid date
        if (isNaN(birth.getTime())) {
            console.error("Invalid birth date:", settings.birthDate);
            return this.getDeadStats();
        }

        const lifespan = Number(settings.lifespanYears) || 90; // Safety fallback
        const death = new Date(birth);
        death.setFullYear(birth.getFullYear() + lifespan);

        // Basic Time
        const totalLifeMillis = death.getTime() - birth.getTime();
        const usedMillis = this.now.getTime() - birth.getTime();
        const remainingMillis = death.getTime() - this.now.getTime();

        // Clamp values
        if (remainingMillis <= 0 || totalLifeMillis <= 0) {
            return this.getDeadStats();
        }

        const usedPercentage = Math.min(100, Math.max(0, (usedMillis / totalLifeMillis) * 100));

        // Remaining Units
        const remainingSeconds = Math.floor(remainingMillis / 1000);
        const remainingHours = Math.floor(remainingSeconds / 3600);
        const remainingDays = Math.floor(remainingHours / 24);
        const remainingWeeks = Math.floor(remainingDays / 7);
        const remainingYears = Math.floor(remainingDays / 365.25);

        // Experiences
        const remainingSprings = this.countEvent(this.now, death, 2, 20); // March 20th (Month is 0-indexed in JS date? No, 0 is Jan. So March is 2)
        const remainingBirthdays = this.countEvent(this.now, death, birth.getMonth(), birth.getDate());
        const remainingSundays = this.countWeekdays(this.now, death, 0); // 0 is Sunday
        const remainingFullMoons = this.countFullMoons(this.now, death);

        // Allocations (Daily)
        // We assume these are constant for the remaining days
        const dailyEssentials = settings.dailySleepHours + settings.dailyWorkHours;
        const dailyFreeHours = Math.max(0, 24 - dailyEssentials);

        // Total allocation over remaining days
        const totalRemainingSleep = remainingDays * settings.dailySleepHours;
        const totalRemainingWork = remainingDays * settings.dailyWorkHours;
        const totalFreeHours = remainingDays * dailyFreeHours;

        // Metaphors
        const moviesWatchable = Math.floor(totalFreeHours / 2);
        const booksReadable = Math.floor(totalFreeHours / 10);

        return {
            usedPercentage,
            remainingYears,
            remainingDays,
            remainingWeeks,
            remainingHours,
            remainingSeconds,
            remainingSprings,
            remainingBirthdays,
            remainingSundays,
            remainingFullMoons,
            sleepHours: totalRemainingSleep,
            workHours: totalRemainingWork,
            freeHours: totalFreeHours,
            moviesWatchable,
            booksReadable,
        };
    }

    private getDeadStats(): LifeStats {
        return {
            usedPercentage: 100,
            remainingYears: 0,
            remainingDays: 0,
            remainingWeeks: 0,
            remainingHours: 0,
            remainingSeconds: 0,
            remainingSprings: 0,
            remainingBirthdays: 0,
            remainingSundays: 0,
            remainingFullMoons: 0,
            sleepHours: 0,
            workHours: 0,
            freeHours: 0,
            moviesWatchable: 0,
            booksReadable: 0,
        };
    }

    // Count how many times a specific Month/Day occurs between start and end
    private countEvent(start: Date, end: Date, month: number, day: number): number {
        let count = 0;
        let currentYear = start.getFullYear();
        const endYear = end.getFullYear();

        for (let y = currentYear; y <= endYear; y++) {
            const eventDate = new Date(y, month, day, 23, 59, 59);
            if (eventDate > start && eventDate < end) {
                count++;
            }
        }
        return count;
    }

    // Count specific weekdays (0=Sun, 6=Sat)
    private countWeekdays(start: Date, end: Date, dayOfWeek: number): number {
        // Very rough approximation is days/7, but let's be slightly more precise if needed
        // Or just iterate if range is small? 80 years is 29k days. Iteration is fine in JS engine.
        // Optimization: find first occurrence, then math.

        // Clone start to avoid mutating
        let current = new Date(start);
        current.setHours(0, 0, 0, 0);

        // Advance to first occurrence
        while (current.getDay() !== dayOfWeek) {
            current.setDate(current.getDate() + 1);
        }

        // Now current is the first Sunday (or whatever)
        // Check if it's still before end
        if (current >= end) return 0;

        // Calculate diff in weeks
        const diffMillis = end.getTime() - current.getTime();
        const weeks = Math.floor(diffMillis / (7 * 24 * 60 * 60 * 1000));

        // The first one counts, plus 'weeks' more.
        // Actually, simple division:
        return weeks + 1; // Roughly. 
        // Wait, if today is Sunday, does it count as "remaining Sunday nights"? 
        // "Remaining Sunday Nights" -> If it's Sunday night right now, maybe? 
        // Let's stick to "Future instances of Sunday".
    }

    // Approx 29.53 days
    private countFullMoons(start: Date, end: Date): number {
        // We need a reference full moon.
        // Known full moon: Jan 25, 2024.
        const reference = new Date(2024, 0, 25, 12, 0, 0); // Jan is 0
        const SYNODIC_MONTH = 29.53059 * 24 * 60 * 60 * 1000;

        const diffStart = start.getTime() - reference.getTime();
        const cyclesSinceRef = Math.ceil(diffStart / SYNODIC_MONTH);

        // First full moon after start
        const firstMoonTime = reference.getTime() + (cyclesSinceRef * SYNODIC_MONTH);

        if (firstMoonTime >= end.getTime()) return 0;

        const timeRemainingFromFirst = end.getTime() - firstMoonTime;
        return 1 + Math.floor(timeRemainingFromFirst / SYNODIC_MONTH);
    }
}
