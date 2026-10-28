const form = document.querySelector("#habit-form");
const input = document.querySelector("#habit-input");
const list = document.querySelector("#habit-list");
const emptyState = document.querySelector("#empty-state");
const progressText = document.querySelector("#progress-text");
const progressBar = document.querySelector("#progress-bar");
const clearButton = document.querySelector("#clear-completed");

let habits = JSON.parse(localStorage.getItem("daily-habits") || "[]");

function save() {
  localStorage.setItem("daily-habits", JSON.stringify(habits));
}

function render() {
  list.innerHTML = "";
  habits.forEach((habit) => {
    const item = document.createElement("li");
    item.className = `habit ${habit.done ? "done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.done;
    checkbox.setAttribute("aria-label", `Mark ${habit.name} completed`);
    checkbox.addEventListener("change", () => {
      habit.done = checkbox.checked;
      save();
      render();
    });

    const name = document.createElement("span");
    name.textContent = habit.name;

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.type = "button";
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", `Delete ${habit.name}`);
    remove.addEventListener("click", () => {
      habits = habits.filter((entry) => entry.id !== habit.id);
      save();
      render();
    });

    item.append(checkbox, name, remove);
    list.append(item);
  });

  const completed = habits.filter((habit) => habit.done).length;
  progressText.textContent = `${completed} of ${habits.length} completed`;
  progressBar.style.width = habits.length ? `${(completed / habits.length) * 100}%` : "0%";
  emptyState.hidden = habits.length > 0;
  clearButton.hidden = !habits.some((habit) => habit.done);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = input.value.trim();
  if (!name) return;

  habits.push({ id: crypto.randomUUID(), name, done: false });
  input.value = "";
  save();
  render();
  input.focus();
});

clearButton.addEventListener("click", () => {
  habits = habits.filter((habit) => !habit.done);
  save();
  render();
});

render();
