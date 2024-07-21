import { ValidationError } from "yup";

const YupHelper = {
  extractValidationErrors: <T>(
    error: ValidationError
  ): Record<keyof T, string> => {
    const errors: Partial<Record<keyof T, string>> = {};

    error.inner.forEach((e: ValidationError) => {
      // Type assertion is safe here because we're ensuring `e.path` is a key of `T`
      errors[e.path as keyof T] = e.message;
    });

    return errors as Record<keyof T, string>;
  },
};

export default YupHelper;
