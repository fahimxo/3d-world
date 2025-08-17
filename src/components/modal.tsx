export const Modal = ({
  children,
  mode = "left",
  className,
}: {
  children: React.ReactNode;
  mode?: string;
  className?: string;
}) => {
  return (
    <div
      className={`fixed flex items-center justify-center z-[1000] ${
        mode === "center" ? "inset-0" : ""
      }`}
    >
      <div className="fixed inset-0 bg-black/50 z-[999]" />
      <div
        className={`${className} relative overflow-visible z-[1001] flex flex-col items-center justify-center`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inset-x-6 top-7 z-[1002] space-y-4">{children}</div>
      </div>
    </div>
  );
};
