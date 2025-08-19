import React, { useState, useEffect } from 'react';

interface FanbasePowerProps {
  power: number;
}

const FanbasePower: React.FC<FanbasePowerProps> = ({ power }) => {
  const totalBars = 36;
  const filledBars = Math.round((power / 100) * totalBars);

  const [segmentColors, setSegmentColors] = useState<string[]>([]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = totalBars;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createLinearGradient(0, 0, totalBars, 0);
    gradient.addColorStop(0, '#00C9FF');
    gradient.addColorStop(0.25, '#00FF00');
    gradient.addColorStop(0.5, '#FFFF00');
    gradient.addColorStop(0.75, '#FFA500');
    gradient.addColorStop(1, '#FF0000');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, totalBars, 1);

    const colors: string[] = [];
    for (let i = 0; i < totalBars; i++) {
      const pixel = ctx.getImageData(i, 0, 1, 1).data;
      colors.push(
        `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`
      );
    }
    setSegmentColors(colors);
  }, []);

  return (
    <div className="mt-4 px-4">
      <div className="h-px bg-white w-full opacity-50 mt-4.5" />
      <h3 className="text-white text-lg font-bold my-4">Fanbase Power</h3>
      <div className="flex items-center gap-2 sm:gap-4 rounded-lg bg-black bg-opacity-30 w-full max-w-[490px] mx-auto p-4">
        <div className="w-12 sm:w-16 h-10 sm:h-12 flex items-center justify-center bg-cyan-400 rounded-md flex-shrink-0">
          <span className="text-black text-xl sm:text-2xl font-bold">
            {power}
          </span>
        </div>

        <div className="flex-1 flex items-center gap-0.5 sm:gap-1">
          {Array.from({ length: totalBars }).map((_, i) => (
            <div
              key={i}
              className="w-full h-2 sm:h-3"
              style={{
                backgroundColor:
                  i < filledBars && segmentColors.length > 0
                    ? segmentColors[i]
                    : '#4A4A4A',
              }}
            />
          ))}
        </div>

        <div className="text-white text-base sm:text-lg font-bold flex-shrink-0">
          100
        </div>
      </div>
    </div>
  );
};

export default FanbasePower;
