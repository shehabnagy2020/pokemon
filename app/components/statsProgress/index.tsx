import React from "react";

type StatsProgressProps = {
  name: string;
  value: number;
};

const StatsProgress: React.FC<StatsProgressProps> = ({ name, value }) => {
  return (
    <div data-testid={`stats-progress-${name}`} className="flex flex-col">
      <div className="flex justify-between">
        <span className="capitalize text-sm">{name}</span>
        <span className="text-sm font-bold">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-black h-4 rounded-full"
          style={{ width: `${(value / 255) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatsProgress;
