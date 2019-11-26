export function ok(data?: object) {
  if (data) {
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } else {
    return {
      statusCode: 200
    };
  }
}

export function notFound(data?: object) {
  if (data) {
    return {
      statusCode: 404,
      body: JSON.stringify(data)
    };
  } else {
    return {
      statusCode: 404
    };
  }
}
