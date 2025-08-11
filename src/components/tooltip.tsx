export const Tooltip: React.FC = () => {
  return (
    <div
      id="tooltip"
      className="hidden 
        absolute 
        px-3 py-2 
        bg-black/75 
        text-white text-sm 
        font-bold 
        rounded-md 
        shadow-lg 
        pointer-events-none 
        transform 
        translate-x-4 
        translate-y-4 z-10"
    ></div>
  );
};
