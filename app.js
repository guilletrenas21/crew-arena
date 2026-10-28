(function () {
  "use strict";

  var STORAGE_KEY = "tasks";

  var form = document.getElementById("task-form");
  var input = document.getElementById("task-input");
  var list = document.getElementById("task-list");
  var emptyMsg = document.getElementById("empty-msg");

  var tasks = load();

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function render() {
    list.innerHTML = "";
    emptyMsg.style.display = tasks.length ? "none" : "block";

    tasks.forEach(function (task) {
      var li = document.createElement("li");
      li.className = "task-item" + (task.done ? " done" : "");

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", function () {
        task.done = checkbox.checked;
        save();
        render();
      });

      var label = document.createElement("span");
      label.className = "label";
      label.textContent = task.text;

      var del = document.createElement("button");
      del.className = "delete";
      del.type = "button";
      del.setAttribute("aria-label", "Eliminar tarea");
      del.textContent = "\u00d7";
      del.addEventListener("click", function () {
        tasks = tasks.filter(function (t) { return t.id !== task.id; });
        save();
        render();
      });

      li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    tasks.push({ id: Date.now().toString(), text: text, done: false });
    input.value = "";
    save();
    render();
  });

  render();
})();
