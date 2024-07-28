/**
 * Middleware function to validate user input during registration or update
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateUser = (req, res, next) => {
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Add more validations below in the future as needed

    // If all validations pass, proceed to the next middleware or route handler
    next();
};

module.exports = validateUser;
