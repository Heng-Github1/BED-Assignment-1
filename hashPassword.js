const bcrypt = require('bcryptjs'); // Import the bcryptjs library for hashing passwords

/**
 * Function to hash a plain text password
 * @param {string} plainPassword - The plain text password to hash
 * @returns {string} - The hashed password
 */
const hashPassword = async (plainPassword) => {
  const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash the plain password with a salt rounds of 10
  return hashedPassword; // Return the hashed password
};

// Example usage:
// Array of plain text passwords to be hashed
const passwords = ['Alex9401', 'Em2020', 'Password123', 'Sophia95', 'Jack1985'];

// Loop through each plain password, hash it, and log the result
passwords.forEach(async (plainPassword) => {
  const hashedPassword = await hashPassword(plainPassword); // Hash the plain password
  console.log(`Plain: ${plainPassword} -> Hashed: ${hashedPassword}`); // Log the plain and hashed passwords
});
