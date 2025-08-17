import { useTooltip } from "./tooltipContext";

export const Tooltip = () => {
  const { isTooltipVisible } = useTooltip();

  return (
    <div
      id="tooltip"
      className={`tooltip absolute px-3 py-2 bg-black/75 text-white text-sm font-bold rounded-md shadow-lg transform translate-x-4 translate-y-4 z-[500] pointer-events-none ${
        isTooltipVisible ? "" : "hidden"
      }`}
    ></div>
  );
};
