const bcrypt = require('bcrypt');

const storedHash = '$2b$10$Oo7/avho8eXFW/9b3qLBc.tNXK2Yb.r7HthWQ/SULjqvVC6paH7J.';
const password = 'Eddy@2023';

console.log('Testing password:', password);
console.log('Stored hash:', storedHash);

bcrypt.compare(password, storedHash, (err, result) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Password matches:', result);
  }
});
