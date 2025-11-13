// Valida req.body contra un schema (Joi)
module.exports = (schema) => (req, res, next) => {
  if (!schema) return next();
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
  if (error) {
    return res.status(400).json({
      message: 'Validación fallida',
      details: error.details.map(d => ({
        path: d.path.join('.'),
        message: d.message,
      })),
    });
  }
  req.body = value;
  next();
};
