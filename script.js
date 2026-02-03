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

// Fill dropdowns
document.querySelectorAll("select").forEach(sel => {
  Object.keys(gradePoints).forEach(g => {
    const option = document.createElement("option");
    option.value = g;
    option.textContent = g;
    sel.appendChild(option);
  });
});

// Calculate GPA for a single semester
function calculateSGPA(className, outputId) {
  let totalCredits = 0;
  let totalPoints = 0;

  document.querySelectorAll("." + className).forEach(sel => {
    const credit = Number(sel.dataset.credit);
    const gp = gradePoints[sel.value] || 0;
    const isNGPA = sel.dataset.ngpa === "true";
    if (!isNGPA) {
      totalCredits += credit;
      totalPoints += credit * gp;
    }
  });

  const gpa = totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
  document.getElementById(outputId).textContent = gpa;
  return gpa;
}

// Reset a semester dropdowns and GPA display
function resetSemester(className) {
  document.querySelectorAll("." + className).forEach(sel => {
    sel.selectedIndex = 0;
  });

  const sgpaId = className === "s1" ? "sgpa1" :
                 className === "s2" ? "sgpa2" :
                 className === "s3" ? "sgpa3" :
                 className === "s4" ? "sgpa4" : "";
  if (sgpaId) {
    document.getElementById(sgpaId).textContent = "–";
  }
}

// Calculate Level LGPA
function calculateLevelGPA() {
  const sgpa1 = Number(document.getElementById("sgpa1").textContent) || 0;
  const sgpa2 = Number(document.getElementById("sgpa2").textContent) || 0;
  const lgpa1 = ((sgpa1*15 + sgpa2*15)/30).toFixed(2);
  document.getElementById("lgpa1").textContent = lgpa1;

  const sgpa3 = Number(document.getElementById("sgpa3").textContent) || 0;
  const sgpa4 = Number(document.getElementById("sgpa4").textContent) || 0;
  const lgpa2 = ((sgpa3*15 + sgpa4*15)/30).toFixed(2);
  document.getElementById("lgpa2").textContent = lgpa2;
}
