import { useLocalStorage } from './hooks/useLocalStorage';
import { useLifeStats } from './hooks/useLifeStats';
import { InitialSetup } from './components/InitialSetup';
import { Dashboard } from './components/Dashboard';
import type { UserSettings } from './logic/lifeCalculator';

// Default settings if nothing is stored (should trigger setup)
const DEFAULT_SETTINGS: UserSettings = {
  birthDate: '',
  lifespanYears: 85,
  dailySleepHours: 7,
  dailyWorkHours: 8,
};

function App() {
  const [settings, setSettings] = useLocalStorage<UserSettings>('life-counter-settings', DEFAULT_SETTINGS);

  // Hook handles calculations based on current settings
  // If birthDate is empty, stats might be invalid, but we won't show Dashboard.
  const stats = useLifeStats(settings);

  const handleSetupComplete = (data: { birthDate: string; sleep: number; work: number; lifespan: number }) => {
    setSettings({
      birthDate: data.birthDate,
      lifespanYears: data.lifespan,
      dailySleepHours: data.sleep,
      dailyWorkHours: data.work,
    });
  };

  const handleLifespanUpdate = (years: number) => {
    setSettings((prev) => ({
      ...prev,
      lifespanYears: years,
    }));
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // If no birthdate, we assume first run
  if (!settings.birthDate) {
    return <InitialSetup onComplete={handleSetupComplete} />;
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black">
      <Dashboard
        stats={stats}
        settings={settings}
        onUpdateLifespan={handleLifespanUpdate}
        onReset={handleReset}
      />
    </div>
  );
}

export default App;
