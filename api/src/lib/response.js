const buildResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(body),
});

export const success = (body) => buildResponse(200, body);

export const badRequest = (body) => buildResponse(400, body);

export const notFound = (body) => buildResponse(404, body);

export const failure = (body) => buildResponse(500, body);
