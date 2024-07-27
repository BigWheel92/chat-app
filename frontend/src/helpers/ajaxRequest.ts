import HttpError from "constants/HttpError";

export const Methods = {
  GET: "GET",
  POST: "POST",
} as const;

const ajaxRequest = async (
  url: string,
  method: (typeof Methods)[keyof typeof Methods],
  data: Record<string, any> | undefined = undefined
) => {
  const options: any = { method, headers: {} };
  if (data) {
    options.headers = {
      "Content-Type": "application/json",
    };
    options.body = JSON.stringify(data);
  }
  const baseUrl = `${process.env.REACT_APP_API_SERVER_URL}:${process.env.REACT_APP_API_SERVER_PORT}`;
  const fullUrl = `${baseUrl}/${url}`;
  let returnResponse: {
    status?: number;
    data?: Record<string, any>;
  } = {};
  try {
    const response = await fetch(fullUrl, options);
    const data = await response.json();

    if (!response.ok) {
      throw new HttpError(response.status, data.message, data.errors);
    }

    returnResponse = { status: response.status, data };
    return returnResponse;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Could not connect to server");
  }
};

export default ajaxRequest;
