var string = 'nurses run';
function isPalindrome(str) {
  //  let splitString = string.split(' ');
  let initialString = string.split(' ').reduce((a, b) => {
    return a + b;
  });
  initialString = initialString.toLowerCase();
  reversedString = initialString.split('').reverse().join('');
  if (reversedString === initialString) {
    return console.log(`"${string}" is a Palindrome`);
  }
  return console.log(`"${string}" isn't a Palindrome`);
}

isPalindrome(string);

const now = new Date();
console.log(now);
