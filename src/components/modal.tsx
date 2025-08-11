import { Filter } from "./filter";

export const Modal = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-[335px] h-[678px] ">
      <Filter />
      <div className="absolute inset-x-6 top-7 z-10 space-y-4">{children}</div>
    </div>
  );
};
