export const Label = ({ text } : { text: string }) => {
  return(
    <label 
      htmlFor="name" 
      className="
        text-gray-700 
        text-lg font-semibold
    ">{text}</label>
  );
}
