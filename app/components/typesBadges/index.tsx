import React from "react";

type TypesBadgeProps = {
  types: { slot: number; type: { name: string; url: string } }[];
};

const TypesBadge: React.FC<TypesBadgeProps> = ({ types }) => {
  return (
    <div data-testid="types-badge-component" className="flex gap-2 flex-wrap">
      {types.map((typeEntry, idx) => (
        <span
          data-testid={`type-badge-${typeEntry.type.name}`}
          key={idx}
          className="capitalize bg-red-500 px-2 rounded-2xl text-white text-sm"
        >
          {typeEntry.type.name}
        </span>
      ))}
    </div>
  );
};

export default TypesBadge;
