import React, { useEffect } from "react";
import Image from "next/image";

interface MessageProps {
  type: "error" | "success";
  message: string;
  onClose: () => void;
}

const Message: React.FC<MessageProps> = ({ type, message, onClose }) => {
  const isError = type === "error";
  const backgroundColor = isError ? "#FF4433" : "#43A96B";
  const title = isError ? "Помилка" : "Успіх";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col justify-center min-w-[400px] max-w-[600px]"
      style={{
        height: "120px",
        backgroundColor: backgroundColor,
        padding: "20px 24px",
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 hover:opacity-80 transition-opacity"
        aria-label="Close message"
      >
        <Image
          src="/yellow_cross.svg"
          alt="Close"
          width={24}
          height={24}
        />
      </button>

      <div className="flex flex-col gap-2 pr-8">
        <h2 className="text-white text-2xl font-normal">{title}</h2>
        <p className="text-white text-xl font-normal">{message}</p>
      </div>
    </div>
  );
};

export default Message;
