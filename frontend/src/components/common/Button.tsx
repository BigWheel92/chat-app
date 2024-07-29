const Button = ({
  text,
  onClick,
  disabled,
}: {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}) => {
  return (
    <button
      className={`p-2 rounded bg-blue-500 text-white ${
        disabled ? "bg-gray-500 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
