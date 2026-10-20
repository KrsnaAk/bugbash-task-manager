const app = document.querySelector("#app");
const key = "bug-bash-tasks";
let tasks = JSON.parse(
  localStorage.getItem(key) ||
    '[{"id":1,"title":"Prepare demo","done":false},{"id":2,"title":"Review PR","done":true}]',
);
let filter = "all";
function render() {
  const visible =
    filter === "all"
      ? tasks
      : tasks.filter((t) => (filter === "done" ? t.done : !t.done));
  app.innerHTML = `<div class="row space"><div><span class="label">${visible.length} visible tasks</span><h2>Today’s work</h2></div><div class="row"><button class="secondary" data-filter="all">All</button><button class="secondary" data-filter="open">Active</button><button class="secondary" data-filter="done">Done</button></div></div><form id="new" class="row"><input aria-label="New task" placeholder="Add a task"/><button>Add task</button></form><div class="list">${visible.map((t) => `<article class="item"><label class="row"><input type="checkbox" data-toggle="${t.id}" ${t.done ? "checked" : ""}/><strong>${t.title}</strong></label><span class="pill">${t.done ? "done" : "active"}</span></article>`).join("") || '<p class="muted">Nothing here yet.</p>'}</div>`;
  document.querySelectorAll("[data-filter]").forEach(
    (b) =>
      (b.onclick = () => {
        filter = b.dataset.filter;
        render();
      }),
  );
  document.querySelectorAll("[data-toggle]").forEach(
    (c) =>
      (c.onchange = () => {
        const t = tasks.find((x) => x.id === Number(c.dataset.toggle));
        t.done = c.checked;
        render();
      }),
  );
  document.querySelector("#new").onsubmit = (e) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input");
    tasks.push({ id: Date.now(), title: input.value, done: false });
    input.value = "";
    render();
  };
}
render();


// Added organizer feature: priority summary and quick filter.
function renderPrioritySummary() {
  const host = document.querySelector("#app");
  if (!host || document.querySelector("#priority-summary")) return;
  const counts = tasks.reduce((out, task) => { const key = task.priority || "normal"; out[key] = (out[key] || 0) + 1; return out; }, {});
  const summary = document.createElement("p");
  summary.id = "priority-summary"; summary.className = "muted small";
  summary.textContent = Object.entries(counts).map(([key, value]) => key + ": " + value).join(" · ") || "No tasks";
  host.prepend(summary);
}
renderPrioritySummary();


// Planning tools expansion: due dates and priority ordering.
(() => {
  const baseRender = render;
  const enhance = () => {
    if (document.querySelector("#planning-tools")) return;
    const panel = document.createElement("section"); panel.id = "planning-tools"; panel.className = "item";
    panel.innerHTML = '<strong>Planning tools</strong><form id="due-task" class="row"><input name="title" placeholder="Task title"/><input name="due" type="date"/><select name="priority"><option>Normal</option><option>High</option><option>Low</option></select><button>Add planned task</button></form><label class="muted small"><input id="overdue-only" type="checkbox"/> Overdue only</label><p id="due-list" class="muted small"></p>';
    document.querySelector("#app")?.append(panel);
    panel.querySelector("#due-task").onsubmit = (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); tasks.push({ id: Date.now(), title: String(form.get("title")), done: false, due: String(form.get("due")), priority: String(form.get("priority")) }); render(); };
    panel.querySelector("#overdue-only").onchange = (event) => { const now = new Date().toISOString().slice(0, 10); const rows = tasks.filter((task) => !event.target.checked || task.due < now); panel.querySelector("#due-list").textContent = rows.map((task) => task.title + " · " + (task.due || "no date")).join(" · ") || "No planned tasks"; };
    panel.querySelector("#overdue-only").dispatchEvent(new Event("change"));
  };
  render = () => { baseRender(); enhance(); };
  enhance();
})();
