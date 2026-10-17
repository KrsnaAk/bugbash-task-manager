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
