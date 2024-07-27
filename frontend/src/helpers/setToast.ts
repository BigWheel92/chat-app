import { toast } from "react-toastify";

export const ToastType = {
  INFO: 0,
  SUCCESS: 1,
  ERROR: 2,
} as const;
const setToast = (
  message: string,
  toastType: (typeof ToastType)[keyof typeof ToastType] = 0
) => {
  if (toastType === ToastType.INFO) toast.info(message);
  else if (toastType === ToastType.ERROR) toast.error(message);
  else if (toastType === ToastType.SUCCESS) toast.success(message);
};

export default setToast;
