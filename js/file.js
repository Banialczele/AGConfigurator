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

// Obsługa ładowania pliku przyciągniętego i upuszczonego na drop area
function handleDropFile(event) {
  event.preventDefault();
  convertAndLoadFileData(event.dataTransfer.files[0]);
}

// Zatrzymanie domyślnej akcji przeglądarki przy ładowaniu pliku
function handleDragOver(event) {
  event.preventDefault();
}

// Obsługa ładowania pliku przez inputa
function handleInputLoadFile(event) {
  convertAndLoadFileData(event.target.files[0]);
}

// Konwersja pliku JSON do obiektu JS i wygenerowanie systemu
function convertAndLoadFileData(file) {
  if (file.type.match("^application/json")) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      const data = reader.result;
      const formattedData = JSON.parse(data);
      createSystemData(formattedData);
      setSystem();
    }
  }
}
