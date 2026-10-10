const form = document.getElementById("studentForm");
const showFormButton = document.getElementById("showFormButton");
const cancelFormButton = document.getElementById("cancelFormButton");
const tableBody = document.getElementById("studentTableBody");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");

let students = JSON.parse(localStorage.getItem("studentHubRecords") || "[]");

function saveStudents() {
  localStorage.setItem("studentHubRecords", JSON.stringify(students));
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0].toUpperCase()).join("");
}

function renderStudents() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = students.filter(student =>
    [student.name, student.register, student.department, student.email]
      .some(value => value.toLowerCase().includes(query))
  );

  tableBody.innerHTML = "";
  filtered.forEach(student => {
    const originalIndex = students.findIndex(item => item.id === student.id);
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    const nameWrap = document.createElement("div");
    nameWrap.className = "student-name";
    const avatar = document.createElement("span");
    avatar.className = "initials";
    avatar.textContent = initials(student.name);
    const nameText = document.createElement("span");
    nameText.textContent = student.name;
    nameWrap.append(avatar, nameText);
    nameCell.append(nameWrap);

    const registerCell = document.createElement("td");
    registerCell.textContent = student.register;

    const departmentCell = document.createElement("td");
    const tag = document.createElement("span");
    tag.className = "dept-tag";
    tag.textContent = student.department;
    departmentCell.append(tag);

    const emailCell = document.createElement("td");
    emailCell.textContent = student.email;

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${student.name}`);
    deleteButton.addEventListener("click", () => {
      if (confirm(`Delete ${student.name}'s record?`)) {
        students.splice(originalIndex, 1);
        saveStudents();
        renderStudents();
      }
    });
    actionCell.append(deleteButton);
    row.append(nameCell, registerCell, departmentCell, emailCell, actionCell);
    tableBody.append(row);
  });

  emptyState.classList.toggle("hidden", filtered.length > 0);
  document.getElementById("totalCount").textContent = students.length;
  document.getElementById("recordCount").textContent = `${filtered.length} record${filtered.length === 1 ? "" : "s"}`;
  document.getElementById("departmentCount").textContent = new Set(students.map(s => s.department)).size;
}

showFormButton.addEventListener("click", () => {
  form.classList.remove("hidden");
  document.getElementById("studentName").focus();
});
cancelFormButton.addEventListener("click", () => {
  form.reset();
  form.classList.add("hidden");
});
searchInput.addEventListener("input", renderStudents);

form.addEventListener("submit", event => {
  event.preventDefault();
  const student = {
    id: (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
    name: document.getElementById("studentName").value.trim(),
    register: document.getElementById("studentRegister").value.trim(),
    department: document.getElementById("studentDepartment").value,
    email: document.getElementById("studentEmail").value.trim()
  };

  if (students.some(s => s.register.toLowerCase() === student.register.toLowerCase())) {
    alert("That register number already exists. Please use a unique one.");
    return;
  }

  students.push(student);
  saveStudents();
  renderStudents();
  form.reset();
  form.classList.add("hidden");
});

document.getElementById("menuButton").addEventListener("click", () => {
  document.querySelector("nav").classList.toggle("open");
});

document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => document.querySelector("nav").classList.remove("open"));
});

renderStudents();
