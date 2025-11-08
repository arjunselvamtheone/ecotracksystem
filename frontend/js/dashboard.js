// dashboard.js — tiny counters (optional: can wire to API)
document.addEventListener("DOMContentLoaded", () => {
  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };
  set("cSpecies", "32");
  set("cPrograms", "6");
  set("cIncidents", "4");
});
