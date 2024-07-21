const Button = ({
  text,
  onClick,
}: {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <button
      className="w-32 h-10 rounded bg-blue-500 text-white"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
