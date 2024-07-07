const Joi = require("joi");

const validateBook = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().max(255).required(),
    author: Joi.string().max(255).required(),
    availability: Joi.string().valid("Y", "N").required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    return res.status(400).json({ message: "Validation error", errors });
  }

  next(); 
};

module.exports = validateBook;