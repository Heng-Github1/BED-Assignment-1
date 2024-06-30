const Joi = require("joi");

const validateNews = (req, res, next) => {
  const schema = Joi.object({
    headline: Joi.string().min(1).max(50).required(),
    content: Joi.string().min(3).max(255).required(),
    country: Joi.string().max(100).required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateNews;