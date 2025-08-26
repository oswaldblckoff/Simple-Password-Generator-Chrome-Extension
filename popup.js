document.addEventListener('DOMContentLoaded', () => {
const passwordField = document.getElementById('password');
const copyBtn = document.getElementById('copy-btn');
const generateBtn = document.getElementById('generate-btn');
const uppercaseBtn = document.getElementById('uppercase-btn');
const numbersBtn = document.getElementById('numbers-btn');
const symbolsBtn = document.getElementById('symbols-btn');
const feedback = document.querySelector('.copy-feedback');
// Adding Password Length
const lengthRange = document.getElementById('length-range');
const lengthValue = document.getElementById('length-value');
// Adding Password History
const historyList = document.getElementById('history-list');

let includeUppercase = true;
let includeNumbers = true;
let includeSymbols = true;
let passwordLength = parseInt(lengthRange.value, 10);
let lastPasswords = []; // Pasword History Massive


// Update display when moving length
lengthRange.addEventListener('input', () => {
  passwordLength = parseInt(lengthRange.value, 10);
  lengthValue.textContent = passwordLength;
});


uppercaseBtn.addEventListener('click', () => {
  includeUppercase = !includeUppercase;
  uppercaseBtn.classList.toggle('active');
});

numbersBtn.addEventListener('click', () => {
  includeNumbers = !includeNumbers;
  numbersBtn.classList.toggle('active');
});

symbolsBtn.addEventListener('click', () => {
  includeSymbols = !includeSymbols;
  symbolsBtn.classList.toggle('active');
});

generateBtn.addEventListener('click', generatePassword);

copyBtn.addEventListener('click', () => {
  const password = passwordField.value;
  if (!password) return;   // İf Password box = empty, do nothing!

  // Add to history
  lastPasswords.unshift(password);
  if (lastPasswords.length > 1) lastPasswords.pop();
  updateHistoryDisplay();
  // Coping in buffer 
  navigator.clipboard.writeText(password).then(() => {
    feedback.classList.add('show');   // Show notification

    // Hide notification after 1.5 sec
    setTimeout(() => {
      feedback.classList.remove('show');
    }, 1500);
  }).catch(err => {
    console.error('Copy ERROR: ', err);
  });
});

// UPD History
function updateHistoryDisplay() {
  historyList.innerHTML = '';
  lastPasswords.forEach(pwd => {
    const li = document.createElement('li');
    li.textContent = pwd;

    li.style.cursor = 'pointer'; // Changing cursor on ponter while hovering
    li.title = 'Press to copy!'; // Addingtitle

    // Adding click on every element
    li.addEventListener('click', () => {
      navigator.clipboard.writeText(pwd).then(() => {
        // Showing notification
        feedback.classList.add('show');
        // Hide notification after 1.5 sec
        setTimeout(() => {
          feedback.classList.remove('show');
        }, 1500);
      }).catch(err => {
        console.error('ERROR: ', err);
      });
    });

    historyList.appendChild(li);
  });
}

function generatePassword() {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

  let charset = lowercaseChars;
  if (includeUppercase) charset += uppercaseChars;
  if (includeNumbers) charset += numberChars;
  if (includeSymbols) charset += symbolChars;

  let password = '';
  for (let i = 0; i < passwordLength; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  passwordField.value = password;
}

    const manifestData = chrome.runtime.getManifest();
    const versionElement = document.getElementById('version');
    versionElement.textContent = manifestData.version;

});