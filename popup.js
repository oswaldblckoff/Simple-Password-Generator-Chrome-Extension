const passwordField = document.getElementById('password');
const copyBtn = document.getElementById('copy-btn');
const generateBtn = document.getElementById('generate-btn');
const uppercaseBtn = document.getElementById('uppercase-btn');
const numbersBtn = document.getElementById('numbers-btn');
const symbolsBtn = document.getElementById('symbols-btn');
const feedback = document.querySelector('.copy-feedback');

let includeUppercase = true;
let includeNumbers = true;
let includeSymbols = true;

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

  if (!password) {
    return; // If password box is empty - do nothing!
  }

  // Coping in buffer 
  navigator.clipboard.writeText(password).then(() => {
    // Show notification
    feedback.classList.add('show');

    // Hide notification after 1.5 sec
    setTimeout(() => {
      feedback.classList.remove('show');
    }, 1500);
  }).catch(err => {
    console.error('Copy ERROR: ', err);
  });
});

function generatePassword() {
  const length = 18;
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

  let charset = lowercaseChars;
  if (includeUppercase) charset += uppercaseChars;
  if (includeNumbers) charset += numberChars;
  if (includeSymbols) charset += symbolChars;

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  passwordField.value = password;
}

document.addEventListener('DOMContentLoaded', () => {
    const manifestData = chrome.runtime.getManifest();
    const versionElement = document.getElementById('version');
    versionElement.textContent = manifestData.version;
  });