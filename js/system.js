// Inicjacja głównego obiektu z danymi systemu
function createSystemData() {
  systemData.devicesTypes = { detectors: [], signallers: [] };
  systemData.devices = [];
  systemData.powerSupply = initSystem.powerSupply;
  systemData.structureType = initSystem.structureType;
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
    })
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
  deviceSegment.appendChild(createSegmentBusImageDiagram());
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
function createSegmentBusImageDiagram() {
  const busImageContainer = document.createElement("div");
  const busImage = document.createElement("img");
  setAttributes(busImageContainer, { class: "busImageContainer" });
  setAttributes(busImage, { src: "./SVG/tconP.svg", alt: "T-Konektor image" });
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
  const segmentIndexLabel = document.createElement("label");
  const segmentButtonsContainer = document.createElement("div");
  setAttributes(actionsSegment, { class: "actionsSegment", id: `actionsSegment${device.index}`, "data-segmentType": "detectors", "data-segmentIndex": `${device.index}` });
  setAttributes(segmentButtonsContainer, { class: "segmentButtonsContainer" });
  actionsSegment.appendChild(segmentIndexLabel);
  actionsSegment.appendChild(createSegmentDeviceTypeSelect(device));
  if (device.name === "TOLED") {
    actionsSegment.appendChild(createSegmentTOLEDDescriptionSelect(device));
  }
  actionsSegment.appendChild(createSegmentWireLengthInput(device));
  actionsSegment.appendChild(segmentButtonsContainer);
  setAttributes(segmentIndexLabel, { class: "segmentIndexLabel", for: `actionsSegmentIndex${device.index}` });
  segmentIndexLabel.appendChild(document.createTextNode("Segment nr "));
  const segmentIndexInput = document.createElement("input");
  const duplicateDeviceButton = document.createElement("button");
  const duplicateButtonImage = document.createElement("img");
  const removeDeviceButton = document.createElement("button");
  const removeButtonImage = document.createElement("img");
  setAttributes(segmentIndexInput, { class: "segmentId", id: `actionsSegmentIndex${device.index}`, type: "number", min: 0, max: 50, value: device.index });
  setAttributes(duplicateDeviceButton, { class: "duplicateDeviceButton", id: `duplicateDevice${device.index}` });
  setAttributes(duplicateButtonImage, { src: "./SVG/add.svg", alt: "Duplicate device button" });
  setAttributes(removeDeviceButton, { class: "removeDeviceButton", id: `removeDevice${device.index}` });
  setAttributes(removeButtonImage, { src: "./SVG/remove.svg", alt: "Remove device button" });
  segmentIndexLabel.appendChild(segmentIndexInput);
  segmentButtonsContainer.appendChild(duplicateDeviceButton);
  segmentButtonsContainer.appendChild(removeDeviceButton);
  duplicateDeviceButton.appendChild(duplicateButtonImage);
  removeDeviceButton.appendChild(removeButtonImage);

  return actionsSegment;
}

// Tworzenie selecta typu urządzeń dla segmentu urządzenia 
function createSegmentDeviceTypeSelect(device) {
  const segmentDeviceSelectContainer = document.createElement("div");
  const segmentDeviceLabel = document.createElement("label");
  const segmentDeviceSelect = document.createElement("select");
  setAttributes(segmentDeviceSelectContainer, { class: "segmentDeviceSelectContainer" });
  setAttributes(segmentDeviceLabel, { class: "segmentDeviceLabel", for: `actionsSegmentDevice${device.index}` });
  setAttributes(segmentDeviceSelect, { class: "segmentDeviceSelect", id: `actionsSegmentDevice${device.index}` });
  segmentDeviceLabel.appendChild(document.createTextNode("Urządzenie"));
  segmentDeviceSelectContainer.appendChild(segmentDeviceLabel);
  segmentDeviceSelectContainer.appendChild(segmentDeviceSelect);
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
  const segmentTOLEDSelect = document.createElement("select");
  setAttributes(segmentTOLEDSelectContainer, { class: "toledContainer" });
  setAttributes(segmentTOLEDLabel, { class: "toledDescription" });
  setAttributes(segmentTOLEDSelect, { class: "toledSelect" });
  segmentTOLEDLabel.appendChild(document.createTextNode("Napis"));
  segmentTOLEDSelectContainer.appendChild(segmentTOLEDLabel);
  segmentTOLEDSelectContainer.appendChild(segmentTOLEDSelect);
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
  const segmentWireLengthInput = document.createElement("input");
  setAttributes(segmentWireLengthContainer, { class: "segmentWireLengthContainer" });
  setAttributes(segmentWireLengthLabel, { class: "segmentWireLengthLabel", for: `actionsSegmentWireLength${device.index}` });
  setAttributes(segmentWireLengthInput, { class: "segmentWireLength", id: `actionsSegmentWireLength${device.index}`, type: "number", min: 1, value: device.wireLength });
  segmentWireLengthLabel.appendChild(document.createTextNode("Odległość do poprzedniego segmentu"));
  segmentWireLengthContainer.appendChild(segmentWireLengthLabel);
  segmentWireLengthContainer.appendChild(segmentWireLengthInput);

  return segmentWireLengthContainer;
}

// Ustawienie nasłuchiwania zdarzeń dot. długości kabla (odległości od poprzedniego segmentu) w wybranym segmencie
function setSegmentWireLengthInputChangeEvent(event, index) {

}

// Tworzenie panelu działań dla segmentu jednostki sterującej
function createSegmentActionsPSU() {
  const actionsSegment = document.createElement("div");
  const segmentIndexLabel = document.createElement("label");
  const segmentDeviceLabel = document.createElement("label");
  setAttributes(actionsSegment, { class: "actionsSegment", id: "actionsSegment0", "data-segmentType": "PSU", "data-segmentIndex": "0" });
  setAttributes(segmentIndexLabel, { class: "segmentIndexLabel", for: "actionsSegmentIndex0" });
  setAttributes(segmentDeviceLabel, { class: "segmentDeviceLabel", for: "actionsSegmentDevice0" });
  segmentIndexLabel.appendChild(document.createTextNode("Segment nr "));
  segmentDeviceLabel.appendChild(document.createTextNode("Urządzenie"));
  actionsSegment.appendChild(segmentIndexLabel);
  actionsSegment.appendChild(segmentDeviceLabel);
  const segmentIndexInput = document.createElement("input");
  const segmentDeviceInput = document.createElement("input");
  setAttributes(segmentIndexInput, { class: "segmentId", id: "actionsSegmentIndex0", type: "number", min: 0, max: 50, value: 0 });
  setAttributes(segmentDeviceInput, { class: "segmentDeviceSelect", id: "actionsSegmentDevice0", value: systemData.powerSupply });
  segmentIndexLabel.appendChild(segmentIndexInput);
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
  const detectorsTypesList = document.getElementById("detectorsTypesList");
  const detectorsQuantityList = document.getElementById("detectorsQuantityList");
  detectorsTypesList.replaceChildren();
  detectorsQuantityList.replaceChildren();
  systemData.devicesTypes.detectors.forEach((detector) => {
    const detectorListItem = document.createElement("li");
    const detectorQuantityListItem = document.createElement("li");
    const detectorQuantity = systemData.devices.reduce((accumulator, device) => {
      if (detector.gasDetected === device.gasDetected) {
        return accumulator + 1;
      } else {
        return accumulator;
      }
    }, 0);
    detectorListItem.appendChild(document.createTextNode(detector.gasDetected));
    detectorQuantityListItem.appendChild(document.createTextNode(`${detectorQuantity} szt.`));
    detectorsTypesList.appendChild(detectorListItem);
    detectorsQuantityList.appendChild(detectorQuantityListItem);
  });
}

// Ustawienie rodzajów sygnalizatorów + ich liczebności w panelu stanu
function setSystemStateSignallersList() {
  const signallersTypesList = document.getElementById("signallersTypesList");
  const signallersQuantityList = document.getElementById("signallersQuantityList");
  signallersTypesList.replaceChildren();
  signallersQuantityList.replaceChildren();
  systemData.devicesTypes.signallers.forEach((signaller) => {
    const signallerListItem = document.createElement("li");
    const signallerQuantityListItem = document.createElement("li");
    const signallerQuantity = systemData.devices.reduce((accumulator, device) => {
      if (signaller.name === device.name) {
        return accumulator + 1;
      } else {
        return accumulator;
      }
    }, 0);
    signallerListItem.appendChild(document.createTextNode(signaller.name));
    signallerQuantityListItem.appendChild(document.createTextNode(`${signallerQuantity} szt.`));
    signallersTypesList.appendChild(signallerListItem);
    signallersQuantityList.appendChild(signallerQuantityListItem);
  });
}

// Ustawienie akcesoriów + ich liczebności w panelu stanu
function setSystemStateAccessories() {
  const accessoriesList = document.getElementById("accessoriesList");
  const accessoriesQuantityList = document.getElementById("accessoriesQuantityList");
  accessoriesList.replaceChildren();
  accessoriesQuantityList.replaceChildren();
  accessoriesList.appendChild(document.createTextNode("T-Konektor"));
  accessoriesQuantityList.appendChild(document.createTextNode(`${systemData.devices.length} szt.`));
}

// Ustawienie długości magistrali w panelu stanu 
function setSystemStateBusLength() {
  const busLength = document.getElementById("busLength");
  const busLengthValue = systemData.devices.reduce((accumulator, device) => accumulator + device.wireLength, 0);
  busLength.replaceChildren(busLength.appendChild(document.createTextNode(`${busLengthValue} m.`)))
}

// Ustawienie wartości zużycia energii dla systemu w panelu stanu
function setSystemStatePowerConsumption(value = 25) {
  const powerConsumption = document.getElementById("powerConsumption");
  powerConsumption.replaceChildren(powerConsumption.appendChild(document.createTextNode(`${value} W`)));
}

// Tworzenie panelu z listą rodzajów wykorzystanych w systemie urządzeń
function createSystemUsedDevicesPanel() {
  const systemUsedDevicesContainer = document.getElementById("usedDevicesContainer");
  systemUsedDevicesContainer.replaceChildren();
  const { detectors, signallers } = systemData.devicesTypes;
  detectors.forEach((detector) => systemUsedDevicesContainer.appendChild(setSystemUsedDevice(detector)));
  signallers.forEach((signaller) => systemUsedDevicesContainer.appendChild(setSystemUsedDevice(signaller, true)));
}

// Ustawienie wykorzystanego w systemie rodzaju urządzenia
function setSystemUsedDevice(device, isSignaller = false) {
  const systemUsedDeviceContainer = document.createElement("div");
  const systemUsedDevice = document.createElement("div");
  const systemUsedDeviceDivider = document.createElement("div");
  setAttributes(systemUsedDeviceContainer, { class: "usedDevicePair" });
  setAttributes(systemUsedDevice, { class: "usedDeviceItem", id: `used${device.name.replace(/ |\+/g, "")}Device` });
  setAttributes(systemUsedDeviceDivider, { class: "usedDeviceDivider" });
  systemUsedDeviceContainer.appendChild(systemUsedDevice);
  systemUsedDeviceContainer.appendChild(systemUsedDeviceDivider);
  const systemUsedDeviceName = document.createElement("div");
  const systemUsedDeviceDocs = document.createElement("div");
  const systemUsedDeviceImageContainer = document.createElement("div");
  setAttributes(systemUsedDeviceName, { class: "usedDeviceName" });
  setAttributes(systemUsedDeviceDocs, { class: "usedDeviceDocs" });
  setAttributes(systemUsedDeviceImageContainer, { class: "usedDeviceImageContainer" });
  systemUsedDeviceName.appendChild(document.createTextNode(device.name));
  const systemUsedDeviceDocsLink = document.createElement("a");
  const systemUsedDeviceImage = document.createElement("img");
  setAttributes(systemUsedDeviceDocsLink, { class: "usedDeviceDocsAnchor", href: device.docs, target: "_blank" });
  setAttributes(systemUsedDeviceImage, { src: `./PNG/${device.name}.png`, alt: `${device.name} image` });
  systemUsedDeviceDocsLink.appendChild(document.createTextNode("Dokumentacja techniczna"));
  systemUsedDeviceDocs.appendChild(systemUsedDeviceDocsLink);
  systemUsedDeviceImageContainer.appendChild(systemUsedDeviceImage);
  systemUsedDevice.appendChild(systemUsedDeviceName);
  if (!isSignaller) {
    const systemUsedDeviceGasDetected = document.createElement("div");
    setAttributes(systemUsedDeviceGasDetected, { class: "usedDeviceGasDetected" });
    systemUsedDeviceGasDetected.appendChild(document.createTextNode(device.gasDetected));
    systemUsedDevice.appendChild(systemUsedDeviceGasDetected);
  }
  systemUsedDevice.appendChild(systemUsedDeviceDocs);
  systemUsedDevice.appendChild(systemUsedDeviceImageContainer);

  return systemUsedDeviceContainer;
}

// Tworzenie systemu
function setSystem() {
  createSystemDiagram();
  createSystemSegmentsActionsList();
  setSystemStatePanel();
  createSystemUsedDevicesPanel();
}

//W kodzie jest getter i setter systemu, jakby komuś przyszło na myśl generowanie systemu po JSONie :)
function getSystem(sys) {
  return sys;
}

function saveSketch() {
  const systemSketchButton = document.querySelector(`.systemSketch`);
  systemSketchButton.addEventListener(`click`, e => {
    const reducer = systemStatusReducer();
    systemSketch(reducer, `sketch`);
  });
}

function saveListOfDevices() {
  const listOfDevices = document.querySelector(`.systemRecord`);
  listOfDevices.addEventListener(`click`, e => {
    const reducer = systemStatusReducer();
    saveToFile(reducer);
  });
}

// function addRemoveActionListener() {
//   const segmentListeners = document.querySelector(`.actionsList`);
//   segmentListeners.addEventListener(
//     `click`,
//     e => {
//       if (e.target.name === `addSegment`) {
//         const listOfSegments = Array.from(document.querySelectorAll(`.actionsSegment`));
//         const segmentClicked = e.target.closest(`.actionsSegment`);
//         const indexOfClickedSegment = listOfSegments.indexOf(segmentClicked);

//         const listOfdeviceSegments = document.querySelectorAll(`.deviceSegment`);
//         const deviceSegment = listOfdeviceSegments[indexOfClickedSegment - 1];
//         const objToCopy = JSON.parse(JSON.stringify(SYSTEM.bus[indexOfClickedSegment - 1]));
//         SYSTEM.bus.splice(indexOfClickedSegment, 0, objToCopy);
//         const clonedSegment = segmentClicked.cloneNode(true);
//         const clonedSegmentSelect = clonedSegment.querySelector(`.segmentDeviceSelect`);
//         clonedSegmentSelect.value = SYSTEM.bus[indexOfClickedSegment].detectorName;
//         const clonedsegmentIdentifier = clonedSegment.querySelector(`.segmentIdentifier`);
//         clonedsegmentIdentifier.value = `${listOfSegments.length}`;
//         const clonedPreview = deviceSegment.cloneNode(true);
//         segmentClicked.after(clonedSegment);
//         deviceSegment.after(clonedPreview);

//         const reducer = systemStatusReducer();
//         setSystemStateDetectorsList();
//         setSystemStateSignallersList();
//         setSystemStateAccessories();
//         setSystemStateBusLength();
//         setSystemStatePowerConsumption();
//         selectEvent(clonedSegmentSelect);
//         createSystemUsedDevicesPanel();
//       } else if (e.target.name === `removeSegment`) {
//         const listOfSegments = Array.from(document.querySelectorAll(`.actionsSegment`));
//         const segmentClicked = e.target.closest(`.actionsSegment`);
//         const indexOfClickedSegment = listOfSegments.indexOf(segmentClicked);

//         const listOfdeviceSegments = document.querySelectorAll(`.deviceSegment`);
//         const deviceSegment = listOfdeviceSegments[indexOfClickedSegment - 1];
//         if (listOfdeviceSegments.length > 1) {
//           SYSTEM.bus.splice(indexOfClickedSegment - 1, 1);
//           segmentClicked.remove();
//           deviceSegment.remove();
//         }
//         const reducer = systemStatusReducer();
//         setSystemStateDetectorsList();
//         setSystemStateSignallersList();
//         setSystemStateAccessories();
//         setSystemStateBusLength();
//         setSystemStatePowerConsumption();
//         createSystemUsedDevicesPanel();
//       }
//     },
//     true
//   );
// }

// function selectEvent(select) {
//   select.addEventListener(`change`, e => {
//     const listOfSegments = Array.from(document.querySelectorAll(`.actionsSegment`));
//     const segmentClicked = e.target.closest(`.actionsSegment`);
//     const i = listOfSegments.indexOf(segmentClicked) - 1;

//     SYSTEM.bus[i].detectorName = e.target.value;
//     if (e.target.value === `Teta SZOA`) {
//       SYSTEM.bus[i].deviceType = `signaller`;
//       delete SYSTEM.bus[i].toledText;
//       const container = document.querySelector(`#actionsSegment${i + 1}`);
//       const toled = document.querySelector(`#actionsSegment${i + 1} .toledContainer`);
//       if (toled) {
//         container.removeChild(toled);
//       }
//     } else if (e.target.value === `TOLED`) {
//       SYSTEM.bus[i].deviceType = `signaller`;
//       // createSegmentTOLEDDescriptionSelect();
//     } else {
//       SYSTEM.bus[i].deviceType = `detector`;
//       SYSTEM.bus[i].gasDetected = e.target.options[e.target.selectedIndex].getAttribute(`data-detectedgas`);
//       delete SYSTEM.bus[i].toledText;
//       const container = document.querySelector(`#actionsSegment${i + 1}`);
//       const toled = document.querySelector(`#actionsSegment${i + 1} .toledContainer`);
//       if (toled) {
//         container.removeChild(toled);
//       }
//     }
//     const reduced = systemStatusReducer();
//     //Od tego miejsca tworzone są funkcje które tworzą elementy na liście "Stan systemu" Te funkcje pewnie da się zredukować do jednej, ale nie mam pomysłu jak, a IFowanie to uważam, że słaba opcja. Ewentualnie switch i przekazywać paramentr który warunek ma się wykonywać, ale nie wiem. Jak Ci się uda zoptymalizować to byłoby super.
//     setSystemStateDetectorsList();
//     setSystemStateSignallersList();
//     setSystemStateAccessories();
//     setSystemStateBusLength();
//     setSystemStatePowerConsumption();
//     // setPreviewImages(SYSTEM.bus);
//     createSystemUsedDevicesPanel();
//     //Aż do tego miejsca.
//   });
// }

//Funkcja odpowiadająca za nadanie każdemu selektowi w podglądzie systemu listenera na zmianę stanu. Jeśli chodzi o uwagi techniczne to szukałbym błędu w wyszukiwaniu elementu ( patrz Uwagi techniczne pkt 6 ) w funkcji selectEvent.
// function actionsSelectListener() {
//   const segmentDeviceSelect = document.querySelectorAll(`.segmentDeviceSelect`);
//   segmentDeviceSelect.forEach(select => {
//     selectEvent(select);
//   });
// }

// function systemStatusReducer() {
//   const system = getSystem(SYSTEM);
//   const reduced = Object.values(
//     system.bus.reduce((key, { gasDetected, detectorName, wireLen_m, deviceType }) => {
//       if (!key[`amountOfDevices`]) {
//         key[`amountOfDevices`] = { amountOfDevices: 0 };
//       }
//       if (!key[detectorName] && deviceType === `detector`) {
//         key[detectorName] = { [`detectedGas`]: gasDetected, [`amount`]: 0, detectorName, deviceType };
//       } else if (!key[detectorName] && deviceType === `signaller`) {
//         key[detectorName] = { detectorName, deviceType, [`amount`]: 0 };
//       }

//       if (!key[`wire`]) {
//         key[`wire`] = { wireLength: 0 };
//       }

//       key[detectorName][`amount`]++;
//       key[`amountOfDevices`][`amountOfDevices`]++;

//       key[`wire`][`wireLength`] = parseInt(key[`wire`][`wireLength`]) + parseInt(wireLen_m);
//       return key;
//     }, Object.create(null))
//   );
//   return reduced;
// }

// function generateSystem() {
//   //funckja zliczajaca ile jest danych urzadzeń, ile metrów kabla etc.
//   const reducer = systemStatusReducer();
//   //Od tego miejsca tworzone są funkcje które tworzą elementy na liście "Stan systemu" Te funkcje pewnie da się zredukować do jednej, ale nie mam pomysłu jak, a IFowanie to uważam, że słaba opcja. Ewentualnie switch i przekazywać paramentr który warunek ma się wykonywać, ale nie wiem. Jak Ci się uda zoptymalizować to byłoby super.
//   setSystemStateDetectorsList();
//   setSystemStateSignallersList();
//   setSystemStateAccessories();
//   setSystemStateBusLength();
//   setSystemStatePowerConsumption();
//   //Aż do tego miejsca ^^

//   //Tworzenie obrazów
//   // setPreviewImages(SYSTEM.bus);
//   actionsSelectListener();
//   //Dodawanie i usuwanie elementów ( czyli kopiowanie i usuwanie ) oraz dodanie listenera do dodanego segmentu
//   addRemoveActionListener();

//   //funkcja generująca zestawienie urządzeń w oparciu o dane z reducera
//   createSystemUsedDevicesPanel();
//   //zapis do pliku
//   saveSketch();

//   //zapis do CSV

//   saveListOfDevices();
// }

function createPreview() {
  //generowanie konteneru dla zdjęć urządzeń i magistrali
  createSystemDiagram();
  //geneowanie numeracji segmentow, dzialań, selectów, numeracji segmentów etc
  createSystemSegmentsActionsList();
}
