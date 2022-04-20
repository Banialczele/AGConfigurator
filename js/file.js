function prepDataToSaveInFile(systemData) {
  const CSV = [[`Rodzaj urządzenia`, `Nazwa urządzenia`, `ilość`]];
  const sumAllDeviceEntries = systemData.bus.reduce((obj, currentValue) => {
    if (!obj[currentValue.deviceName]) {
      obj[currentValue.deviceName] = 0;
    }
    obj[currentValue.deviceName]++;
    return obj;
  }, {});

  const sumAllCableTypes = systemData.bus.reduce((obj, currentValue) => {
    if (!obj[currentValue.cableType]) {
      obj[currentValue.cableType] = 0;
    }
    obj[currentValue.cableType]++;
    return obj;
  }, {});

  const sumAllCableLengths = systemData.bus.reduce((obj, currentValue) => {
    if (!obj[currentValue.cableType]) {
      obj[currentValue.cableType] = 0;
    }
    obj[currentValue.cableType] += currentValue.cableLen_m;
    return obj;
  }, {});

  const deviceTypes = Object.keys(sumAllDeviceEntries).map(value => {
    const foundDevice = NewDevices.find(device => (device.type === value ? device : ""));
    return foundDevice.device;
  });

  deviceTypes.forEach((device, i) => {
    CSV.push([device, Object.keys(sumAllDeviceEntries)[i], Object.values(sumAllDeviceEntries)[i]]);
  });

  Object.keys(sumAllCableTypes).forEach((cable, i) => {
    CSV.push([`Kabel`, Object.keys(sumAllCableTypes)[i], Object.values(sumAllCableLengths)[i]]);
  });

  CSV.push([`Zasilacz`, systemData.supplyType]);

  return CSV;
}

function systemSketch(dataToSave, saveFileName) {
  const anchor = document.createElement("a");
  anchor.style = "display:none";
  const fileName = `${saveFileName}sketch`;
  if (fileName === null) return;
  const dataAsString = JSON.stringify(dataToSave);
  const blob = new Blob([dataAsString], { type: "text/javascript" });
  anchor.href = window.URL.createObjectURL(blob);
  anchor.download = `${fileName}.json`;
  anchor.click();
}

function saveToFile(dataToSave) {
  const result = prepDataToSaveInFile(dataToSave);
  const csvFile = "data:text/csv/csv;charset=utf-8, " + result.map(element => element.join(",")).join("\n");

  const date = new Date();
  const saveFileName = `TetaSystem_${date.getFullYear()}_${getMonth(date)}_${date.getDate()}__${date.getHours()}_${date.getMinutes()}`;
  const encodedUri = encodeURI(csvFile);
  const anchor = document.createElement("a");
  anchor.style = "display:none";
  const fileName = prompt("Nazwa pliku?", `${saveFileName}`);
  anchor.setAttribute(`href`, encodedUri);
  systemSketch(systemData, fileName);
  if (fileName === null) {
    anchor.setAttribute(`download`, `${saveFileName}.csv`);
  } else {
    anchor.setAttribute(`download`, `${fileName}.csv`);
  }
  anchor.click();
}

function getMonth(date) {
  const month = new Date().getMonth() + 1;
  return month < 10 ? `0${month}` : month;
}

function loadFile(e) {
  console.log("aflkl");
  const reader = new FileReader();
  reader.onload = function () {
    getSystem(setSystem(JSON.parse(reader.result)));
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
    console.log(reader.result);
    getSystem(setSystem(JSON.parse(reader.result)));
  };
  reader.readAsText(files[0]);
}

function handleDragAndDrop() {
  const dragAndDropContainer = document.querySelector(".dragAndDropContainer");
  dragAndDropContainer.addEventListener("dragenter", dragenter);
  dragAndDropContainer.addEventListener("dragover", dragover);
  dragAndDropContainer.addEventListener("drop", handleDroppedFile);
}
