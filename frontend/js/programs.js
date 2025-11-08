import { api } from "./api.js";
import { $, render, openModal, closeModal, toast } from "./ui.js";

const tbody = $("#programTable tbody");

async function load() {
  const r = await api("/programs");
  if (r.status !== 200)
    return render(
      tbody,
      `<tr><td colspan="99" class="center">❌ ${r.message}</td></tr>`
    );
  render(
    tbody,
    r.data
      .map(
        (p) => `
    <tr data-id="${p.program_id}">
      <td>${p.program_id}</td>
      <td><input class="name" value="${p.name ?? ""}"></td>
      <td><input class="habitat_id" type="number" value="${
        p.habitat_id ?? ""
      }"></td>
      <td><input class="start_date" type="date" value="${(
        p.start_date || ""
      ).substring(0, 10)}"></td>
      <td>
        <select class="status">
          ${["Active", "Paused", "Completed"]
            .map(
              (s) => `
            <option value="${s}" ${
                p.status === s ? "selected" : ""
              }>${s}</option>
          `
            )
            .join("")}
        </select>
      </td>
      <td><input class="funding" type="number" value="${
        p.funding_utilization ?? 0
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
  if (e.target.id === "newProgram") return openModal("programModal");
  if (e.target.id === "cancelProgram") return closeModal("programModal");

  if (e.target.id === "saveProgram") {
    const body = {
      name: $("#p_name").value.trim(),
      habitat_id: +$("#p_habitat").value,
      start_date: $("#p_start").value,
      status: $("#p_status").value,
      funding_utilization: +$("#p_funding").value || 0,
    };
    const r = await api("/programs", "POST", body);
    toast(r.message);
    closeModal("programModal");
    return load();
  }

  if (!row) return;
  const id = row.dataset.id;

  if (e.target.classList.contains("update")) {
    const body = {
      name: $(".name", row).value.trim(),
      habitat_id: +$(".habitat_id", row).value,
      start_date: $(".start_date", row).value,
      status: $(".status", row).value,
      funding_utilization: +$(".funding", row).value || 0,
    };
    const r = await api(`/programs/${id}`, "PUT", body);
    toast(r.message);
    return load();
  }

  if (e.target.classList.contains("delete")) {
    if (!confirm("Delete program?")) return;
    const r = await api(`/programs/${id}`, "DELETE");
    toast(r.message);
    return load();
  }
});

load();
