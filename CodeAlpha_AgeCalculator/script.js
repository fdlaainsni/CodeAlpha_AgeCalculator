// DOM elements
const daySelect = document.getElementById('day');
const monthSelect = document.getElementById('month');
const yearSelect = document.getElementById('year');
const ageForm = document.getElementById('ageForm');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');

// Result elements
const yearsSpan = document.getElementById('years');
const monthsSpan = document.getElementById('months');
const daysSpan = document.getElementById('days');
const totalDaysSpan = document.getElementById('totalDays');
const nextBirthdaySpan = document.getElementById('nextBirthday');

// Initialize the calculator
document.addEventListener('DOMContentLoaded', function() {
    populateDropdowns();
    setupEventListeners();
});

// Populate dropdown menus
function populateDropdowns() {
    // Populate days (1-31)
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
    }
    
    // Populate years (current year back to 1900)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Update days when month or year changes
    monthSelect.addEventListener('change', updateDays);
    yearSelect.addEventListener('change', updateDays);
    
    // Handle form submission
    ageForm.addEventListener('submit', handleFormSubmit);
}

// Update available days based on selected month and year
function updateDays() {
    const selectedMonth = parseInt(monthSelect.value);
    const selectedYear = parseInt(yearSelect.value);
    const selectedDay = parseInt(daySelect.value);
    
    if (!selectedMonth || !selectedYear) return;
    
    // Get number of days in the selected month and year
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    
    // Clear existing options except the first one
    daySelect.innerHTML = '<option value="">Day</option>';
    
    // Populate with correct number of days
    for (let i = 1; i <= daysInMonth; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
    }
    
    // Restore selected day if it's still valid
    if (selectedDay && selectedDay <= daysInMonth) {
        daySelect.value = selectedDay;
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const day = parseInt(daySelect.value);
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearSelect.value);
    
    // Validate input
    if (!validateInput(day, month, year)) {
        return;
    }
    
    // Calculate age
    const birthDate = new Date(year, month - 1, day);
    const ageData = calculateAge(birthDate);
    
    // Display results
    displayResults(ageData);
    hideError();
}

// Validate user input
function validateInput(day, month, year) {
    if (!day || !month || !year) {
        showError('Please fill in all fields.');
        return false;
    }
    
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    
    // Check if the date is valid
    if (birthDate.getDate() !== day || 
        birthDate.getMonth() !== month - 1 || 
        birthDate.getFullYear() !== year) {
        showError('Please enter a valid date.');
        return false;
    }
    
    // Check if birth date is in the future
    if (birthDate > today) {
        showError('Birth date cannot be in the future.');
        return false;
    }
    
    // Check if birth date is too far in the past (more than 150 years)
    const maxAge = new Date();
    maxAge.setFullYear(maxAge.getFullYear() - 150);
    if (birthDate < maxAge) {
        showError('Please enter a more recent birth date.');
        return false;
    }
    
    return true;
}

// Calculate age in years, months, and days
function calculateAge(birthDate) {
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    // Adjust for negative days
    if (days < 0) {
        months--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Calculate total days lived
    const timeDiff = today.getTime() - birthDate.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    // Calculate days until next birthday
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    return {
        years: years,
        months: months,
        days: days,
        totalDays: totalDays,
        daysUntilBirthday: daysUntilBirthday === 0 ? 365 : daysUntilBirthday // Handle birthday today
    };
}

// Display calculation results
function displayResults(ageData) {
    yearsSpan.textContent = ageData.years;
    monthsSpan.textContent = ageData.months;
    daysSpan.textContent = ageData.days;
    totalDaysSpan.textContent = ageData.totalDays.toLocaleString();
    
    // Handle special case for birthday today
    if (ageData.daysUntilBirthday === 365) {
        nextBirthdaySpan.textContent = "0 (Happy Birthday! 🎉)";
    } else {
        nextBirthdaySpan.textContent = ageData.daysUntilBirthday;
    }
    
    // Show result with animation
    resultDiv.classList.remove('hidden');
    resultDiv.classList.add('show');
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
    resultDiv.classList.add('hidden');
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Hide error message
function hideError() {
    errorDiv.classList.add('hidden');
}

// Add some interactivity - clear results when form is modified
function clearResults() {
    resultDiv.classList.add('hidden');
    hideError();
}

// Add event listeners to clear results when inputs change
daySelect.addEventListener('change', clearResults);
monthSelect.addEventListener('change', clearResults);
yearSelect.addEventListener('change', clearResults);