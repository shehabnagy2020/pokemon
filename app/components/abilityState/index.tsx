import React from "react";

type AbilityStateProps = {
  name: string;
  isHidden: boolean;
  slot: number;
};

const AbilityState: React.FC<AbilityStateProps> = ({
  name,
  isHidden,
  slot,
}) => {
  return (
    <div
      data-testid={`ability-state-${name}`}
      className="flex gap-4 text-sm items-center"
    >
      <span
        className={`rounded-3xl border-2 border-gray-200 p-2 capitalize ${isHidden ? "bg-gray-100" : ""}`}
      >
        {name}
      </span>
      {isHidden && <span className="">(Hidden)</span>}
    </div>
  );
};

export default AbilityState;
