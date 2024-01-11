export const randomGenerator = (): string => {
  let alphabeticString = '';
  const asciiCodeForA = 65;
  const totalAlphabets = 26;
  for (let i = 0; i < 4; i++) {
    // Generate random number between 0 and 26.
    const randomNumber = Math.floor(Math.random() * totalAlphabets);
    const character = String.fromCharCode(asciiCodeForA + randomNumber);
    alphabeticString += character;
  }

  let numericString = '';
  for (let i = 0; i < 4; i++) {
    const randomNumber = Math.floor(Math.random() * (10));
    numericString += randomNumber;
  }

  return alphabeticString + numericString;
};