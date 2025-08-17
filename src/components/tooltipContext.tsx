import { createContext, useContext, useState } from "react";

interface TooltipContextType {
  isTooltipVisible: boolean;
  setTooltipVisibility: (visible: boolean) => void;
}

export const TooltipContext = createContext<TooltipContextType>({
  isTooltipVisible: true,
  setTooltipVisibility: () => {},
});

export const useTooltip = () => useContext(TooltipContext);

export const TooltipProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);

  return (
    <TooltipContext.Provider
      value={{
        isTooltipVisible,
        setTooltipVisibility: setIsTooltipVisible,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};
