const invAmount = 500000;
const faceValue = 100;
const numberOfShares = 0;
console.log(numberOfShares || Math.floor(invAmount / (faceValue || 100)));
