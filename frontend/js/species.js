const API = "http://localhost:5000/api/species";
const tbody = document.querySelector("#speciesTable tbody");

async function loadSpecies() {
  const res = await fetch(API);
  const result = await res.json();

  tbody.innerHTML = result.data
    .map(
      (s) => `
      <tr>
        <td>${s.species_id}</td>
        <td>${s.name}</td>
        <td>${s.threat_level}</td>
        <td>${s.population}</td>
        <td>${s.trend}</td>
        <td>${s.habitat_name}</td>
        <td><button class="btn tiny delete" data-id="${s.species_id}">Delete</button></td>
      </tr>`
    )
    .join("");

  document
    .querySelectorAll(".delete")
    .forEach((btn) =>
      btn.addEventListener("click", () => deleteSpecies(btn.dataset.id))
    );
}

async function deleteSpecies(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadSpecies();
}

loadSpecies();
