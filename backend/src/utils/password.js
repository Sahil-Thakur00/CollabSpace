const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const hashPassword = (plaintext) => bcrypt.hash(plaintext, SALT_ROUNDS);

const verifyPassword = (plaintext, hash) => bcrypt.compare(plaintext, hash);

module.exports = { hashPassword, verifyPassword };
