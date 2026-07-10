import Joi from 'joi';

const validationSchema = Joi.object({
  details: Joi.array(),
}).unknown(true);

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      req.validationError = {
        details: errors,
      };

      next();
    } else {
      req.validatedData = value;
      next();
    }
  };
};
