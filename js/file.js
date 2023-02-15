// Wyeksportowanie danych systemu do pliku CSV
function exportToCSV() {
  const csvData = setDataToCSVFormat();
  const url = "data:text/csv;charset=utf-8," + encodeURI(csvData);
  downloadFile(url, "csv");
}

// Konwersja danych systemu do formatu CSV
function setDataToCSVFormat() {
  const columnTitles = ["Rodzaj urz.", "Nazwa urz.", "Ilość"];
  const rows = [];
  insertDeviceTypeData("detectors", "Czujnik gazu", rows);
  insertDeviceTypeData("signallers", "Sygnalizator", rows);
  insertDeviceTypeWireLengthData("detector", "czujniki gazu", rows);
  insertDeviceTypeWireLengthData("signaller", "sygnalizatory", rows);
  rows.push(["Zasilacz", systemData.powerSupply, "1 szt."]);
  const csv = [columnTitles, ...rows].map((row) => `${row.join(",")}\r\n`).join("");
  
  return csv;
}

// Wyeksportowanie danych systemu do pliku JSON
function exportToJSON() {
  const stringData = JSON.stringify(systemData);
  const blob = new Blob([stringData], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  downloadFile(url, "json");
}

// Wstawienie wierszy z danymi dot. użytych w systemie typów urządzeń
function insertDeviceTypeData(type, label, store) {
  systemData.devicesTypes[type].forEach((deviceType) => {
    const quantity = systemData.devices.reduce((accumulator, device) => {
      if (device.name === deviceType.name) {
        return accumulator += 1;
      } else {
        return accumulator;
      }
    }, 0);
    store.push([label, deviceType.name, `${quantity} szt.`]);
  });
}

// Wstawienie wierszy z danymi dot. kabli użytych w systemie
function insertDeviceTypeWireLengthData(deviceType, deviceTypeLabel, store) {
  const wireLength = systemData.devices.reduce((accumulator, device) => {
    if (device.type === deviceType) {
      return accumulator += device.wireLength;
    } else {
      return accumulator;
    }
  }, 0);
  store.push(["Kabel", deviceTypeLabel, `${wireLength} m`]);
}

// Ustawienie parametrów pliku i pobranie go przez użytkownika
function downloadFile(url, fileType) {
  const defaultFileName = `TetaSystem_${setDate()}`;
  const fileName = prompt("Nazwa pliku?", defaultFileName);
  const anchor = document.createElement("a");
  anchor.style = "display: none";
  if (!fileName) {
    setAttributes(anchor, { href: url, download: `${defaultFileName}.${fileType}` });
  } else {
    setAttributes(anchor, { href: url, download: `${fileName}.${fileType}` });
  }
  anchor.click();
}

function loadFile(e) {
  const reader = new FileReader();
  reader.onload = function () {
    getSystem(setSystem(JSON.parse(reader.result), "fileLoad"));
  };
  reader.readAsText(e.target.files[0]);
}

function readFromFile() {
  const fileInput = document.getElementById(`readFileInput`);
  fileInput.addEventListener("change", loadFile);
  fileInput.click();
}

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

function handleDroppedFile(e) {
  e.stopPropagation();
  e.preventDefault();
  const dataTransfer = e.dataTransfer;
  const files = e.target.files || dataTransfer.files;
  const reader = new FileReader();
  reader.onload = function () {
    getSystem(setSystem(JSON.parse(reader.result), "test"));
  };
  reader.readAsText(files[0]);
}

function handleDragAndDrop() {
  const dragAndDropContainer = document.querySelector(".dragNDropArea");
  dragAndDropContainer.addEventListener("dragenter", dragenter);
  dragAndDropContainer.addEventListener("dragover", dragover);
  dragAndDropContainer.addEventListener("drop", handleDroppedFile);
}
