const crypto = require('crypto');

const LOWERCASE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = ',./<>?;\'":[]\\|}{=-_+`~!@#$%^&*()';
const ALPHANUMERIC_CHARS = LOWERCASE_ALPHABET + UPPERCASE_ALPHABET + NUMBERS;
const ALL_CHARS = ALPHANUMERIC_CHARS + SYMBOLS;

const hashSaltRounds = 10;

function generateRandomPassword(length = 15, alphabet = ALL_CHARS) {
  const rb = crypto.randomBytes(length);
  let rp = '';

  for (let i = 0; i < length; i++) {
    rb[i] %= alphabet.length;
    rp += alphabet[rb[i]];
  }
  return rp;
}

module.exports = {
  generateRandomPassword,
  hashSaltRounds,
};
