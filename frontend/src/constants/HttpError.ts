class HttpError extends Error {
  status: number;
  errors: Array<string> | undefined;
  constructor(status: number, message: string, errors?: Array<string>) {
    super(message);
    this.status = status;
    if (errors) this.errors = errors;
  }
}
export default HttpError;
