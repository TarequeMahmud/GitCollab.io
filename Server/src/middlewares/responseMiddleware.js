const responseMiddleware = (req, res, next) => {
  res.notFound = async (msg) => {
    return res.status(404).json({
      message: msg || "The requested resource is not found.",
    });
  };
  res.success = async (statusOrData, objectOrMsg) => {
    let status = 200;
    let response = {};
    if (typeof statusOrData === "number") {
      status = statusOrData;
      response =
        typeof objectOrMsg === "string"
          ? { message: objectOrMsg }
          : objectOrMsg || {};
    } else {
      response =
        typeof statusOrData === "string"
          ? { message: statusOrData }
          : statusOrData || {};
    }

    return res.status(status).json(response);
  };

  res.error = async (status, msg) => {
    return res.status(status).json({
      message: msg,
    });
  };

  next();
};

export default responseMiddleware;
