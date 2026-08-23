const normalizeFieldErrors = (payloadErrors) => {
  if (!payloadErrors) return {};
  if (!Array.isArray(payloadErrors)) return {};

  return payloadErrors.reduce((acc, issue) => {
    if (issue?.field && !acc[issue.field]) {
      acc[issue.field] = issue.message;
    }
    return acc;
  }, {});
};

const buildApiError = (message, { status = 0, fieldErrors = {} } = {}) => {
  const error = new Error(message);
  error.status = status;
  error.fieldErrors = fieldErrors;
  error.handled = true;
  return error;
};

const getFallbackMessage = (error) => {
  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please try again.';
  }
  if (error.code === 'ERR_NETWORK') {
    return 'Cannot reach the server. Please make sure the API is running.';
  }
  if (error.response && error.response.status >= 500) {
    return 'Something went wrong on our end. Please try again later.';
  }
  return 'Unable to complete the request. Please try again.';
};

export const normalizeAxiosError = (error) => {
  const payload = error.response?.data;
  const status = error.response?.status ?? 0;
  const message =
    (payload && typeof payload === 'object' && payload.message) || getFallbackMessage(error);

  return buildApiError(message, {
    status,
    fieldErrors: normalizeFieldErrors(payload?.errors),
  });
};
