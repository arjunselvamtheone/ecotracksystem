const API = "http://localhost:5000/api/animals";

async function loadAnimals() {
  const tbody = document.querySelector("#animalsTable tbody");
  tbody.innerHTML = `<tr><td colspan="9">Loading...</td></tr>`;

  const res = await fetch(API);
  const json = await res.json();

  tbody.innerHTML = json.data
    .map(
      (a) => `
      <tr data-id="${a.animal_id}">
        <td>${a.animal_id}</td>
        <td><input value="${a.name}" class="name"></td>
        <td><input value="${a.species_id}" class="species_id"></td>
        <td><input value="${a.sex}" class="sex"></td>
        <td><input value="${a.date_of_birth?.substring(
          0,
          10
        )}" type="date" class="date_of_birth"></td>
        <td><input value="${a.health_status}" class="health_status"></td>
        <td><input value="${a.habitat_id ?? ""}" class="habitat_id"></td>
        <td><button class="btn tiny update">Update</button></td>
        <td><button class="btn tiny danger delete">Delete</button></td>
      </tr>
    `
    )
    .join("");
}

/************* CREATE New Animal **************/
document.getElementById("newAnimal").addEventListener("click", () => {
  document.getElementById("addAnimalModal").style.display = "flex";
});

document.getElementById("cancelAdd").addEventListener("click", () => {
  document.getElementById("addAnimalModal").style.display = "none";
});

document.getElementById("saveAnimal").addEventListener("click", async () => {
  const body = {
    name: document.getElementById("add_name").value,
    species_id: document.getElementById("add_species").value,
    sex: document.getElementById("add_sex").value,
    date_of_birth: document.getElementById("add_dob").value,
    health_status: document.getElementById("add_health").value,
    habitat_id: document.getElementById("add_habitat").value || null,
  };

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  alert(json.message || json.error);

  document.getElementById("addAnimalModal").style.display = "none";
  loadAnimals();
});

/************* UPDATE **************/
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("update")) return;

  const row = e.target.closest("tr");
  const id = row.dataset.id;

  const body = {
    name: row.querySelector(".name").value,
    species_id: row.querySelector(".species_id").value,
    sex: row.querySelector(".sex").value,
    date_of_birth: row.querySelector(".date_of_birth").value,
    health_status: row.querySelector(".health_status").value,
    habitat_id: row.querySelector(".habitat_id").value || null,
  };

  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  alert(json.message || json.error);
  loadAnimals();
});

/************* DELETE **************/
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete")) return;

  const id = e.target.closest("tr").dataset.id;
  if (!confirm("Delete this animal?")) return;

  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadAnimals();
});

loadAnimals();
