import ViewOptionsControls from "~/components/viewOptionControls";
import { useState } from "react";
import { AiFillThunderbolt } from "react-icons/ai";

export default function Home() {
  const [offset, setOffset] = useState(0);

  const [activeView, setActiveView] = useState<
    "pageControls" | "infiniteScroll"
  >("pageControls");

  return (
    <div
      className={`min-h-[100vh] ${
        activeView === "pageControls" ? "bg-[#e9efff]" : "bg-[#edfdf3]"
      }`}
    >
      <div className="flex flex-col gap-4 p-4 items-center w-full container mx-auto">
        <h1 className="flex items-center gap-2 font-bold text-3xl">
          <AiFillThunderbolt />
          Pokédex
        </h1>
        <p className="text-gray-600 text-sm">
          Discover and explore Pokemon with page controls
        </p>
        <ViewOptionsControls
          setOffset={setOffset}
          activeView={activeView}
          setActiveView={setActiveView}
        />
      </div>
    </div>
  );
}
