import React from "react";

type ViewOptionsControlsProps = {
  activeView: "pageControls" | "infiniteScroll";
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  setActiveView: React.Dispatch<
    React.SetStateAction<"pageControls" | "infiniteScroll">
  >;
};

const ViewOptionsControls: React.FC<ViewOptionsControlsProps> = ({
  activeView,
  setOffset,
  setActiveView,
}) => {
  const handleViewChange = (view: "pageControls" | "infiniteScroll") => {
    setActiveView(view);
    setOffset(0);
  };

  return (
    <div className="flex gap-3 text-sm" data-testid="view-options-controls">
      <button
        data-testid="page-controls-button"
        className={`cursor-pointer p-2 rounded-md capitalize border-gray-200 ${
          activeView === "pageControls"
            ? "bg-black text-white"
            : "bg-white border-2"
        }`}
        onClick={() => handleViewChange("pageControls")}
      >
        page controls
      </button>
      <button
        data-testid="infinite-scroll-button"
        className={`cursor-pointer p-2 rounded-md capitalize border-gray-200 ${
          activeView === "infiniteScroll"
            ? "bg-black text-white"
            : "bg-white border-2"
        }`}
        onClick={() => handleViewChange("infiniteScroll")}
      >
        infinite scroll
      </button>
    </div>
  );
};

export default ViewOptionsControls;
