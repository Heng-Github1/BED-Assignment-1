const validateUser = (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Add more validations below in the future as needed
    next();
};

module.exports = validateUser;
