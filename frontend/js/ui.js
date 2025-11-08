// ui.js — small helpers
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function openModal(id) {
  document.getElementById(id).style.display = "flex";
}
export function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

export function render(tbody, rowsHtml) {
  tbody.innerHTML =
    rowsHtml || `<tr><td class="center" colspan="99">No data</td></tr>`;
}
export function toast(msg) {
  alert(msg);
} // keep simple; can swap to fancy toasts later
