const Joi = require("joi");

const validateBlogPost = (req, res, next) => {
  const schema = Joi.object({
    content: Joi.string().min(30).required(),
    authorID: Joi.number().required(),
    bpCreated: Joi.date().iso().allow(null),
    bpModified: Joi.date().iso().allow(null)
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateBlogPost;