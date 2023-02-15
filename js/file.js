// Wyeksportowanie danych systemu do pliku CSV i pobranie go przez użytkownika
function exportToCSV(dataToSave) {
  const formattedData = setDataToCSVFormat();
  const csvFile = "data:text/csv/csv;charset=utf-8, " + formattedData.map(element => element.join(",")).join("\n");
  console.log("XD");
  const date = new Date();
  const saveFileName = `TetaSystem_${date.getFullYear()}_${getMonth(date)}_${date.getDate()}__${date.getHours()}_${date.getMinutes()}`;
  const encodedUri = encodeURI(csvFile);
  const anchor = document.createElement("a");
  anchor.style = "display:none";
  const fileName = prompt("Nazwa pliku?", `${saveFileName}`);
  anchor.setAttribute(`href`, encodedUri);
  if (fileName === null) {
    anchor.setAttribute(`download`, `${saveFileName}.csv`);
  } else {
    anchor.setAttribute(`download`, `${fileName}.csv`);
  }
  anchor.click();
}

// Przygotowanie danych systemu do formatu CSV
function setDataToCSVFormat() {
  const columnTitles = ["Rodzaj urządzenia", "Nazwa urządzenia", "Ilość"];
  const rows = [];
  insertDeviceTypeData("detectors", "Czujnik gazu", rows);
  insertDeviceTypeData("signallers", "Sygnalizator", rows);
  insertDeviceTypeWireLengthData("detector", "czujniki gazu", rows);
  insertDeviceTypeWireLengthData("signaller", "sygnalizatory", rows);
  rows.push(["Zasilacz", systemData.powerSupply, "1 szt."]);

  return [columnTitles, ...rows];
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

function exportToJSON(dataToSave, saveFileName) {
  console.log("chuj w dupe JS");
  const anchor = document.createElement("a");
  anchor.style = "display:none";
  const fileName = `${saveFileName}sketch`;
  if (fileName === null) return;
  const dataAsString = JSON.stringify(dataToSave);
  const blob = new Blob([dataAsString], { type: "text/javascript" });
  anchor.href = window.URL.createObjectURL(blob);
  anchor.download = `${fileName}.json`;
  saveToFile(dataToSave);

  anchor.click();
}

function getMonth(date) {
  const month = new Date().getMonth() + 1;
  return month < 10 ? `0${month}` : month;
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
