import { useAlert } from "@/context/AlertContext";

export const Alert = () => {
  const { alert, setAlert } = useAlert();
  if (!alert) { return null; }

  const handleCloseButton = () => {
    setAlert(null);
  };

  console.log(alert);
  return (
     // ×ボタン右寄にもう少し大きく
     // msgは左寄せ
     // mx-4が効かない。
    <div
      className="
        w-full p-4
        bg-red-200
        text-red-600
        font-bold
        rounded-lg
        flex items-center justify-between
    ">
      <div
        className="
          flex-1 text-left
      ">{alert.msg}</div>
      <button
        onClick={handleCloseButton}
        className="
          text-xl
          font-bold
          bg-transparent
          border-none
          hover:text-red-800
          focus:outline-none
          ml-4
        "
      >×</button>
    </div>
  );
}
