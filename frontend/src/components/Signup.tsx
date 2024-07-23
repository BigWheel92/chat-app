import { Link } from "react-router-dom";
import { useState } from "react";
import { ref, object, string, ValidationError } from "yup";

import Input from "components/common/Input";
import Button from "components/common/Button";
import routes from "constants/routes";
import regex from "constants/regex";
import YupHelper from "helpers/yupHelper";

const signupSchema = object({
  username: string()
    .required()
    .test(
      "len",
      "Username must have at least 4 characters",
      (val) => val.length >= 4
    ),
  email: string().matches(regex.email, "Please provide a valid email."),

  password: string()
    .required("Please provide password.")
    .matches(
      regex.passwordRegex,
      "Password must contain at least 8 characters with at least one uppercase letter, one lowercase letter, one digit, and one special character."
    ),
  confirmPassword: string()
    .oneOf([ref("password")], "Passwords do not match.")
    .required("Please confirm your password."),
});

type SignupDataType = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const defaultData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Signup = () => {
  const [signupData, setSignupCredentials] =
    useState<SignupDataType>(defaultData);

  const [validationErrors, setValidationErrors] =
    useState<SignupDataType>(defaultData);

  const onSubmit = () => {
    signupSchema
      .validate(signupData, { abortEarly: false })
      .then(() => {})
      .catch((error: ValidationError) => {
        setValidationErrors(
          YupHelper.extractValidationErrors<SignupDataType>(error)
        );
      });
  };

  return (
    <div className="w-screen h-screen bg-blue-600 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-96 bg-white gap-y-4 p-4 rounded">
        <label className="font-semibold text-2xl">Signup</label>

        <Input
          onChange={(username) =>
            setSignupCredentials((prev) => ({ ...prev, username }))
          }
          value={signupData.username}
          type="text"
          placeholder="Username"
          error={validationErrors.username}
          clearError={() =>
            setValidationErrors((prev) => ({ ...prev, username: "" }))
          }
        />

        <Input
          onChange={(email) =>
            setSignupCredentials((prev) => ({ ...prev, email }))
          }
          value={signupData.email}
          type="email"
          placeholder="Email"
          error={validationErrors.email}
          clearError={() =>
            setValidationErrors((prev) => ({ ...prev, email: "" }))
          }
        />
        <Input
          onChange={(password) =>
            setSignupCredentials((prev) => ({ ...prev, password }))
          }
          value={signupData.password}
          type="password"
          placeholder="Password"
          error={validationErrors.password}
          clearError={() =>
            setValidationErrors((prev) => ({ ...prev, password: "" }))
          }
        />

        <Input
          onChange={(confirmPassword) =>
            setSignupCredentials((prev) => ({ ...prev, confirmPassword }))
          }
          value={signupData.confirmPassword}
          type="password"
          placeholder="Confirm password"
          error={validationErrors.confirmPassword}
          clearError={() =>
            setValidationErrors((prev) => ({ ...prev, confirmPassword: "" }))
          }
        />
        <Button text="Signup" onClick={onSubmit} />

        <span>
          Already have an account?{" "}
          <Link className="text-blue-700" to={routes.login}>
            Login
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Signup;
