// Inicjacja głównego obiektu z danymi systemu
function createSystemData(fileData = null) {
  if (fileData) {
    systemData.powerSupply = fileData.powerSupply;
    systemData.structureType = fileData.structureType;
    systemData.batteryBackUp = fileData.batteryBackUp;
    systemData.devicesTypes = fileData.devicesTypes;
    systemData.devices = fileData.devices;
  } else {
    systemData.devicesTypes = { detectors: [], signallers: [] };
    systemData.devices = [];
    systemData.powerSupply = initSystem.powerSupply;
    systemData.structureType = initSystem.structureType;
    systemData.batteryBackUp = initSystem.batteryBackUp;
    systemData.devicesTypes.detectors.push({
      name: initSystem.detectorName,
      gasDetected: initSystem.gasDetected,
      docs: DEVICES_DOCS[initSystem.detectorName]
    });
    for (let i = 0; i < initSystem.amountOfDetectors; i++) {
      systemData.devices.push({
        index: i + 1,
        name: initSystem.detectorName,
        gasDetected: initSystem.gasDetected,
        type: initSystem.deviceType,
        wireLength: initSystem.EWL,
        description: ""
      });
    }
  }
}

// Generowanie schematu utworzonego systemu
function createSystemDiagram() {
  const systemDiagram = document.getElementById("systemDiagram");
  systemDiagram.replaceChildren();
  systemData.devices.forEach((device) => systemDiagram.appendChild(createSegmentDiagram(device)));
}

// Tworzenie schematu segmentu urządzenia
function createSegmentDiagram(device) {
  const deviceSegment = document.createElement("div");
  setAttributes(deviceSegment, { class: "deviceSegment", id: `segmentDiagram${device.index}` });
  deviceSegment.appendChild(createSegmentWarningDeviceImageDiagram(device));
  deviceSegment.appendChild(createSegmentBusImageDiagram(device.type));
  deviceSegment.appendChild(createSegmentDetectorImageDiagram(device));

  return deviceSegment;
}

// Tworzenie obrazu detektora dla schematu segmentu urządzenia
function createSegmentDetectorImageDiagram(device) {
  const detectorImageContainer = document.createElement("div");
  const detectorImage = document.createElement("img");
  setAttributes(detectorImageContainer, { class: "detectorImageContainer" });
  detectorImageContainer.appendChild(detectorImage);

  if (device.type === "detector") {
    setAttributes(detectorImage, { src: `./SVG/${device.name}.svg`, alt: "Detector image" });
    detectorImage.style.visibility = "visible";
  } else {
    setAttributes(detectorImage, { src: "", alt: "Detector image" });
    detectorImage.style.visibility = "hidden";
  }

  return detectorImageContainer;
}

// Tworzenie obrazu sygnalizatora dla schematu segmentu urządzenia
function createSegmentWarningDeviceImageDiagram(device) {
  const warningDeviceImageContainer = document.createElement("div");
  const warningDeviceImage = document.createElement("img");
  setAttributes(warningDeviceImageContainer, { class: "warningDeviceImageContainer" });
  warningDeviceImageContainer.appendChild(warningDeviceImage);

  if (device.type !== "detector") {
    setAttributes(warningDeviceImage, { src: `./SVG/${device.name}.svg`, alt: "Warning device image" });
    warningDeviceImage.style.visibility = "visible";
  } else {
    setAttributes(warningDeviceImage, { src: "", alt: "Warning device image" });
    warningDeviceImage.style.visibility = "hidden";
  }

  return warningDeviceImageContainer;
}

// Tworzenie obrazu T-Konektora dla schematu segmentu urządzenia
function createSegmentBusImageDiagram(type) {
  const busImageContainer = document.createElement("div");
  const busImage = document.createElement("img");
  setAttributes(busImageContainer, { class: "busImageContainer" });
  setAttributes(busImage, { src: `./SVG/tcon${type === "detector" ? "P" : "L"}.svg`, alt: "T-Konektor image" });
  busImageContainer.appendChild(busImage);

  return busImageContainer;
}

// Generowanie listy działań dla segmentów utworzonego systemu
function createSystemSegmentsActionsList() {
  const actionsList = document.getElementById("actionsList");
  actionsList.replaceChildren();
  actionsList.appendChild(createSegmentActionsPSU());
  systemData.devices.forEach((device) => actionsList.appendChild(createSegmentActions(device)));
}

// Tworzenie panelu działań dla segmentu urządzenia
function createSegmentActions(device) {
  const actionsSegment = document.createElement("div");
  const wrapper = document.createElement("div");
  const deviceTypeWrapper = document.createElement("div");
  setAttributes(actionsSegment, { class: "actionsSegment", id: `actionsSegment${device.index}`, "data-segmentType": "detectors", "data-segmentIndex": `${device.index}` });
  setAttributes(wrapper, { class: "wrapper" });
  setAttributes(deviceTypeWrapper, { class: "deviceTypeWrapper" });
  wrapper.appendChild(createSegmentIndex(device));
  wrapper.appendChild(deviceTypeWrapper);
  deviceTypeWrapper.appendChild(createSegmentDeviceTypeSelect(device));
  if (device.name === "TOLED") {
    deviceTypeWrapper.appendChild(createSegmentTOLEDDescriptionSelect(device));
  }
  wrapper.appendChild(createSegmentWireLengthInput(device));
  wrapper.appendChild(createSegmentButtons(device));
  actionsSegment.appendChild(wrapper);

  return actionsSegment;
}

// Tworzenie inputa indeksu dla segmentu urządzenia
function createSegmentIndex(device) {
  const segmentIndexLabel = document.createElement("label");
  const segmentIndexInput = document.createElement("input");
  setAttributes(segmentIndexLabel, { class: "segmentIndexLabel", for: `actionsSegmentIndex${device.index}` });
  setAttributes(segmentIndexInput, { class: "segmentId", id: `actionsSegmentIndex${device.index}`, type: "number", min: 0, max: 50, value: device.index, disabled: true });
  segmentIndexLabel.appendChild(document.createTextNode("Segment nr "));
  segmentIndexLabel.appendChild(segmentIndexInput);

  return segmentIndexLabel;
}

// Tworzenie selecta typu urządzeń dla segmentu urządzenia 
function createSegmentDeviceTypeSelect(device) {
  const segmentDeviceSelectContainer = document.createElement("div");
  const segmentDeviceLabel = document.createElement("label");
  const segmentDeviceSelectWrapper = document.createElement("div");
  const segmentDeviceSelect = document.createElement("select");
  setAttributes(segmentDeviceSelectContainer, { class: "segmentDeviceSelectContainer" });
  setAttributes(segmentDeviceLabel, { class: "segmentDeviceLabel", for: `actionsSegmentDevice${device.index}` });
  setAttributes(segmentDeviceSelectWrapper, { class: "formSelectInput" });
  setAttributes(segmentDeviceSelect, { class: "segmentDeviceSelect", id: `actionsSegmentDevice${device.index}` });
  segmentDeviceLabel.appendChild(document.createTextNode("Urządzenie"));
  segmentDeviceSelectContainer.appendChild(segmentDeviceLabel);
  segmentDeviceSelectWrapper.appendChild(segmentDeviceSelect);
  segmentDeviceSelectContainer.appendChild(segmentDeviceSelectWrapper);
  const structureType = STRUCTURE_TYPES.find((structureType) => structureType.type === systemData.structureType);
  structureType.devices.forEach((structureDevice) => {
    const deviceTypeOption = document.createElement("option");
    setAttributes(deviceTypeOption, { value: structureDevice.type });
    if (structureDevice.typeOfDevice === "detector") {
      deviceTypeOption.appendChild(document.createTextNode(`Czujnik ${structureDevice.gasDetected}`));
    } else {
      deviceTypeOption.appendChild(document.createTextNode(`Sygnalizator ${structureDevice.type}`));
    }
    if (device.name === structureDevice.type) {
      setAttributes(deviceTypeOption, { selected: "selected" });
    }
    segmentDeviceSelect.appendChild(deviceTypeOption);
  });
  // Nasłuchiwanie zdarzeń dot. zmiany typu urządzenia w wybranym segmencie
  segmentDeviceSelect.addEventListener("change", (event) => setSegmentDeviceTypeSelectChangeEvent(event, device.index));

  return segmentDeviceSelectContainer;
}

// Ustawienie nasłuchiwania zdarzeń dot. zmiany typu urządzenia w wybranym segmencie
function setSegmentDeviceTypeSelectChangeEvent(event, index) {
  const setDevice = systemData.devices.find((systemDevice) => systemDevice.index === index);
  // Sprawdzenie liczebności urządzeń dotychczas wybranego typu w systemie
  const oldNameDeviceQuantity = systemData.devices.reduce((accumulator, setDeviceType) => {
    if(setDeviceType.name === setDevice.name) {
      return accumulator + 1;
    } else {
      return accumulator;
    }
  }, 0);
  // Usunięcie typu urządzenia z listy wykorzystywanych w systemie, jeśli wybrane było ostatnim
  if ((oldNameDeviceQuantity - 1) < 1) {
    const type = setDevice.type;
    systemData.devicesTypes[`${type}s`] = systemData.devicesTypes[`${type}s`].filter((systemDeviceType) => {
      return systemDeviceType.name !== setDevice.name;
    });
  }
  // Usunięcie opisu urządzenia, jeśli następuje zmiana z typu TOLED na inny
  if (setDevice.name === "TOLED") {
    setDevice.description = "";
  }
  setDevice.name = event.target[event.target.selectedIndex].value;
  const setStructureType = STRUCTURE_TYPES.find((structureType) => structureType.type === systemData.structureType);
  const newDeviceType = setStructureType.devices.find((structureTypeDevice) => structureTypeDevice.type === setDevice.name);
  setDevice.type = newDeviceType.typeOfDevice;
  if (newDeviceType.typeOfDevice === "detector") {
    setDevice.gasDetected = newDeviceType.gasDetected;
    if (!systemData.devicesTypes.detectors.find((systemTypeDevice) => systemTypeDevice.name === newDeviceType.type)) {
      systemData.devicesTypes.detectors.push({
        name: newDeviceType.type,
        gasDetected: newDeviceType.gasDetected,
        docs: DEVICES_DOCS[newDeviceType.type]
      });
    }
  } else {
    setDevice.gasDetected = ""; 
    if (!systemData.devicesTypes.signallers.find((systemTypeDevice) => systemTypeDevice.name === newDeviceType.type)) {
      systemData.devicesTypes.signallers.push({
        name: newDeviceType.type,
        docs: DEVICES_DOCS[newDeviceType.type]
      });
    }
  }
  setSystem();
}

// Tworzenie selecta rodzaju etykiety dla segmentu urządzenia typu TOLED
function createSegmentTOLEDDescriptionSelect(device) {
  // Sprawdzenie czy opis urządzenia był wcześniej ustawiony, w przeciwnym wypadku ustawienie domyślnej wartości
  if (!device.description) {
    device.description = "WE";
  }
  const segmentTOLEDSelectContainer = document.createElement("div");
  const segmentTOLEDLabel = document.createElement("label");
  const segmentTOLEDSelectWrapper = document.createElement("div");
  const segmentTOLEDSelect = document.createElement("select");
  setAttributes(segmentTOLEDSelectContainer, { class: "toledContainer" });
  setAttributes(segmentTOLEDLabel, { class: "toledDescription" });
  setAttributes(segmentTOLEDSelectWrapper, { class: "formSelectInput" });
  setAttributes(segmentTOLEDSelect, { class: "toledSelect" });
  segmentTOLEDLabel.appendChild(document.createTextNode("Napis"));
  segmentTOLEDSelectContainer.appendChild(segmentTOLEDLabel);
  segmentTOLEDSelectWrapper.appendChild(segmentTOLEDSelect);
  segmentTOLEDSelectContainer.appendChild(segmentTOLEDSelectWrapper);
  TOLED_OPTIONS.forEach((option) => {
    const toledOption = document.createElement("option");
    setAttributes(toledOption, { value: option.type });
    toledOption.appendChild(document.createTextNode(option.label));
    if (device.description === option.type) {
      setAttributes(toledOption, { selected: "selected" });
    }
    segmentTOLEDSelect.appendChild(toledOption);
  });
  // Nasłuchiwanie zdarzeń dot. zmiany opisu urządzenia typu TOLED
  segmentTOLEDSelectContainer.addEventListener("change", (event) => setSegmentTOLEDDescriptionSelectChangeEvent(event, device.index));

  return segmentTOLEDSelectContainer;
}

// Ustawienie nasłuchiwania zdarzeń dot. zmiany opisu urządzenia typu TOLED
function setSegmentTOLEDDescriptionSelectChangeEvent(event, index) {
  const setDevice = systemData.devices.find((systemDevice) => systemDevice.index === index);
  setDevice.description = event.target[event.target.selectedIndex].value;
}

// Tworzenie inputa długości kabla (odległości od poprzedniego segmentu) dla segmentu urządzenia
function createSegmentWireLengthInput(device) {
  const segmentWireLengthContainer = document.createElement("div");
  const segmentWireLengthLabel = document.createElement("label");
  const breakLineElem = document.createElement("br");
  const segmentWireLengthInput = document.createElement("input");
  setAttributes(segmentWireLengthContainer, { class: "segmentWireLengthContainer" });
  setAttributes(segmentWireLengthLabel, { class: "segmentWireLengthLabel", for: `actionsSegmentWireLength${device.index}` });
  setAttributes(segmentWireLengthInput, { class: "segmentWireLength", id: `actionsSegmentWireLength${device.index}`, type: "number", min: 1, value: device.wireLength });
  segmentWireLengthLabel.appendChild(document.createTextNode("Odległość do poprzedniego segmentu"));
  segmentWireLengthContainer.appendChild(segmentWireLengthLabel);
  segmentWireLengthContainer.appendChild(breakLineElem);
  segmentWireLengthContainer.appendChild(segmentWireLengthInput);
  segmentWireLengthContainer.appendChild(document.createTextNode("m"));
  segmentWireLengthInput.addEventListener("change", (event) => setSegmentWireLengthInputChangeEvent(event, device.index));

  return segmentWireLengthContainer;
}

// Ustawienie nasłuchiwania zdarzeń dot. długości kabla (odległości od poprzedniego segmentu) w wybranym segmencie
function setSegmentWireLengthInputChangeEvent(event, index) {
  const setDevice = systemData.devices.find((systemDevice) => systemDevice.index === index);
  const newValue = parseInt(event.target.value);
  if (newValue > 0) {
    setDevice.wireLength = newValue;
  } else {
    setDevice.wireLength = 0;
  }
  setSystemStateBusLength();
}

// Tworzenie przycisków akcji dla segmentu urządzenia 
function createSegmentButtons(device) {
  const segmentButtonsContainer = document.createElement("div");
  const duplicateDeviceButton = document.createElement("button");
  const removeDeviceButton = document.createElement("button");
  setAttributes(segmentButtonsContainer, { class: "segmentButtonsContainer" });
  setAttributes(duplicateDeviceButton, { class: "duplicateDeviceButton", id: `duplicateDevice${device.index}` });
  setAttributes(removeDeviceButton, { class: "removeDeviceButton", id: `removeDevice${device.index}` });
  duplicateDeviceButton.appendChild(document.createTextNode("+"));
  removeDeviceButton.appendChild(document.createTextNode("–"));
  segmentButtonsContainer.appendChild(duplicateDeviceButton);
  segmentButtonsContainer.appendChild(removeDeviceButton);
  duplicateDeviceButton.addEventListener("click", (event) => setSegmentDuplicateDeviceButtonClickEvent(device.index));
  removeDeviceButton.addEventListener("click", (event) => setSegmentRemoveDeviceButtonClickEvent(device.index));

  return segmentButtonsContainer;
}

// Ustawienie nasłuchiwania zdarzeń dot. powielenia segmentu z tymi samymi parametrami
function setSegmentDuplicateDeviceButtonClickEvent(index) {
  const duplicatedDevice = structuredClone(systemData.devices.find((systemDevice) => systemDevice.index === index));
  duplicatedDevice.index = index + 1;
  systemData.devices.forEach((device) => {
    if (device.index > index) {
      return device.index += 1;
    }
  });
  systemData.devices.splice(index, 0, duplicatedDevice);
  setSystem();
}

// Ustawienie nasłuchiwania zdarzeń dot. usunięcia segmentu
function setSegmentRemoveDeviceButtonClickEvent(index) {
  const setDevice = systemData.devices.find((systemDevice) => systemDevice.index === index);
  // Sprawdzenie liczebności urządzeń dotychczas wybranego typu w systemie
  const oldNameDeviceQuantity = systemData.devices.reduce((accumulator, setDeviceType) => {
    if(setDeviceType.name === setDevice.name) {
      return accumulator + 1;
    } else {
      return accumulator;
    }
  }, 0);
  // Usunięcie typu urządzenia z listy wykorzystywanych w systemie, jeśli wybrane było ostatnim
  if ((oldNameDeviceQuantity - 1) < 1) {
    const type = setDevice.type;
    systemData.devicesTypes[`${type}s`] = systemData.devicesTypes[`${type}s`].filter((systemDeviceType) => {
      return systemDeviceType.name !== setDevice.name;
    });
  }
  systemData.devices.splice(setDevice.index - 1, 1);
  if (systemData.devices.length > 0) {
    systemData.devices.forEach((device) => {
      if (device.index > setDevice.index) {
        return device.index -= 1;
      }
    });
  }
  setSystem();
}

// Tworzenie panelu działań dla segmentu jednostki sterującej
function createSegmentActionsPSU() {
  const actionsSegment = document.createElement("div");
  const wrapper = document.createElement("div");
  const segmentIndexLabel = document.createElement("label");
  const segmentDeviceLabel = document.createElement("label");
  const breakLineElem = document.createElement("br");
  setAttributes(actionsSegment, { class: "actionsSegment", id: "actionsSegment0", "data-segmentType": "PSU", "data-segmentIndex": "0" });
  setAttributes(wrapper, { class: "wrapper" });
  setAttributes(segmentIndexLabel, { class: "segmentIndexLabel", for: "actionsSegmentIndex0" });
  setAttributes(segmentDeviceLabel, { class: "segmentDeviceLabel", for: "actionsSegmentDevice0" });
  segmentIndexLabel.appendChild(document.createTextNode("Segment nr "));
  segmentDeviceLabel.appendChild(document.createTextNode("Urządzenie"));
  actionsSegment.appendChild(wrapper);
  wrapper.appendChild(segmentIndexLabel);
  wrapper.appendChild(segmentDeviceLabel);
  const segmentIndexInput = document.createElement("input");
  const segmentDeviceInput = document.createElement("input");
  setAttributes(segmentIndexInput, { class: "segmentId", id: "actionsSegmentIndex0", type: "number", min: 0, max: 50, value: 0, disabled: true });
  setAttributes(segmentDeviceInput, { class: "segmentDeviceSelect", id: "actionsSegmentDevice0", value: systemData.powerSupply });
  segmentIndexLabel.appendChild(segmentIndexInput);
  segmentDeviceLabel.appendChild(breakLineElem);
  segmentDeviceLabel.appendChild(segmentDeviceInput);

  return actionsSegment;
}

// Tworzenie panelu stanu systemu
function setSystemStatePanel() {
  setSystemStateDetectorsList();
  setSystemStateSignallersList();
  setSystemStateAccessories();
  setSystemStateBusLength();
  setSystemStatePowerConsumption();
}

// Ustawienie typów gazu mierzonych przez wybrane czujniki + liczebności tych czujników w panelu stanu
function setSystemStateDetectorsList() {
  const detectorsList = document.getElementById("detectorsList");
  detectorsList.replaceChildren();
  systemData.devicesTypes.detectors.forEach((detector) => {
    const detectorListItem = document.createElement("li");
    const detectorTypeContainer = document.createElement("div");
    const detectorQuantityContainer = document.createElement("div");
    const detectorQuantity = document.createElement("span");
    const quantity = systemData.devices.reduce((accumulator, device) => {
      if (detector.gasDetected === device.gasDetected) {
        return accumulator + 1;
      } else {
        return accumulator;
      }
    }, 0);
    detectorTypeContainer.appendChild(document.createTextNode(detector.gasDetected));
    detectorQuantity.appendChild(document.createTextNode(quantity));
    detectorQuantityContainer.appendChild(detectorQuantity)
    detectorQuantityContainer.appendChild(document.createTextNode("szt."))
    detectorListItem.appendChild(detectorTypeContainer);
    detectorListItem.appendChild(detectorQuantityContainer);
    detectorsList.appendChild(detectorListItem);
  });
}

// Ustawienie rodzajów sygnalizatorów + ich liczebności w panelu stanu
function setSystemStateSignallersList() {
  const signallersList = document.getElementById("signallersList");
  signallersList.replaceChildren();
  systemData.devicesTypes.signallers.forEach((signaller) => {
    const signallerListItem = document.createElement("li");
    const signallerTypeContainer = document.createElement("div");
    const signallerQuantityContainer = document.createElement("div");
    const signallerQuantity = document.createElement("span");
    const quantity = systemData.devices.reduce((accumulator, device) => {
      if (signaller.name === device.name) {
        return accumulator + 1;
      } else {
        return accumulator;
      }
    }, 0);
    if (signaller.name === "TOLED") {
      signallerTypeContainer.appendChild(document.createTextNode("Tablica ostrzegawcza"));
    } else {
      signallerTypeContainer.appendChild(document.createTextNode("Optyczno-akustyczne"));
    }
    signallerQuantity.appendChild(document.createTextNode(quantity));
    signallerQuantityContainer.appendChild(signallerQuantity);
    signallerQuantityContainer.appendChild(document.createTextNode("szt."));
    signallerListItem.appendChild(signallerTypeContainer);
    signallerListItem.appendChild(signallerQuantityContainer);
    signallersList.appendChild(signallerListItem);
  });
}

// Ustawienie akcesoriów + ich liczebności w panelu stanu
function setSystemStateAccessories() {
  const accessoriesList = document.getElementById("accessoriesList");
  accessoriesList.replaceChildren();
  const accessoryListItem = document.createElement("li");
  const accessoryTypeContainer = document.createElement("div");
  const accessoryQuantityContainer = document.createElement("div");
  const accessoryQuantity = document.createElement("span");
  accessoryTypeContainer.appendChild(document.createTextNode("T-Konektor"));
  accessoryQuantity.appendChild(document.createTextNode(systemData.devices.length));
  accessoryQuantityContainer.appendChild(accessoryQuantity);
  accessoryQuantityContainer.appendChild(document.createTextNode("szt."));
  accessoryListItem.appendChild(accessoryTypeContainer);
  accessoryListItem.appendChild(accessoryQuantityContainer);
  accessoriesList.appendChild(accessoryListItem);
}

// Ustawienie długości magistrali w panelu stanu 
function setSystemStateBusLength() {
  const busLength = document.getElementById("busLength");
  const busLengthValue = systemData.devices.reduce((accumulator, device) => accumulator + device.wireLength, 0);
  busLength.replaceChildren(busLength.appendChild(document.createTextNode(busLengthValue)));
}

// Ustawienie wartości zużycia energii dla systemu w panelu stanu
function setSystemStatePowerConsumption(value = 25) {
  const powerConsumption = document.getElementById("powerConsumption");
  powerConsumption.replaceChildren(powerConsumption.appendChild(document.createTextNode(value)));
}

// Tworzenie panelu z listą rodzajów wykorzystanych w systemie urządzeń
function createSystemUsedDevicesPanel() {
  const systemUsedDevicesContainer = document.getElementById("usedDevicesContainer");
  systemUsedDevicesContainer.replaceChildren();
  const { detectors, signallers } = systemData.devicesTypes;
  systemUsedDevicesContainer.appendChild(setSystemUsedPSU(systemData.powerSupply));
  detectors.forEach((detector) => systemUsedDevicesContainer.appendChild(setSystemUsedDevice(detector)));
  signallers.forEach((signaller) => systemUsedDevicesContainer.appendChild(setSystemUsedDevice(signaller, true)));
}

// Ustawienie wykorzystanego w systemie rodzaju jednostki sterującej
function setSystemUsedPSU(powerSupply) {
  const systemUsedPSU = document.createElement("div");
  const systemUsedPSUDataContainer = document.createElement("div");
  const systemUsedPSUImageContainer = document.createElement("div");
  setAttributes(systemUsedPSU, { class: "usedDeviceItem", id: "usedPSU" });
  setAttributes(systemUsedPSUDataContainer, { class: "systemUsedDeviceDataContainer" });
  setAttributes(systemUsedPSUImageContainer, { class: "usedDeviceImageContainer" });
  const systemUsedPSUName = document.createElement("p");
  const systemUsedPSUType = document.createElement("p");
  const systemUsedPSUBreak = document.createElement("br");
  const systemUsedPSUDocsLink = document.createElement("a");
  const systemUsedPSUImage = document.createElement("img");
  setAttributes(systemUsedPSUName, { class: "usedDeviceName" });
  setAttributes(systemUsedPSUType, { class: "systemUsedDeviceType" });
  setAttributes(systemUsedPSUDocsLink, { class: "usedDeviceDocs", href: "https://www.atestgaz.pl/produkt/modul-js-teta-mod-control-1", target: "_blank" });
  setAttributes(systemUsedPSUImage, { src: `./PNG/${powerSupply}.png`, alt: `${powerSupply} image` });
  systemUsedPSUName.appendChild(document.createTextNode(powerSupply));
  systemUsedPSUType.appendChild(document.createTextNode("Moduł jednostki sterującej"));
  systemUsedPSUDocsLink.appendChild(document.createTextNode("Dokumentacja techniczna"));
  systemUsedPSUDataContainer.appendChild(systemUsedPSUName);
  systemUsedPSUDataContainer.appendChild(systemUsedPSUType);
  systemUsedPSUDataContainer.appendChild(systemUsedPSUBreak);
  systemUsedPSUDataContainer.appendChild(systemUsedPSUDocsLink);
  systemUsedPSUImageContainer.appendChild(systemUsedPSUImage);
  systemUsedPSU.appendChild(systemUsedPSUDataContainer);
  systemUsedPSU.appendChild(systemUsedPSUImageContainer);
  return systemUsedPSU;
}

// Ustawienie wykorzystanego w systemie rodzaju urządzenia
function setSystemUsedDevice(device, isSignaller = false) {
  const systemUsedDevice = document.createElement("div");
  const systemUsedDeviceDataContainer = document.createElement("div");
  const systemUsedDeviceImageContainer = document.createElement("div");
  setAttributes(systemUsedDevice, { class: "usedDeviceItem", id: `used${device.name.replace(/ |\+/g, "")}Device` });
  setAttributes(systemUsedDeviceDataContainer, { class: "systemUsedDeviceDataContainer" });
  setAttributes(systemUsedDeviceImageContainer, { class: "usedDeviceImageContainer" });
  const systemUsedDeviceName = document.createElement("p");
  const systemUsedDeviceType = document.createElement("p");
  const systemUsedDeviceBreak = document.createElement("br");
  const systemUsedDeviceDocsLink = document.createElement("a");
  const systemUsedDeviceImage = document.createElement("img");
  setAttributes(systemUsedDeviceName, { class: "usedDeviceName" });
  setAttributes(systemUsedDeviceType, { class: "systemUsedDeviceType" });
  setAttributes(systemUsedDeviceDocsLink, { class: "usedDeviceDocs", href: device.docs, target: "_blank" });
  setAttributes(systemUsedDeviceImage, { src: `./PNG/${device.name}.png`, alt: `${device.name} image` });
  systemUsedDeviceName.appendChild(document.createTextNode(device.name));
  if (!isSignaller) {
    systemUsedDeviceType.appendChild(document.createTextNode(`Czujnik gazu ${device.gasDetected}`));
  } else {
    systemUsedDeviceType.appendChild(document.createTextNode("Sygnalizator opt.-aku."));
  }
  systemUsedDeviceDocsLink.appendChild(document.createTextNode("Dokumentacja techniczna"));
  systemUsedDeviceDataContainer.appendChild(systemUsedDeviceName);
  systemUsedDeviceDataContainer.appendChild(systemUsedDeviceType);
  systemUsedDeviceDataContainer.appendChild(systemUsedDeviceBreak);
  systemUsedDeviceDataContainer.appendChild(systemUsedDeviceDocsLink);
  systemUsedDeviceImageContainer.appendChild(systemUsedDeviceImage);
  systemUsedDevice.appendChild(systemUsedDeviceDataContainer);
  systemUsedDevice.appendChild(systemUsedDeviceImageContainer);

  return systemUsedDevice;
}

// Tworzenie systemu
function setSystem() {
  createSystemDiagram();
  createSystemSegmentsActionsList();
  setSystemStatePanel();
  createSystemUsedDevicesPanel();
}

// Ustawienie nasłuchiwania zdarzeń dot. eksportu systemu do pliku CSV
function setExportToCSVButtonEvent() {
  const exportToCSVButton = document.getElementById("exportToCSV");
  exportToCSVButton.addEventListener("click", () => exportToCSV());
}

// Ustawienie nasłuchiwania zdarzeń dot. eksportu zestawienia urządzeń do pliku JSON
function setExportToJSONButtonEvent() {
  const exportToCSVButton = document.getElementById("exportToJSON");
  exportToCSVButton.addEventListener("click", () => exportToJSON());
}
