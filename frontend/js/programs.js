// public/js/programs.js

const API = "http://localhost:5000/api/programs";
const tbody = document.querySelector("#programTable tbody");

/**************** LOAD PROGRAMS *****************/
async function loadPrograms() {
  try {
    const res = await fetch(API);
    const result = await res.json();

    if (!res.ok) {
      tbody.innerHTML = `<tr><td colspan="8">❌ ${
        result.message || "Server error"
      }</td></tr>`;
      return;
    }

    const programs = Array.isArray(result.data) ? result.data : [];

    tbody.innerHTML = programs
      .map(
        (p) => `
      <tr data-id="${p.program_id}">
        <td>${p.program_id}</td>
        <td><input value="${p.name}" class="name"></td>
        <td><input value="${p.habitat_id}" class="habitat_id"></td>
        <td><input value="${p.start_date?.substring(
          0,
          10
        )}" type="date" class="start_date"></td>
        <td><input value="${p.status}" class="status"></td>
        <td><input value="${
          p.funding_utilization
        }" type="number" class="funding"></td>

        <td><button class="btn tiny update">Update</button></td>
        <td><button class="btn tiny danger delete">Delete</button></td>
      </tr>`
      )
      .join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8">❌ Cannot connect to backend</td></tr>`;
  }
}

/**************** ADD PROGRAM (POST) *****************/
document.getElementById("newProgram").addEventListener("click", () => {
  document.getElementById("programModal").style.display = "flex";
});

document.getElementById("cancelProgram").addEventListener("click", () => {
  document.getElementById("programModal").style.display = "none";
});

document.getElementById("saveProgram").addEventListener("click", async () => {
  const body = {
    name: document.getElementById("p_name").value,
    habitat_id: document.getElementById("p_habitat").value,
    start_date: document.getElementById("p_start").value,
    status: document.getElementById("p_status").value,
    funding_utilization: document.getElementById("p_funding").value,
  };

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await res.json();
  alert(result.message || result.error);

  document.getElementById("programModal").style.display = "none";
  loadPrograms();
});

/**************** UPDATE PROGRAM (PUT) *****************/
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("update")) return;

  const row = e.target.closest("tr");
  const id = row.dataset.id;

  const body = {
    name: row.querySelector(".name").value,
    habitat_id: row.querySelector(".habitat_id").value,
    start_date: row.querySelector(".start_date").value,
    status: row.querySelector(".status").value,
    funding_utilization: row.querySelector(".funding").value,
  };

  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await res.json();
  alert(result.message || result.error);

  loadPrograms();
});

/**************** DELETE PROGRAM (DELETE) *****************/
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete")) return;

  const id = e.target.closest("tr").dataset.id;

  if (!confirm("Delete this program?")) return;

  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  const result = await res.json();

  alert(result.message || result.error);
  loadPrograms();
});

loadPrograms();
