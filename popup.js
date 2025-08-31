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
// Adding Strength
const strengthLabel = document.getElementById('strength-label');
const strengthFill = document.getElementById('strength-fill');

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

// Determining password strength/weakness
function evaluateStrength(currentPassword) {
  // Determine sets present/effective and length
  const pwd = typeof currentPassword === 'string' ? currentPassword : '';
  const len = pwd ? pwd.length : passwordLength;

  // Determine which sets are considered
  let setsCount = 1; // lowercase always enabled as per current UI
  if (pwd) {
    // Evaluate actual content
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSym = /[!@#$%^&*()_+\[\]{}|;:,.<>?]/.test(pwd);
    setsCount = (hasLower ? 1 : 0) + (hasUpper ? 1 : 0) + (hasNum ? 1 : 0) + (hasSym ? 1 : 0);
  } else {
    // Evaluate from toggles
    setsCount = 1 + (includeUppercase ? 1 : 0) + (includeNumbers ? 1 : 0) + (includeSymbols ? 1 : 0);
  }

  let level = 0;
  if (len >= 8) level++;
  if (len >= 12) level++;
  if (len >= 16) level++;
  if (setsCount >= 2) level++;
  if (setsCount >= 3) level++;

  if (level > 4) level = 4;
  if (level < 0) level = 0;

  return level;
}

function updateStrengthUI(level) {
  if (!strengthFill || !strengthLabel) return;

  // Update bar width and color class
  const width = `${(level / 4) * 100}%`;
  strengthFill.style.width = width;

  for (let i = 0; i <= 4; i++) {
    strengthFill.classList.remove(`level-${i}`);
  }
  strengthFill.classList.add(`level-${level}`);

  // Update label text
  const labels = [
    'Very weak 😞',
    'Weak 😕',
    'Normal 😐',
    'Strong 🙂',
    'Very strong 😎'
  ];
  strengthLabel.textContent = labels[level] || labels[0];
}

function updateAllStrength() {
  const pwd = passwordField.value || '';
  const level = evaluateStrength(pwd);
  updateStrengthUI(level);
}


// Generating Password
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
  updateAllStrength();
}

    const manifestData = chrome.runtime.getManifest();
    const versionElement = document.getElementById('version');
    versionElement.textContent = manifestData.version;

});