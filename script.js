// Grade points mapping
const gradePoints = {
  "A+": 4.0,
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D": 1.0,
  "F": 0.0
};

// Initialize dropdowns
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.grade-select').forEach(select => {
    // Add placeholder option
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Grade';
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    // Add grade options
    Object.keys(gradePoints).forEach(grade => {
      const option = document.createElement('option');
      option.value = grade;
      option.textContent = grade;
      select.appendChild(option);
    });
  });

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  // Load saved grades
  loadSavedGrades();
});

// Toggle theme
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Calculate SGPA for a semester
function calculateSGPA(className, outputId) {
  let totalCredits = 0;
  let totalPoints = 0;

  document.querySelectorAll('.' + className).forEach(select => {
    const credit = Number(select.dataset.credit);
    const grade = select.value;
    const isNGPA = select.dataset.ngpa === 'true';

    if (grade && !isNGPA && gradePoints.hasOwnProperty(grade)) {
      totalCredits += credit;
      totalPoints += credit * gradePoints[grade];
    }
  });

  const gpa = totalCredits === 0 ? 0 : (totalPoints / totalCredits);
  const gpaFormatted = gpa.toFixed(2);
  
  const outputEl = document.getElementById(outputId);
  outputEl.textContent = gpaFormatted;
  
  // Apply color class based on GPA
  outputEl.className = 'sgpa-value ' + getGPAColorClass(gpa);

  // Save grades
  saveGrades();

  // Auto-calculate level GPA
  calculateLevelGPAs();

  return gpa;
}

// Get color class based on GPA value
function getGPAColorClass(gpa) {
  if (gpa >= 3.7) return 'gpa-excellent';
  if (gpa >= 3.0) return 'gpa-good';
  if (gpa >= 2.0) return 'gpa-average';
  if (gpa > 0) return 'gpa-low';
  return '';
}

// Reset a semester
function resetSemester(className) {
  document.querySelectorAll('.' + className).forEach(select => {
    select.selectedIndex = 0;
  });

  const sgpaId = className === 's1' ? 'sgpa1' :
                 className === 's2' ? 'sgpa2' :
                 className === 's3' ? 'sgpa3' :
                 className === 's4' ? 'sgpa4' : '';
  
  if (sgpaId) {
    const el = document.getElementById(sgpaId);
    el.textContent = '--';
    el.className = 'sgpa-value';
  }

  saveGrades();
  calculateLevelGPAs();
}

// Calculate Level GPAs
function calculateLevelGPAs() {
  // Level 01 LGPA
  const sgpa1Text = document.getElementById('sgpa1').textContent;
  const sgpa2Text = document.getElementById('sgpa2').textContent;
  
  const sgpa1 = sgpa1Text !== '--' ? parseFloat(sgpa1Text) : 0;
  const sgpa2 = sgpa2Text !== '--' ? parseFloat(sgpa2Text) : 0;
  
  let lgpa1 = 0;
  if (sgpa1 > 0 || sgpa2 > 0) {
    const credits1 = sgpa1 > 0 ? 15 : 0;
    const credits2 = sgpa2 > 0 ? 15 : 0;
    lgpa1 = (sgpa1 * credits1 + sgpa2 * credits2) / (credits1 + credits2);
  }
  
  const lgpa1El = document.getElementById('lgpa1');
  lgpa1El.textContent = lgpa1 > 0 ? lgpa1.toFixed(2) : '--';
  lgpa1El.className = 'level-gpa-value ' + (lgpa1 > 0 ? getGPAColorClass(lgpa1) : '');

  // Level 02 LGPA
  const sgpa3Text = document.getElementById('sgpa3').textContent;
  const sgpa4Text = document.getElementById('sgpa4').textContent;
  
  const sgpa3 = sgpa3Text !== '--' ? parseFloat(sgpa3Text) : 0;
  const sgpa4 = sgpa4Text !== '--' ? parseFloat(sgpa4Text) : 0;
  
  let lgpa2 = 0;
  if (sgpa3 > 0 || sgpa4 > 0) {
    const credits3 = sgpa3 > 0 ? 15 : 0;
    const credits4 = sgpa4 > 0 ? 15 : 0;
    lgpa2 = (sgpa3 * credits3 + sgpa4 * credits4) / (credits3 + credits4);
  }
  
  const lgpa2El = document.getElementById('lgpa2');
  lgpa2El.textContent = lgpa2 > 0 ? lgpa2.toFixed(2) : '--';
  lgpa2El.className = 'level-gpa-value ' + (lgpa2 > 0 ? getGPAColorClass(lgpa2) : '');
}

// Calculate all GPAs
function calculateAll() {
  calculateSGPA('s1', 'sgpa1');
  calculateSGPA('s2', 'sgpa2');
  calculateSGPA('s3', 'sgpa3');
  calculateSGPA('s4', 'sgpa4');
  calculateLevelGPAs();
}

// Save grades to localStorage
function saveGrades() {
  const grades = {};
  document.querySelectorAll('.grade-select').forEach((select, index) => {
    if (select.value) {
      grades[index] = select.value;
    }
  });
  localStorage.setItem('bitGrades', JSON.stringify(grades));
}

// Load saved grades from localStorage
function loadSavedGrades() {
  const saved = localStorage.getItem('bitGrades');
  if (saved) {
    const grades = JSON.parse(saved);
    document.querySelectorAll('.grade-select').forEach((select, index) => {
      if (grades[index]) {
        select.value = grades[index];
      }
    });
    
    // Recalculate all GPAs
    setTimeout(() => {
      calculateAll();
    }, 100);
  }
}
