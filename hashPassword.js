const bcrypt = require('bcryptjs');

const hashPassword = async (plainPassword) => {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  return hashedPassword;
};

// Example usage:
const passwords = ['Alex9401', 'Em2020', 'Password123', 'Sophia95', 'Jack1985'];

passwords.forEach(async (plainPassword) => {
  const hashedPassword = await hashPassword(plainPassword);
  console.log(`Plain: ${plainPassword} -> Hashed: ${hashedPassword}`);
});
