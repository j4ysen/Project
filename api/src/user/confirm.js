export const main = async (event, context, callback) => {
  event.response.autoConfirmUser = true; // eslint-disable-line no-param-reassign
  callback(null, event);
};
