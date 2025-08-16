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
      className={`fixed flex items-center justify-center z-50 ${
        mode === "center" && "inset-0"
      }`}
    >
      <div
        className={`${className} relative overflow-visible fixed inset-0 flex flex-col items-center justify-center`}
      >
        <div className="inset-x-6 top-7 z-10 space-y-4">{children}</div>
      </div>
    </div>
  );
};
