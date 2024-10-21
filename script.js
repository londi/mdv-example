// Beispiel-Daten
const data = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com" },
];

const proxy_handler = {
    get: function (target, prop, receiver) {
        return target[prop];
    },
    set: function (target, prop, value, receiver) {
        target[prop] = value;
        data[target["id"] - 1][prop] = value;
        populateTable();
        return true;
    }
}

const target = {
    id: 0,
    name: "",
    email: "",
    dirty: false
};

let proxy_object = new Proxy({}, proxy_handler);

// HTML-Elemente referenzieren
const tableBody     = document.getElementById("table-body");
const detailForm    = document.getElementById("detail-form");

// Aktuell ausgewähltes Element
let selectedRow = null;

// Tabelle befüllen
function populateTable() {
    tableBody.innerHTML = "";
    data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.email}</td>
        `;
        row.addEventListener("click", () => {
            selectRow(row, index);
        });
        if (selectedRow === index) {
            row.className = "selected";
        }
        if (proxy_object["dirty"] && proxy_object["id"] === item.id) {
            row.className = "dirty";
        }

        tableBody.appendChild(row);
    });

}

// Zeile auswählen
function selectRow(row, index) {
    if (proxy_object["dirty"]) {
        alert("Please save the changes first 👻");
        return;
    }

    selectedRow = index;

    loadProxyObject(index);

    // Formular mit den Daten füllen
    detailForm.id.value     = data[index].id;
    detailForm.name.value   = data[index].name;
    detailForm.email.value  = data[index].email;
}

// Daten aktualisieren
function updateData(key, value) {
    proxy_object[key]                   = value;
    proxy_object["dirty"]               = true;
}

// Event-Listener für Formularänderungen
detailForm.name.addEventListener("input", () => updateData("name", detailForm.name.value));
detailForm.email.addEventListener("input", () => updateData("email", detailForm.email.value));
detailForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (proxy_object["dirty"]) {
        proxy_object["dirty"] = false;
    }
});

document.getElementById("reset-button").addEventListener("click", (event) => {
    alert("Not implemented yet 🤷‍♂️");
});

// Proxy-Objekt mit Daten befüllen
function loadProxyObject(index) {
    proxy_object.id     = data[index].id;
    proxy_object.name   = data[index].name;
    proxy_object.email  = data[index].email;
    proxy_object.dirty  = false;
}

// Tabelle initial befüllen
populateTable();
