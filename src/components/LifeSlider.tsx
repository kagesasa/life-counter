

interface LifeSliderProps {
  value: number;
  onChange: (val: number) => void;
}

export function LifeSlider({ value, onChange }: LifeSliderProps) {
  return (
    <div className="w-full py-6">
      <div className="flex justify-between text-xs text-gray-500 mb-2 uppercase tracking-wider">
        <span>仮に、あと何年生きるとしたら</span>
        <span className="text-white font-mono text-lg">{value} 歳まで</span>
      </div>
      <input
        type="range"
        min="0"
        max="110"
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer range-thumb-white"
        style={{ color: 'white' }}
      />
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          margin-top: -8px; 
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: #333;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
