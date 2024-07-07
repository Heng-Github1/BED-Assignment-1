const Joi = require("joi");

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().max(255).required(),
    password: Joi.string().min(8).max(255).required(),
    role: Joi.string().valid("member", "librarian").optional(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    return res.status(400).json({ message: "Validation error", errors });
  }

  next();
};

module.exports = validateUser;