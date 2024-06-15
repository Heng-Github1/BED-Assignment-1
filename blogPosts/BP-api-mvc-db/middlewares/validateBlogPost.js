const Joi = require("joi");

const validateBlogPost = (req, res, next) => {
  const schema = Joi.object({
    BPid: Joi.number().required(),
    content: Joi.string().min(5).required(),
    authorID: Joi.number().required()
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