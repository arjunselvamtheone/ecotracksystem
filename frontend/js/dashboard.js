/* dashboard.js
  - loads quick stats and wires quick action buttons
  - replace mocked fetches with API calls.
*/
document.addEventListener("DOMContentLoaded", () => {
  // simple mocked dashboard counts
  const setEl = (id, val) => {
    const e = document.getElementById(id);
    if (e) e.textContent = val;
  };
  setEl("username", "Dr. Sarah");
  setEl("cSpecies", 32);
  setEl("cPrograms", 6);
  setEl("cIncidents", 4);

  document.getElementById("btnNewIncident")?.addEventListener("click", () => {
    alert(
      "Open incident modal (placeholder). Integrate a modal form to POST /api/incidents."
    );
  });
  document.getElementById("btnNewAnimal")?.addEventListener("click", () => {
    window.location.href = "pages/animals.html";
  });
  document.getElementById("btnNewProgram")?.addEventListener("click", () => {
    window.location.href = "pages/programs.html";
  });

  // Search quick filter for demo (client-side)
  const search = document.getElementById("globalSearch");
  if (search) {
    search.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = search.value.trim().toLowerCase();
        if (!q) return;
        // naive redirect: if 'species' in query go to species page
        if (q.includes("species")) window.location.href = "pages/species.html";
        else if (q.includes("animal"))
          window.location.href = "pages/animals.html";
        else window.location.href = "pages/incidents.html";
      }
    });
  }
});
