'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// MOBILE BANKING WEBSITE

// Data
const account1 = {
  owner: 'Ayobami Owoeye',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};
const account2 = {
  owner: 'Chima Francis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Esther Ojile',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Helen Nneka',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// DISPLAYING BALANCE
const displayBalance = function (account) {
  account.balance = account.movements.reduce(function (acc, movement) {
    return acc + movement;
  }, 0);
  labelBalance.textContent = `${account.balance} NGN`;
};

// DISPLAYING MOVEMENTS
const displayMovement = function (movements) {
  // console.log(containerMovements.innerHTML);
  // console.log(containerMovements.textContent);
  // Clear element(s) in a particular element
  containerMovements.innerHTML = '';
  movements.forEach(function (movement, index) {
    const statement = movement > 0 ? 'deposit' : 'withdrawal';
    const htmlElement = `<div class="movements__row">
  <div class="movements__type movements__type--${statement}">${
      index + 1
    } ${statement}</div>
  <div class="movements__value">${movement} &#8358</div>
</div>`;

    // CREATING DOM ELEMENTS WITH JAVASCRIPT - insert Adjacent HTML method takes two argument(1. Position, 2. Element/Text to be inserted)
    containerMovements.insertAdjacentHTML('afterbegin', htmlElement);
  });
};

// COMPUTING USERS' NAMES
const createUserName = function (userAccounts) {
  userAccounts.forEach(function (userAccount) {
    // console.log(userAccount);
    userAccount.userName = userAccount.owner
      .toLowerCase()
      .split(' ')
      .map(name => name.at(0))
      .join('');
  });
};
createUserName(accounts);
// console.log(accounts);

// COMPUTING TRANSACTION SUMMARY
const completeSummary = function (movements, rates) {
  const income = movements
    .filter(move => move > 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumIn.textContent = `${income} NGN`;
  const expenses = movements
    .filter(move => move < 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumOut.textContent = `${Math.abs(expenses)} NGN`;
  const interest = movements
    .filter(move => move > 0)
    .map(deposit => (deposit * rates) / 100)
    .filter(move => move >= 1)
    .reduce((acc, move) => acc + move, 0);
  labelSumInterest.textContent = `${interest} NGN`;
};

//UPDATING UI
const updateUI = function (accounts) {
  displayMovement(accounts.movements);
  completeSummary(accounts.movements, accounts.interestRate);
  displayBalance(accounts);
};

//IMPLEMENTING LOGIN
let currentAcc;
btnLogin.addEventListener('click', function (e) {
  // console.log('LOGIN'); //it flashes because the button is in form tag
  e.preventDefault(); //it prevents the flashing
  // console.log('LOGIN');
  currentAcc = accounts.find(
    account => inputLoginUsername.value === account.userName
  );
  // console.log(currentAcc);
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    //DISPLAY UI & WELCOME MESSAGE
    labelWelcome.textContent = `Welcome ${currentAcc.owner.split(' ').at(0)}`;
    containerApp.style.opacity = 1;
    inputLoginPin.value = ' ';
    inputLoginUsername.value = ' ';
    updateUI(currentAcc);
  }
});

//IMPLEMENTING TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recipientAcc = accounts.find(
    accounts => inputTransferTo.value === accounts.userName
  );
  if (
    amount > 0 &&
    recipientAcc &&
    currentAcc.balance >= amount &&
    currentAcc.userName !== recipientAcc.userName
  ) {
    currentAcc.movements.push(-amount);
    recipientAcc.movements.push(amount);
    updateUI(currentAcc);
    inputTransferTo.value = ' ';
    inputTransferAmount.value = ' ';
  }
});

//DELETING AN ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAcc.userName === inputCloseUsername.value &&
    currentAcc.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      account => account.userName === currentAcc.userName
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputClosePin.value = ' ';
    inputCloseUsername.value = ' ';
  }
});

//IMPLEMENTING LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAcc.movements.some(move => move >= amount / 10)) {
    currentAcc.movements.push(amount);
    updateUI(currentAcc);
  }
});

//GETTING ALL THE MOVEMENTS
const accountsMovements = accounts.map(acct => acct.movements).flat().reduce((acc, move) => acc + move, 0)
console.log(accountsMovements);

// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['NGN', 'Nigerian Naira'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// SIMPLE ARRAY METHOD

// Slice Method - doesn't change the array
// let arr =['a', 'b', 'c', 'd', 'e']
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-1));
// console.log(arr.slice());//create shadow copy
// console.log([...arr]);

// Splice Method - changes the array
// let arr2 = ['a', 'b', 'c', 'd', 'e']
// console.log(arr2.splice(3));
// console.log(arr2);

// Reverse Method- changes the array
// let arr3 = ['j','i','h','g','f']
// console.log(arr3.reverse());
// console.log(arr3);

// Concat Method - doesn't change the array
// let firstLetter = ['a', 'b', 'c', 'd']
// let secondLetter = ['e', 'f', 'g', 'h']
// let letters = firstLetter.concat(secondLetter)
// console.log(letters);
// console.log(...firstLetter, ...secondLetter);

// Join Method
// let firstLetter = ['a', 'b', 'c', 'd']
// let secondLetter = ['e', 'f', 'g', 'h']
// let letters = firstLetter.concat(secondLetter)
// console.log(letters.join('-'));

// At Method - Getting element in an array
// const arr = [20, 40, 60]
// console.log(arr[0]);
// console.log(arr.at(0));
// console.log(arr[arr.length-1]);
// console.log(arr.at(-1));
// console.log('Idyllic'.at(0)); //At Method on Strings

// FOR EACH METHOD - is a higher order function
// const movements= [200, 450, -400, 3000, -650, -130, 70, 1300]
// for(const [index, movement] of movements.entries()){
//   movement>0?console.log(`Movement ${index+1}: You deposited ${movement}`): console.log(`Movement ${index+1}: You withdrew ${Math.abs(movement)}`)
//   // movement>0?console.log(`You deposited ${movement}`): console.log(`You withdrew ${-movement}`)
// }
// movements.forEach(function(movement, index, array){
//   // at each iteration, the current element is First argument, index as second argument and the array is the third argument
//   movement>0?console.log(`Movement ${index+1}: You deposited ${movement}`): console.log(`Movement ${index+1}: You withdrew ${Math.abs(movement)}`)
// })
// Difference between For each method and for of is that For each method doesn't understand break and continue statement

// FOR OF METHOD WITH MAP AND SET
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['NGN', 'Nigerian Naira'],
//   ['GBP', 'Pound sterling'],
// ]);
// console.log(currencies);
// currencies.forEach(function(value, key){
//   console.log(`${key}: ${value}`);
// })
// const currenciesSet = new Set(['USD','NGN', 'GBP', 'CAD', 'USD', 'NGN']);
// console.log(currenciesSet)
// currenciesSet.forEach(function(value){
//   console.log(value);
// })

/////////////////////////////////////////////////

/* 
Ciroma and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsCiroma' and 'dogsKate'), and does the following things:

1. Ciroma found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Ciroma's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Ciroma's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Ciroma's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Ciroma's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const checkDogs = function(dogsCiroma, dogsKate){
//   const dogsCiromaCopy = [...dogsCiroma]
//   dogsCiromaCopy.splice(0,1)
//   dogsCiromaCopy.splice(-2)
// console.log(dogsCiromaCopy);
// const dogs = dogsCiromaCopy.concat(dogsKate)
// console.log(dogs);
// dogs.forEach(function(data, index){
// const age = data>=3? `adult` : `puppy`;
// console.log(age);
// data>=3 ? console.log(`Dog number ${index+1} is an ${age}, and is ${data} years old`) : console.log(`Dog number ${index+1} is still a ${age}, and is ${data} years old`)
// console.log(`Dog number ${index+1} is an ${age}, and is ${data} years old`)
//   })
// }
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3])
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4])

// DATA TRANSFORMATION => MAP, FILTER AND REDUCE METHOD
// MAP METHOD - used to loop an array and difference between map method and for each method is that map returns new array
// const USD_NGN = 850;
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const movementNGNMap = movements.map(function (movement) {
//   return movement * USD_NGN;
// });
// console.log(movementNGNMap);
// const movementNGNMapArrwFunc = movements.map(movement => movement * USD_NGN);
// console.log(movementNGNMapArrwFunc);

// movements.forEach(function (movement) {
//   console.log(movement * USD_NGN);
// });

// const result = [];
// for(const movement of movements){
//   const innerResult = movement * USD_NGN
//   result.push(innerResult)
// }
// console.log(result);

// const movementDescriptions = movements.map((movement, index, arr) =>{
//  const statement = movement>0? 'deposited' : 'withdrew'
//  return `Movement ${index+1}: You ${statement} ${Math.abs(movement)}`
// })
// console.log(movementDescriptions);

// const user = 'Ayobami Owoeye' //ao
// const userName = user.toLowerCase().split(' ').map(function(name){
//   return name.at(0);
// }).join('');
// console.log(userName)

// FILTER METHOD - loops through array too
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const depositsFilter = movements.filter(function (move) {
//   return move > 0; //return the condition
// });
// console.log(depositsFilter);

// const depositsFor = []
// for(const movement of movements){
//   if(movement>0){
//     depositsFor.push(movement)
//   }
// }
// console.log(depositsFor);

// REDUCE METHOD - does not return array but boils it to single value
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const balance = movements.reduce(function(accum,movement, index, arr){
//   return accum + movement
// },0)
// console.log(balance);

// let sum = 0;
// for (const movement of movements) {
//   sum += movement;
// }
// console.log(sum);

//METHOD CHAINING
//CLASSWORK - get all deposits and convert them to NGN
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const USD_NGN = 850
// const conversion = movements.filter(move => move > 0).map( move => move * USD_NGN).reduce((acc, move) => acc + move,0)
// console.log(movements);
// console.log(conversion);

//WEEK 22 ASSIGNMENT
/* 
Let's go back to Ciroma and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.
Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:
1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets
TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]
GOOD LUCK 😀
*/
/*const calcAverageHumanAge = function(ages){
  let humanAge = 0
 let calc = ages.map(age => age <=2 ? humanAge = 2 * age : humanAge = 16 + age * 4).filter(age => age >= 18).reduce((acc, age, _, arr) => acc + age / arr.length,0).toFixed()
 console.log(calc);
}
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3])
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4])*/

//FIND METHOD - retrieve an element from an array based on a condition, also loops array but returns just a single element while FILTER returns many elements, doesn't return array
/*const movements = [
  200, 450, -400, 3000, -650, -130, 70, 1300,
]; // loop through and get the FIRST withdrawal
const firstWithdrawal = movements.find(movement => movement < 0);
console.log(firstWithdrawal);*/

//FIND INDEX METHOD - same way as find method but returns the index of the first element that meets the condition
/*const movements = [
  200, 450, -400, 3000, -650, -130, 70, 1300,
];
const firstWithdrawalIndex = movements.findIndex(move => move < 0)
console.log(firstWithdrawalIndex);*/

//SOME AND EVERY METHOD
/*const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// console.log(movements.includes(-130));
//To know if there's any deposit
const anyDeposit = movements.some(move => move > 0);
console.log(anyDeposit);
//To know if everything is deposit
const helenMovements = [430, 1000, 700, 50, 90];
const everyDeposit = helenMovements.every(move => move < 0);
console.log(everyDeposit);*/

//FLAT & FLAT MAP METHOD
/*const nestedArr = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(nestedArr);
console.log(nestedArr.flat());
const deepNestedArr = [
  [1, [2, 3]],
  [4, [5, 6]],
  [7, [8, 9]],
];
console.log(deepNestedArr);
console.log(deepNestedArr.flat());
console.log(deepNestedArr.flat(2));
const deepNestedArrMap = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
const flatMap = deepNestedArrMap.flatMap(num => num).reduce((acc, num) => num + acc, 0)
console.log(flatMap);*/

//SORT METHOD
// const bankOwners = ['Ayo', 'Ciroma', 'Kate', 'Bayo', 'Dumebi']
// console.log(bankOwners);
// console.log(bankOwners.sort()); //It mutates
// console.log(bankOwners);
// const arr = [74, 18, 10, 5, 84, 24,185]
// console.log(arr.sort(compareFunction));
// function compareFunction (a,b){
//   //if what you are returning from compareFunction is (i) < 0, then a comes b4 b, (ii) = 0, nothing changes, (iii) > 0, b comes b4 a
//   return b - a
// }
// const movements = [
//   200, 450, -400, 3000, -650, -130, 70, 1300,
// ]
// console.log(movements);
// console.log(movements.sort((a,b) =>{
//   if(a>b){
//     return 1
//   }
//   else{
//     return -1
//   }
// }));








