export const generateRandomPassword = (length: number): string => {
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  let password = '';
  password += upperChars[Math.floor(Math.random() * upperChars.length)];
  password += lowerChars[Math.floor(Math.random() * lowerChars.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];

  for (let i = 0; i < length - 3; i++) {
    const characters = upperChars + lowerChars + numbers;
    password += characters[Math.floor(Math.random() * characters.length)];
  }

  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};
