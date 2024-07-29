const Button = ({
  text,
  onClick,
  buttonClasses,
  disabled,
}: {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonClasses?: string;
  disabled?: boolean;
}) => {
  return (
    <button
      className={`p-2 rounded bg-blue-500 text-white ${
        disabled ? "bg-gray-500 cursor-not-allowed" : ""
      } ${buttonClasses || ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
