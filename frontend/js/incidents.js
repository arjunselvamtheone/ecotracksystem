import { api } from "./api.js";
import { $, openModal, closeModal, render, toast } from "./ui.js";

const tbody = $("#incidentTable tbody");

async function load() {
  const r = await api("/incidents");
  if (r.status !== 200)
    return render(
      tbody,
      `<tr><td colspan="99" class="center">❌ ${r.message}</td></tr>`
    );
  render(
    tbody,
    r.data
      .map(
        (i) => `
    <tr data-id="${i.incident_id}">
      <td>${i.incident_id}</td>
      <td><input class="type" value="${i.type ?? ""}"></td>
      <td><input class="date" type="date" value="${(i.date || "").substring(
        0,
        10
      )}"></td>
      <td><input class="animal_id" type="number" value="${
        i.animal_id ?? ""
      }" placeholder="${i.animal_name ?? ""}"></td>
      <td><input class="habitat_id" type="number" value="${
        i.habitat_id ?? ""
      }" placeholder="${i.habitat_name ?? ""}"></td>
      <td>
        <select class="severity">
          ${["Low", "Medium", "High"]
            .map(
              (s) => `
            <option value="${s}" ${
                i.severity === s ? "selected" : ""
              }>${s}</option>
          `
            )
            .join("")}
        </select>
      </td>
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
  if (e.target.id === "newIncident") return openModal("incidentModal");
  if (e.target.id === "cancelIncident") return closeModal("incidentModal");

  if (e.target.id === "saveIncident") {
    const body = {
      type: $("#i_type").value.trim(),
      date: $("#i_date").value,
      animal_id: +$("#i_animal").value || null,
      habitat_id: +$("#i_habitat").value || null,
      location: $("#i_location").value.trim(),
      description: $("#i_desc").value.trim(),
      severity: $("#i_severity").value,
    };
    const r = await api("/incidents", "POST", body);
    toast(r.message);
    closeModal("incidentModal");
    return load();
  }

  if (!row) return;
  const id = row.dataset.id;

  if (e.target.classList.contains("update")) {
    const body = {
      type: $(".type", row).value.trim(),
      date: $(".date", row).value,
      animal_id: +$(".animal_id", row).value || null,
      habitat_id: +$(".habitat_id", row).value || null,
      severity: $(".severity", row).value,
    };
    const r = await api(`/incidents/${id}`, "PUT", body);
    toast(r.message);
    return load();
  }

  if (e.target.classList.contains("delete")) {
    if (!confirm("Delete incident?")) return;
    const r = await api(`/incidents/${id}`, "DELETE");
    toast(r.message);
    return load();
  }
});

load();
