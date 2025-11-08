

document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.querySelector(
    '[id^="add"], .add-btn, .new-btn, button[class*="new"]'
  );
  const table = document.querySelector("table");
  if (!table || !addButton) return;

  const tbody =
    table.querySelector("tbody") ||
    table.appendChild(document.createElement("tbody"));

  const createFormRow = () => {
    const formRow = document.createElement("tr");
    formRow.classList.add("add-form-row");

    const columns = table.querySelectorAll("thead th").length;
    for (let i = 0; i < columns - 1; i++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `Enter value`;
      input.classList.add("form-input");
      td.appendChild(input);
      formRow.appendChild(td);
    }

    const tdActions = document.createElement("td");
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.classList.add("save-btn");

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.classList.add("cancel-btn");

    tdActions.appendChild(saveBtn);
    tdActions.appendChild(cancelBtn);
    formRow.appendChild(tdActions);

    saveBtn.addEventListener("click", () => {
      const inputs = formRow.querySelectorAll("input");
      const newRow = document.createElement("tr");
      inputs.forEach((input) => {
        const td = document.createElement("td");
        td.textContent = input.value || "-";
        newRow.appendChild(td);
      });

      // Add delete button
      const deleteCell = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteCell.appendChild(deleteBtn);
      newRow.appendChild(deleteCell);

      // Append and clean up
      tbody.appendChild(newRow);
      formRow.remove();

      // Attach delete handler
      deleteBtn.addEventListener("click", () => {
        newRow.remove();
      });
    });

    // Cancel form
    cancelBtn.addEventListener("click", () => {
      formRow.remove();
    });

    return formRow;
  };

  // Add button click handler
  addButton.addEventListener("click", () => {
    if (table.querySelector(".add-form-row")) return; // Prevent multiple forms
    const formRow = createFormRow();
    tbody.prepend(formRow);
  });

  // Hook up existing delete buttons if present
  table.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.target.closest("tr").remove();
    });
  });
});
