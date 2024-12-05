export const MobileTable = ({
  children,
  handleOnClick,
} : {
  children: React.ReactNode,
  handleOnClick?: () => void,
}) => {
  return (
    <div
      onClick={handleOnClick}
      className="
        p-4
        border border-yellow-400
        rounded-lg shadow-md
        hover:bg-yellow-50 cursor-pointer
    ">
      {children}
    </div>
  );
};
