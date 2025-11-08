const API = "http://localhost:5000/api/habitats";
const tbody = document.querySelector("#habitatTable tbody");
const btn = document.getElementById("newHabitat");

async function loadHabitats() {
  const res = await fetch(API);
  const result = await res.json();

  tbody.innerHTML = result.data
    .map(
      (h) => `
      <tr>
        <td>${h.habitat_id}</td>
        <td>${h.name}</td>
        <td>${h.location}</td>
        <td>${h.area_sq_km}</td>
        <td>${h.ecosystem_type}</td>
        <td><button class="btn tiny delete" data-id="${h.habitat_id}">Delete</button></td>
      </tr>`
    )
    .join("");

  document
    .querySelectorAll(".delete")
    .forEach((btn) =>
      btn.addEventListener("click", () => deleteHabitat(btn.dataset.id))
    );
}

btn.addEventListener("click", async () => {
  const name = prompt("Habitat name?");
  if (!name) return;

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      location: "-",
      area_sq_km: 10,
      ecosystem_type: "-",
    }),
  });

  loadHabitats();
});

async function deleteHabitat(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadHabitats();
}

loadHabitats();
