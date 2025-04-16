import Link from "next/link";

type ButtonProps = {
  text: string,
  url?: string,
  type?: "button" | "submit" | "reset";
};

const buttonClassName = `
  flex items-center justify-center mx-auto
  w-full lg:w-80
  h-12 lg:h-16
  px-6 py-2
  rounded-lg
  text-xl
  bg-pink-400 text-white font-semibold 
  hover:bg-pink-500
  hover:scale-110
  focus:outline-none
  focus:ring-2
  focus:ring-pink-500
  focus:ring-offset-2 w-fit
`;

export const BasicButton = ({
  text,
  url,
  type,
} : ButtonProps) => {
  if (url) {
    return (
      <Link href={url} className={buttonClassName}>{text}</Link>
    );
  };

  if (type === 'submit') {
    return (
      <button type="submit" className={buttonClassName}>{text}</button>
    );
  }

  return null;
} 
