import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { object, string, ValidationError } from "yup";

import Input from "components/common/Input";
import Button from "components/common/Button";
import routes from "constants/routes";
import regex from "constants/regex";
import YupHelper from "helpers/yup";
import setToast, { ToastType } from "helpers/setToast";
import { login, selectAuth, resetAuth } from "reduxStore/slices/auth";
import { useAppDispatch, useAppSelector } from "reduxStore";

const loginCredentialsSchema = object({
  email: string().matches(regex.email, "Please provide a valid email."),

  password: string().required("Please provide password."),
});

type LoginCredentialsDataType = {
  email: string;
  password: string;
};
const defaultData = {
  email: "",
  password: "",
};

const Login = () => {
  const [loginCredentials, setLoginCredentials] =
    useState<LoginCredentialsDataType>(defaultData);

  const [validationErrors, setValidationErrors] =
    useState<LoginCredentialsDataType>(defaultData);
  const dispatch = useAppDispatch();
  const {
    isSuccess: isLoginSuccess,
    error: loginError,
    isError: isLoginError,
    isLoading: isLoginInProgress,
  } = useAppSelector(selectAuth);

  useEffect(() => {
    if (isLoginSuccess) {
    }
    if (isLoginError) {
      setToast(loginError, ToastType.ERROR);
      dispatch(resetAuth());
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginSuccess, isLoginError, loginError]);

  const onSubmit = async () => {
    try {
      await loginCredentialsSchema.validate(loginCredentials, {
        abortEarly: false,
      });
      dispatch(login(loginCredentials));
    } catch (error) {
      //yup validation error
      setValidationErrors(
        YupHelper.extractValidationErrors<LoginCredentialsDataType>(
          error as ValidationError
        )
      );
    }
  };

  return (
    <div className="w-screen h-screen bg-blue-600 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-96 bg-white gap-y-4 p-4 rounded">
        <label className="font-semibold text-2xl">Login</label>
        <Input
          onChange={(email) =>
            setLoginCredentials((prev) => ({ ...prev, email }))
          }
          value={loginCredentials.email}
          type="email"
          placeholder="Email"
          error={validationErrors.email}
          clearError={() =>
            setValidationErrors((prev) => ({ ...prev, email: "" }))
          }
        />
        <Input
          onChange={(password) =>
            setLoginCredentials((prev) => ({ ...prev, password }))
          }
          value={loginCredentials.password}
          type="password"
          placeholder="Password"
          error={validationErrors.password}
          clearError={() =>
            setValidationErrors((prev) => ({ ...prev, password: "" }))
          }
        />
        <Button
          text="Login"
          onClick={onSubmit}
          disabled={isLoginInProgress}
          buttonClasses="w-28"
        />

        <span>
          Don't have an account?{" "}
          <Link className="text-blue-700" to={routes.signup}>
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
