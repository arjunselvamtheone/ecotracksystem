import { api } from "./api.js";
import { $, openModal, closeModal, render, toast } from "./ui.js";

const tbody = $("#habitatTable tbody");

async function load() {
  const r = await api("/habitats");
  if (r.status !== 200)
    return render(
      tbody,
      `<tr><td colspan="99" class="center">❌ ${r.message}</td></tr>`
    );
  render(
    tbody,
    r.data
      .map(
        (h) => `
    <tr data-id="${h.habitat_id}">
      <td>${h.habitat_id}</td>
      <td><input class="name" value="${h.name ?? ""}"></td>
      <td><input class="location" value="${h.location ?? ""}"></td>
      <td><input class="area" type="number" value="${h.area_sq_km ?? 0}"></td>
      <td><input class="eco" value="${h.ecosystem_type ?? ""}"></td>
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
  if (e.target.id === "newHabitat") return openModal("addHabitatModal");
  if (e.target.id === "cancelHabitat") return closeModal("addHabitatModal");

  if (e.target.id === "saveHabitat") {
    const body = {
      name: $("#h_name").value.trim(),
      location: $("#h_location").value.trim(),
      area_sq_km: +$("#h_area").value || 0,
      ecosystem_type: $("#h_eco").value.trim(),
    };
    const r = await api("/habitats", "POST", body);
    toast(r.message);
    closeModal("addHabitatModal");
    return load();
  }

  if (!row) return;
  const id = row.dataset.id;

  if (e.target.classList.contains("update")) {
    const body = {
      name: $(".name", row).value.trim(),
      location: $(".location", row).value.trim(),
      area_sq_km: +$(".area", row).value || 0,
      ecosystem_type: $(".eco", row).value.trim(),
    };
    const r = await api(`/habitats/${id}`, "PUT", body);
    toast(r.message);
    return load();
  }

  if (e.target.classList.contains("delete")) {
    if (!confirm("Delete habitat?")) return;
    const r = await api(`/habitats/${id}`, "DELETE");
    toast(r.message);
    return load();
  }
});

load();
