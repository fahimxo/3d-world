export const Modal = ({
  children,
  mode = "left",
  onClose,
  className,
}: {
  children: React.ReactNode;
  mode?: string;
  onClose?: () => void;
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
        {onClose && (
          <button
            onClick={onClose}
            className="text-cyan-300 hover:text-cyan-200 absolute inset-x-6 bottom-7 z-10 space-y-4"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
