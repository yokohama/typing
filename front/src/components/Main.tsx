export const Main = ({
  children,
} : {
  children: React.ReactNode,
}) => {
  return (
    <main 
      className="
        p-6
        w-full max-w-4xl 
    ">{children}</main>
  );
};
