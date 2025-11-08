import { api } from "./api.js";
import { $, $$, openModal, closeModal, render, toast } from "./ui.js";

const tbody = $("#animalsTable tbody");

async function load() {
  const res = await api("/animals");
  if (res.status !== 200)
    return render(
      tbody,
      `<tr><td colspan="99" class="center">❌ ${res.message}</td></tr>`
    );
  render(
    tbody,
    res.data
      .map(
        (a) => `
    <tr data-id="${a.animal_id}">
      <td>${a.animal_id}</td>
      <td><input class="name" value="${a.name ?? ""}"></td>
      <td><input class="species_id" type="number" value="${
        a.species_id ?? ""
      }"></td>
      <td>
        <select class="sex">
          <option value="M" ${a.sex === "M" ? "selected" : ""}>M</option>
          <option value="F" ${a.sex === "F" ? "selected" : ""}>F</option>
        </select>
      </td>
      <td><input class="dob" type="date" value="${(
        a.date_of_birth || ""
      ).substring(0, 10)}"></td>
      <td><input class="health" value="${a.health_status ?? ""}"></td>
      <td><input class="habitat_id" type="number" value="${
        a.habitat_id ?? ""
      }"></td>
      <td><button class="btn ghost update">Update</button></td>
      <td><button class="btn danger delete">Delete</button></td>
    </tr>
  `
      )
      .join("")
  );
}

document.addEventListener("click", async (e) => {
  const row = e.target.closest("tr");
  if (e.target.id === "newAnimal") return openModal("addAnimalModal");
  if (e.target.id === "cancelAdd") return closeModal("addAnimalModal");

  if (e.target.id === "saveAnimal") {
    const body = {
      name: $("#add_name").value.trim(),
      species_id: +$("#add_species").value,
      sex: $("#add_sex").value,
      date_of_birth: $("#add_dob").value,
      health_status: $("#add_health").value.trim(),
      habitat_id: $("#add_habitat").value ? +$("#add_habitat").value : null,
    };
    const r = await api("/animals", "POST", body);
    toast(r.message);
    closeModal("addAnimalModal");
    return load();
  }

  if (!row) return;
  const id = row.dataset.id;

  if (e.target.classList.contains("update")) {
    const body = {
      name: $(".name", row).value.trim(),
      species_id: +$(".species_id", row).value,
      sex: $(".sex", row).value,
      date_of_birth: $(".dob", row).value,
      health_status: $(".health", row).value.trim(),
      habitat_id: $(".habitat_id", row).value
        ? +$(".habitat_id", row).value
        : null,
    };
    const r = await api(`/animals/${id}`, "PUT", body);
    toast(r.message);
    return load();
  }

  if (e.target.classList.contains("delete")) {
    if (!confirm("Delete this animal?")) return;
    const r = await api(`/animals/${id}`, "DELETE");
    toast(r.message);
    return load();
  }
});

load();
