const API = "http://localhost:5000/api/incidents";
const tbody = document.querySelector("#incidentTable tbody");

async function loadIncidents() {
  const res = await fetch(API);
  const result = await res.json();

  tbody.innerHTML = result.data
    .map(
      (i) => `
      <tr>
        <td>${i.incident_id}</td>
        <td>${i.type}</td>
        <td>${i.date}</td>
        <td>${i.animal_name}</td>
        <td>${i.habitat_name}</td>
        <td>${i.severity}</td>
        <td><button class="btn tiny delete" data-id="${i.incident_id}">Delete</button></td>
      </tr>`
    )
    .join("");

  document
    .querySelectorAll(".delete")
    .forEach((btn) =>
      btn.addEventListener("click", () => deleteIncident(btn.dataset.id))
    );
}

async function deleteIncident(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadIncidents();
}

loadIncidents();
