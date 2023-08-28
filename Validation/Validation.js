const fs = require('fs/promises');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const USER_DATA_FILE = 'users.json';

let users = [];

async function loadUsers() {
  try {
    const data = await fs.readFile(USER_DATA_FILE, 'utf-8');
    users = JSON.parse(data);
  } catch (error) {
    console.log('Error reading user data file:', error);
  }
}

function saveUsers() {
  fs.writeFile(USER_DATA_FILE, JSON.stringify(users))
    .then(() => console.log('User data saved successfully!'))
    .catch((error) => console.log('Error writing user data to file:', error));
}

async function promptUser(question, validationFn) {
  while (true) {
    const userInput = await askQuestion(question);
    const error = validationFn(userInput);
    if (!error) return userInput;
    console.log(error);
  }
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function validateInput(input, fieldName) {
  if (!input.trim()) {
    return `${fieldName} is required`;
  }
  return null;
}

function validateEmail(email) {
  if (!validateInput(email, 'Email')) {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return 'Invalid Email';
    return null;
  }
  return 'Email is required';
}

function validateZipcode(zipcode) {
  if (!validateInput(zipcode, 'Zipcode')) {
    const zipcodeRegex = /^\d{5}$/;
    if (!zipcodeRegex.test(zipcode)) return 'Invalid Zipcode';
    return null;
  }
  return 'Zipcode is required';
}

function validatePhoneNumber(phoneNumber) {
  if (!validateInput(phoneNumber, 'Phone Number')) {
    const phoneNumberRegex = /^(\+\d{1,2}\s?)?(\(\d{3}\)\s?|\d{1,2}\(\d{3}\)\s?)?\d{3}-?\d{4}$/;
    if (!phoneNumberRegex.test(phoneNumber)) return 'Invalid Phone Number';
    return null;
  }
  return 'Phone Number is required';
}

async function createUser() {
  const firstName = await promptUser('Enter First Name: ', (input) => validateInput(input, 'First Name'));
  const lastName = await promptUser('Enter Last Name: ', (input) => validateInput(input, 'Last Name'));
  const email = await promptUser('Enter Email: ', validateEmail);
  const address = await promptUser('Enter Address: ', (input) => validateInput(input, 'Address'));
  const city = await promptUser('Enter City: ', (input) => validateInput(input, 'City'));
  const state = await promptUser('Enter State: ', (input) => validateInput(input, 'State'));
  const zipcode = await promptUser('Enter Zipcode: ', validateZipcode);
  const phoneNumber = await promptUser('Enter Phone Number: ', validatePhoneNumber);
  const password = await promptUser('Enter Password: ', (input) => validateInput(input, 'Password'));

  const newUser = {
    firstName,
    lastName,
    email,
    address,
    city,
    state,
    zipcode,
    phoneNumber,
    password,
  };

  users.push(newUser);
  saveUsers();
}

function readUsers() {
  if (users.length === 0) {
    console.log('No users found');
  } else {
    console.log('List of users:');
    users.forEach((user) => {
      console.log('------------------------');
      console.log(`Name: ${user.firstName} ${user.lastName}`);
      console.log(`Email: ${user.email}`);
      console.log(`Address: ${user.address}`);
      console.log(`City: ${user.city}`);
      console.log(`State: ${user.state}`);
      console.log(`Zipcode: ${user.zipcode}`);
      console.log(`Phone Number: ${user.phoneNumber}`);
    });
    console.log('------------------------');
  }
}

async function updateUser() {
  const email = await promptUser('Enter the email of the user to update: ', validateEmail);
  const userIndex = users.findIndex((user) => user.email === email);
  if (userIndex === -1) {
    console.log('User not found');
    return;
  }

  console.log('Enter new user details:');
  const firstName = await promptUser('First Name: ', (input) => validateInput(input, 'First Name'));
  const lastName = await promptUser('Last Name: ', (input) => validateInput(input, 'Last Name'));
  const address = await promptUser('Address: ', (input) => validateInput(input, 'Address'));
  const city = await promptUser('City: ', (input) => validateInput(input, 'City'));
  const state = await promptUser('State: ', (input) => validateInput(input, 'State'));
  const zipcode = await promptUser('Zipcode: ', validateZipcode);
  const phoneNumber = await promptUser('Phone Number: ', validatePhoneNumber);
  const password = await promptUser('Password: ', (input) => validateInput(input, 'Password'));

  users[userIndex] = {
    ...users[userIndex],
    firstName,
    lastName,
    address,
    city,
    state,
    zipcode,
    phoneNumber,
    password,
  };

  saveUsers();
}

function displayMenu() {
  console.log('1. Create a User');
  console.log('2. Read Users');
  console.log('3. Update a User');
  console.log('4. Exit');
}

async function startCLI() {
  await loadUsers();
  displayMenu();

  rl.question("", (input) => {
    const option = input.trim();
    switch (option) {
      case '1':
        createUser();
        break;
      case '2':
        readUsers();
        break;
      case '3':
        updateUser();
        break;
      case '4':
        rl.close();
        break;
      default:
        console.log('Invalid option');
        displayMenu();
        break;
    }
  });

  rl.on('close', () => {
    console.log('Exiting User Management CLI');
    process.exit(0);
  });
}

startCLI();