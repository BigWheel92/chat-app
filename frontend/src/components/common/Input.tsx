import { useState } from "react";
import { ReactComponent as EyeIcon } from "assets/svgs/eye.svg";
import { ReactComponent as EyeIconOff } from "assets/svgs/eye-off.svg";

const Input = ({
  onChange,
  value,
  placeholder,
  type,
  error,
  clearError,
}: {
  onChange: (arg: string) => void;
  value: string;
  placeholder?: string;
  type: "email" | "text" | "password";
  error?: string;
  clearError?: () => void;
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-y-1 w-full">
      <div
        className={`flex justify-between border border-solid ${
          error ? "border-red-500" : "border-gray-500"
        } w-full px-2 py-1 rounded outline-blue-400`}
      >
        <input
          onChange={(e) => {
            onChange(e.target.value);
            if (error) clearError?.();
          }}
          value={value}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className={`${
            type === "password" ? "w-[88%]" : "w-full"
          } outline-none bg-transparent`}
        />

        {type === "password" &&
          (showPassword ? (
            <EyeIcon
              className="hover:cursor-pointer"
              onClick={() => {
                setShowPassword(false);
              }}
            />
          ) : (
            <EyeIconOff
              className="hover:cursor-pointer"
              onClick={() => {
                setShowPassword(true);
              }}
            />
          ))}
      </div>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};
export default Input;
