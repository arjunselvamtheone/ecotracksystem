import { api } from "./api.js";
import { $, openModal, closeModal, render, toast } from "./ui.js";

const tbody = $("#speciesTable tbody");

async function load() {
  const r = await api("/species");
  if (r.status !== 200)
    return render(
      tbody,
      `<tr><td colspan="99" class="center">❌ ${r.message}</td></tr>`
    );
  render(
    tbody,
    r.data
      .map(
        (s) => `
    <tr data-id="${s.species_id}">
      <td>${s.species_id}</td>
      <td><input class="name" value="${s.name ?? ""}"></td>
      <td>
        <select class="threat">
          ${[
            "Critical",
            "Endangered",
            "Vulnerable",
            "Safe",
            "Near Threatened",
            "Least Concern",
          ]
            .map(
              (t) => `
            <option value="${t}" ${
                s.threat_level === t ? "selected" : ""
              }>${t}</option>
          `
            )
            .join("")}
        </select>
      </td>
      <td><input class="population" type="number" value="${
        s.population ?? 0
      }"></td>
      <td>
        <select class="trend">
          ${["Declining", "Stable", "Increasing"]
            .map(
              (t) => `
            <option value="${t}" ${
                s.trend === t ? "selected" : ""
              }>${t}</option>
          `
            )
            .join("")}
        </select>
      </td>
      <td><input class="habitat_id" type="number" value="${
        s.habitat_id ?? ""
      }"></td>
      <td>
        <button class="btn ghost update">Update</button>
        <button class="btn danger delete">Delete</button>
      </td>
    </tr>
  `
      )
      .join("")
  );
}

document.addEventListener("click", async (e) => {
  const row = e.target.closest("tr");
  if (e.target.id === "newSpecies") return openModal("addSpeciesModal");
  if (e.target.id === "cancelSpecies") return closeModal("addSpeciesModal");

  if (e.target.id === "saveSpecies") {
    const body = {
      name: $("#s_name").value.trim(),
      threat_level: $("#s_threat").value,
      population: +$("#s_pop").value || 0,
      trend: $("#s_trend").value,
      habitat_id: $("#s_habitat").value ? +$("#s_habitat").value : null,
    };
    const r = await api("/species", "POST", body);
    toast(r.message);
    closeModal("addSpeciesModal");
    return load();
  }

  if (!row) return;
  const id = row.dataset.id;

  if (e.target.classList.contains("update")) {
    const body = {
      name: $(".name", row).value.trim(),
      threat_level: $(".threat", row).value,
      population: +$(".population", row).value || 0,
      trend: $(".trend", row).value,
      habitat_id: $(".habitat_id", row).value
        ? +$(".habitat_id", row).value
        : null,
    };
    const r = await api(`/species/${id}`, "PUT", body);
    toast(r.message);
    return load();
  }

  if (e.target.classList.contains("delete")) {
    if (!confirm("Delete species?")) return;
    const r = await api(`/species/${id}`, "DELETE");
    toast(r.message);
    return load();
  }
});

load();
