import { useAlert } from "@/context/AlertContext";

export const Alert = () => {
  const { alerts, setAlerts } = useAlert();
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const handleCloseButton = (index: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  };

  const alertStyle = {
    error: {
      bgColor: "bg-red-200",
      textColor: "text-red-600",
      hoverColor: "hover:text-red-800",
    },
    success: {
      bgColor: "bg-green-200",
      textColor: "text-green-600",
      hoverColor: "hover:text-green-800",
    },
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => {
        const { bgColor, textColor, hoverColor } = alertStyle[alert.type] || {};
        return (
          <div
            key={index}
            className={`
              w-full p-4
              ${bgColor}
              ${textColor}
              font-bold
              rounded-lg
              flex items-center justify-between
          `}>
            <div className="flex-1 text-left">{alert.msg}</div>
            <button
              onClick={() => handleCloseButton(index)}
              className={`
                text-xl
                font-bold
                bg-transparent
                border-none
                ${hoverColor}
                focus:outline-none
                ml-4
              `}
            >×</button>
          </div>
        );
      })}
    </div>
  );
}
