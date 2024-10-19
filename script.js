// Beispiel-Daten
const data = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com" },
];

const proxy_handler = {
    get: function (target, prop, receiver) {
        console.log(`Get: ${prop}`);
        return target[prop];
    },
    set: function (target, prop, value, receiver) {
        console.log(`Set: ${prop} = ${value}`);
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
const tableBody = document.getElementById("table-body");
const detailForm = document.getElementById("detail-form");

// Aktuell ausgewähltes Element
let selectedRow = null;

// Tabelle befüllen
function populateTable() {
    console.log("Populate table, selectedRow = ", selectedRow);
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
    console.log(`Select row ${index}`);
    selectedRow = index;

    loadProxyObject(index);

    // Formular mit den Daten füllen
    detailForm.id.value = data[index].id;
    detailForm.name.value = data[index].name;
    detailForm.email.value = data[index].email;
}

function updateData(key, value) {
    console.log(`Update data[${key}] = ${value}`);
    proxy_object[key] = value;
    proxy_object["dirty"] = true;
}

// Event-Listener für Formularänderungen
detailForm.name.addEventListener("input", () => updateData("name", detailForm.name.value));
detailForm.email.addEventListener("input", () => updateData("email", detailForm.email.value));
detailForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Submit form");
    if (proxy_object["dirty"]) {
        console.log("Submit form");
        proxy_object["dirty"] = false;
    }
});

function loadProxyObject(index) {
    console.log("Load proxy object");
    proxy_object.id = data[index].id;
    proxy_object.name = data[index].name;
    proxy_object.email = data[index].email;
    proxy_object.dirty = false;
}

// Tabelle initial befüllen
populateTable();
