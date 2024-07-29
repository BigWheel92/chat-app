import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import HttpError from "constants/HttpError";
import routes from "constants/routes";
import ajaxRequest, { Methods } from "helpers/ajaxRequest";
import Button from "./common/Button";

const REDIRECTION_DELAY = 10;
const VerificationStatuses = {
  SUCCESSFUL: 0,
  FAILED: 1,
  IN_PROGRESS: 2,
};

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState(
    VerificationStatuses.IN_PROGRESS
  );
  const [errorMessage, setErrorMessage] = useState("");

  const navigateToLogin = () => {
    navigate(routes.login);
  };
  const [timer, setTimer] = useState(REDIRECTION_DELAY);
  useEffect(() => {
    if (verificationStatus === VerificationStatuses.SUCCESSFUL) {
      const timer = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [verificationStatus]);
  useEffect(() => {
    if (timer === 0) {
      navigateToLogin();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  useEffect(() => {
    if (token) {
      ajaxRequest(`api/user/verify/${token}`, Methods.GET)
        .then((_) => {
          setVerificationStatus(VerificationStatuses.SUCCESSFUL);
        })
        .catch((error) => {
          setVerificationStatus(VerificationStatuses.FAILED);
          setErrorMessage((error as HttpError).message);
        });
    }
  }, [token]);

  return (
    <div className="m-1">
      {verificationStatus === VerificationStatuses.IN_PROGRESS ? (
        "Verifying your email..."
      ) : verificationStatus === VerificationStatuses.FAILED ? (
        errorMessage
      ) : (
        <>
          {`Verification successful, redirecting to login screen in ${timer} seconds. `}{" "}
          <Button text="Go to Login Screen Now" onClick={navigateToLogin} />
        </>
      )}
    </div>
  );
};

export default Verify;
