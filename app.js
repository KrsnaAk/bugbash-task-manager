const app = document.querySelector("#app");
const key = "bug-bash-tasks";
let tasks = JSON.parse(
  localStorage.getItem(key) ||
    '[{"id":1,"title":"Prepare demo","done":false,"completed":false},{"id":2,"title":"Review PR","done":true,"completed":true}]',
);
let filter = "all";
function render() {
  const visible =
    filter === "all"
      ? tasks
      : tasks.filter((t) =>
          filter === "completed" || filter === "done"
            ? (t.completed ?? t.done)
            : !(t.completed ?? t.done),
        );
  app.innerHTML = `<div class="row space"><div><span class="label">${visible.length} visible tasks</span><h2>Today’s work</h2></div><div class="row"><button class="secondary" data-filter="all">All</button><button class="secondary" data-filter="active">Active</button><button class="secondary" data-filter="completed">Completed</button></div></div><form id="new" class="row"><input aria-label="New task" placeholder="Add a task"/><button>Add task</button></form><div class="list">${visible.map((t) => `<article class="item"><label class="row"><input type="checkbox" data-toggle="${t.id}" ${(t.completed ?? t.done) ? "checked" : ""}/><strong>${t.title}</strong></label><span class="pill">${(t.completed ?? t.done) ? "completed" : "active"}</span></article>`).join("") || '<p class="muted">Nothing here yet.</p>'}</div>`;
  document.querySelectorAll("[data-filter]").forEach(
    (b) =>
      (b.onclick = () => {
        filter = b.dataset.filter;
        render();
      }),
  );
  document.querySelectorAll("[data-toggle]").forEach((c) => {
    const toggle = () => {
      const t = tasks.find((x) => x.id == c.dataset.toggle);
      if (t) {
        t.done = c.checked;
        t.completed = c.checked;
        render();
      }
    };
    c.onchange = toggle;
    c.onclick = toggle;
  });
  document.querySelector("#new").onsubmit = (e) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input");
    const title = input.value.trim();
    if (!title) return;
    if (tasks.some((t) => t.title.trim().toLowerCase() === title.toLowerCase())) return;
    tasks.push({ id: Date.now(), title, done: false, completed: false });
    input.value = "";
    render();
  };
}
render();
