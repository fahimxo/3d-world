import { createContext, useContext, useState } from 'react';

interface TooltipContextType {
  isTooltipVisible: boolean;
  setTooltipVisibility: (visible: boolean) => void;
}

export const TooltipContext = createContext<TooltipContextType>({
  isTooltipVisible: false,
  setTooltipVisibility: () => {
    return;
  },
});

export const useTooltip = () => useContext(TooltipContext);

export const TooltipProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

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
