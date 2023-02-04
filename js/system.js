// Przetwarzanie formularza dot. systemu
function handleFormSubmit() {
  // Wyłapanie zmian w select dot. wybranego typu gazu i przypisanie nazwy czujnika + rodzaju czujnika do obiektu inicjującego podgląd systemu 
  document.getElementById("gasDetected").addEventListener("change", (event) => {
    const option = event.target;
    initSystem.detectorName = option[option.selectedIndex].dataset.devicename;
    initSystem.deviceType = option[option.selectedIndex].dataset.devicetype;
  });

  //Zatwierdzenie formularza i wygenerowanie podglądu systemu
  const form = document.querySelector(".configForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const system = document.querySelector(`.system`);
    initSystem.amountOfDetectors = document.getElementById("amountOfDetectors").value;
    initSystem.structureType = document.getElementById("structureType").value;
    initSystem.gasDetected = document.getElementById("gasDetected").value;
    initSystem.batteryBackUp = document.getElementById("batteryBackUp").value;
    initSystem.EWL = document.getElementById("EWL").value;
    createSystemData();
    setSystem(initSystem);
    system.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// Inicjacja głównego obiektu z danymi systemu
function createSystemData() {
  systemData.powerSupply = "Teta MOD Control 1";
  systemData.devicesTypes.push(initSystem.deviceType);
  for (let i = 0; i < initSystem.amountOfDetectors; i++) {
    systemData.devices.push({
      index: i + 1,
      name: initSystem.detectorName,
      type: initSystem.deviceType,
      wireLength: initSystem.EWL
    })
  }
}

// Generowanie schematu utworzonego systemu
function createSystemDiagram() {
  const systemDiagram = document.getElementById("systemDiagram");
  systemData.devices.forEach((device) => systemDiagram.appendChild(createSegmentDiagram(device)));
}

// Tworzenie schematu segmentu urządzenia
function createSegmentDiagram(device) {
  const deviceSegment = document.createElement("div");
  const warningDeviceImageContainer = document.createElement("div");
  const busImageContainer = document.createElement("div");
  const detectorImageContainer = document.createElement("div");
  setAttributes(deviceSegment, { class: "deviceSegment", id: `segmentDiagram${device.index}` });
  setAttributes(warningDeviceImageContainer, { class: "warningDeviceImageContainer" });
  setAttributes(busImageContainer, { class: "busImageContainer" });
  setAttributes(detectorImageContainer, { class: "detectorImageContainer" });
  deviceSegment.appendChild(warningDeviceImageContainer);
  deviceSegment.appendChild(busImageContainer);
  deviceSegment.appendChild(detectorImageContainer);
  const warningDeviceImage = document.createElement("img");
  const busImage = document.createElement("img");
  const detectorImage = document.createElement("img");
  setAttributes(busImage, { src: "./SVG/tconP.svg", alt: "T-Konektor image" });
  if (device.type === "detector") {
    setAttributes(warningDeviceImage, { src: "", alt: "Warning device image" });
    setAttributes(detectorImage, { src: `./SVG/${device.name}.svg`, alt: "Detector image" });
    warningDeviceImage.style.visibility = "hidden";
    detectorImage.style.visibility = "visible";
  } else {
    setAttributes(warningDeviceImage, { src: `./SVG/${device.name}.svg`, alt: "Warning device image" });
    setAttributes(detectorImage, { src: "", alt: "Detector image" });
    warningDeviceImage.style.visibility = "visible";
    detectorImage.style.visibility = "hidden";
  }
  warningDeviceImageContainer.appendChild(warningDeviceImage);
  busImageContainer.appendChild(busImage);
  detectorImageContainer.appendChild(detectorImage);
  return deviceSegment;
}

// Generowanie listy działań dla segmentów utworzonego systemu
function createSystemSegmentsActionsList() {
  const actionsList = document.getElementById("actionsList");
  actionsList.appendChild(createSegmentActionsPSU());
  systemData.devices.forEach((device) => actionsList.appendChild(createSegmentActions(device)));
}

// Tworzenie panelu działań dla segmentu urządzenia
function createSegmentActions(device) {
  const actionsSegment = document.createElement("div");
  const segmentIndexLabel = document.createElement("label");
  const segmentDeviceLabel = document.createElement("label");
  const segmentWireLengthLabel = document.createElement("label");
  const segmentDeviceSelectContainer = document.createElement("div");
  const segmentWireLengthContainer = document.createElement("div");
  const segmentButtonsContainer = document.createElement("div");
  setAttributes(actionsSegment, { class: "actionsSegment", id: `actionsSegment${device.index}`, "data-segmentType": "detectors", "data-segmentIndex": `${device.index}` });
  setAttributes(segmentDeviceSelectContainer, { class: "segmentDeviceSelectContainer" });
  setAttributes(segmentWireLengthContainer, { class: "segmentWireLengthContainer" });
  setAttributes(segmentButtonsContainer, { class: "segmentButtonsContainer" });
  actionsSegment.appendChild(segmentIndexLabel);
  actionsSegment.appendChild(segmentDeviceSelectContainer);
  actionsSegment.appendChild(segmentWireLengthContainer);
  actionsSegment.appendChild(segmentButtonsContainer);
  setAttributes(segmentIndexLabel, { class: "segmentIndexLabel", for: `actionsSegmentIndex${device.index}` });
  setAttributes(segmentDeviceLabel, { class: "segmentDeviceLabel", for: `actionsSegmentDevice${device.index}` });
  setAttributes(segmentWireLengthLabel, { class: "segmentWireLengthLabel", for: `actionsSegmentWireLength${device.index}` });
  segmentIndexLabel.appendChild(document.createTextNode("Segment nr "));
  segmentDeviceLabel.appendChild(document.createTextNode("Urządzenie"));
  segmentWireLengthLabel.appendChild(document.createTextNode("Odległość do poprzedniego segmentu"));
  const segmentIndexInput = document.createElement("input");
  const segmentDeviceSelect = document.createElement("select");
  const segmentWireLengthInput = document.createElement("input");
  const duplicateDeviceButton = document.createElement("button");
  const duplicateButtonImage = document.createElement("img");
  const removeDeviceButton = document.createElement("button");
  const removeButtonImage = document.createElement("img");
  setAttributes(segmentIndexInput, { class: "segmentId", id: `actionsSegmentIndex${device.index}`, type: "number", min: 0, max: 50, value: device.index });
  setAttributes(segmentDeviceSelect, { class: "segmentDeviceSelect", id: `actionsSegmentDevice${device.index}` });
  setAttributes(segmentWireLengthInput, { class: "segmentWireLength", id: `actionsSegmentWireLength${device.index}`, type: "number", min: 1, value: device.wireLength });
  setAttributes(duplicateDeviceButton, { class: "duplicateDeviceButton", id: `duplicateDevice${device.index}` });
  setAttributes(duplicateButtonImage, { src: "./SVG/add.svg", alt: "Duplicate device button" });
  setAttributes(removeDeviceButton, { class: "removeDeviceButton", id: `removeDevice${device.index}` });
  setAttributes(removeButtonImage, { src: "./SVG/remove.svg", alt: "Remove device button" });
  segmentIndexLabel.appendChild(segmentIndexInput);
  segmentDeviceSelectContainer.appendChild(segmentDeviceLabel);
  segmentDeviceSelectContainer.appendChild(segmentDeviceSelect);
  segmentWireLengthContainer.appendChild(segmentWireLengthLabel);
  segmentWireLengthContainer.appendChild(segmentWireLengthInput);
  segmentButtonsContainer.appendChild(duplicateDeviceButton);
  segmentButtonsContainer.appendChild(removeDeviceButton);
  duplicateDeviceButton.appendChild(duplicateButtonImage);
  removeDeviceButton.appendChild(removeButtonImage);

  return actionsSegment;
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

// Ustawienie wartości zużycia energii dla systemu
function setSystemPowerConsumption(value = 25) {
  const powerConsumption = document.querySelector(".powerConsumption");
  powerConsumption.appendChild(document.createTextNode(`${value} W`));
}

//W kodzie jest getter i setter systemu, jakby komuś przyszło na myśl generowanie systemu po JSONie :)
function getSystem(sys) {
  return sys;
}

function setSystem(system, loadFromSaved = "") {
  //Obecnie domyślny zasilacz systemu, na razie nie zmieniać
  SYSTEM.powerSupply = "Teta MOD Control1";

  //Generowanie systemu "z reki"
  if (loadFromSaved === "") {
    for (let i = 0; i < system.amountOfDetectors; i++) {
      SYSTEM.bus.push({
        detectorName: system.detectorName,
        deviceType: system.deviceType,
        gasDetected: system.gasDetected,
        wireLen_m: system.EWL,
      });
    }
    //Poniższy warunek zaczalem chyba pisac do obslugi wczytywania systemu z pliku
  } else {
    const amountOfDetectors = system.find(element => element.hasOwnProperty(`amountOfDevices`));
    const busLength = system.find(element => element.hasOwnProperty(`wireLength`));
    const listOfDevices = system.filter(device => (device.hasOwnProperty(`amount`) === true ? device : null));
    listOfDevices.forEach(device => {
      for (let i = 0; i < device.amount; i++) {
        SYSTEM.bus.push({
          detectorName: device.detectorName,
          deviceType: device.deviceType,
          gasDetected: device.detectedGas || null,
          wireLen_m: busLength.wireLength / amountOfDetectors.amountOfDevices,
        });
      }
    });
  }
  //funkcja poniżej generuje Podlgąd systemu i Działania
  createPreview();
  //Generowanie systemu
  generateSystem();
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

function addRemoveActionListener() {
  const segmentListeners = document.querySelector(`.actionsList`);
  segmentListeners.addEventListener(
    `click`,
    e => {
      if (e.target.name === `addSegment`) {
        const listOfSegments = Array.from(document.querySelectorAll(`.actionsSegment`));
        const segmentClicked = e.target.closest(`.actionsSegment`);
        const indexOfClickedSegment = listOfSegments.indexOf(segmentClicked);

        const listOfdeviceSegments = document.querySelectorAll(`.deviceSegment`);
        const deviceSegment = listOfdeviceSegments[indexOfClickedSegment - 1];
        const objToCopy = JSON.parse(JSON.stringify(SYSTEM.bus[indexOfClickedSegment - 1]));
        SYSTEM.bus.splice(indexOfClickedSegment, 0, objToCopy);
        const clonedSegment = segmentClicked.cloneNode(true);
        const clonedSegmentSelect = clonedSegment.querySelector(`.segmentDeviceSelect`);
        clonedSegmentSelect.value = SYSTEM.bus[indexOfClickedSegment].detectorName;
        const clonedsegmentIdentifier = clonedSegment.querySelector(`.segmentIdentifier`);
        clonedsegmentIdentifier.value = `${listOfSegments.length}`;
        const clonedPreview = deviceSegment.cloneNode(true);
        segmentClicked.after(clonedSegment);
        deviceSegment.after(clonedPreview);

        const reducer = systemStatusReducer();
        systemDetectors(reducer);
        systemSignallers(reducer);
        systemAccessories(reducer);
        statusBusLength(reducer);
        setSystemPowerConsumption();
        selectEvent(clonedSegmentSelect);
        initAppliencedDevices(reducer);
      } else if (e.target.name === `removeSegment`) {
        const listOfSegments = Array.from(document.querySelectorAll(`.actionsSegment`));
        const segmentClicked = e.target.closest(`.actionsSegment`);
        const indexOfClickedSegment = listOfSegments.indexOf(segmentClicked);

        const listOfdeviceSegments = document.querySelectorAll(`.deviceSegment`);
        const deviceSegment = listOfdeviceSegments[indexOfClickedSegment - 1];
        if (listOfdeviceSegments.length > 1) {
          SYSTEM.bus.splice(indexOfClickedSegment - 1, 1);
          segmentClicked.remove();
          deviceSegment.remove();
        }
        const reducer = systemStatusReducer();
        systemDetectors(reducer);
        systemSignallers(reducer);
        systemAccessories(reducer);
        statusBusLength(reducer);
        setSystemPowerConsumption();
        initAppliencedDevices(reducer);
      }
    },
    true
  );
}

function systemDetectors(reduced) {
  const listOfDetectors = document.querySelector(`.system .detectorTypes`);
  const amountsOfDelectorsList = document.querySelector(`.system .detectorTypesAmounts`);
  listOfDetectors.innerHTML = "";
  amountsOfDelectorsList.innerHTML = "";
  reduced.forEach(element => {
    if (element.deviceType === `detector`) {
      const deviceItem = document.createElement(`li`);
      deviceItem.innerHTML = element.detectedGas;
      const deviceAmountItem = document.createElement(`li`);
      deviceAmountItem.innerHTML = `<span class ="bold">${element.amount}</span> szt.`;
      listOfDetectors.appendChild(deviceItem);
      amountsOfDelectorsList.appendChild(deviceAmountItem);
    }
  });
}

function systemSignallers(reduced) {
  const listOfSignallers = document.querySelector(`.system .signallerTypes`);
  const amountsOfSignallersList = document.querySelector(`.system .signallerTypesAmounts`);
  listOfSignallers.innerHTML = "";
  amountsOfSignallersList.innerHTML = "";
  reduced.forEach(element => {
    if (element.deviceType === `siren`) {
      const deviceItem = document.createElement(`li`);
      deviceItem.innerHTML = element.detectorName;
      const deviceAmountItem = document.createElement(`li`);
      deviceAmountItem.innerHTML = `${element.amount}</span> szt.`;
      listOfSignallers.appendChild(deviceItem);
      amountsOfSignallersList.appendChild(deviceAmountItem);
    }
  });
}

function systemAccessories(reduced) {
  const listOfAccessories = document.querySelector(`.system .accessoriesTypes`);
  const amountsOfAccessories = document.querySelector(`.system .accessoriesTypesAmounts`);
  listOfAccessories.innerHTML = "";
  amountsOfAccessories.innerHTML = "";
  const findAmounts = reduced.find(deviceAmounts => deviceAmounts.hasOwnProperty(`amountOfDevices`));
  const accessoryItem = document.createElement(`li`);
  accessoryItem.innerHTML = `T-Konektor`;
  const accessoryAmountItem = document.createElement(`li`);
  accessoryAmountItem.innerHTML = `<span class ="bold">${findAmounts.amountOfDevices}</span> szt.`;
  listOfAccessories.appendChild(accessoryItem);
  amountsOfAccessories.appendChild(accessoryAmountItem);
}

function statusBusLength(reduced) {
  const busLength = document.querySelector(`.busLength`);
  busLength.innerHTML = "";
  const busLengthValue = reduced.find(key => key[`wireLength`]);
  busLength.innerHTML = `<span class="bold">${busLengthValue[`wireLength`]}</span> m.`;
}

function systemActionDevicesSelect(structureType) {
  const segmentDeviceSelect = document.querySelectorAll(`.segmentDeviceSelect`);
  const structureObj = CONSTRUCTIONS.find(constructionType => constructionType.type === structureType);
  const deviceList = structureObj.devices;
  // Generowanie opcji dla selecta zawierającego dostępne rodzaje urządzenia w utworzonym segmencie 
  segmentDeviceSelect.forEach((select, i) => {
    deviceList.forEach((device, i) => {
      if (device.typeOfDevice !== `siren`) {
        const option = document.createElement(`option`);
        option.className = `deviceActionOption`;
        option.innerHTML = `Czujnik ${device.gasDetected}`;
        option.setAttribute(`data-detectedGas`, `${device.gasDetected}`);
        if (initSystem.gasDetected === device.gasDetected) {
          option.setAttribute(`selected`, `selected`);
        }
        option.value = device.type;
        select.appendChild(option);
      } else {
        const option = document.createElement(`option`);
        option.className = `deviceActionOption`;
        option.innerHTML = `Sygnalizator ${device.type}`;
        option.value = device.type;
        select.appendChild(option);
      }
    });
  });
}

function selectEvent(select) {
  select.addEventListener(`change`, e => {
    const listOfSegments = Array.from(document.querySelectorAll(`.actionsSegment`));
    const segmentClicked = e.target.closest(`.actionsSegment`);
    const i = listOfSegments.indexOf(segmentClicked) - 1;

    SYSTEM.bus[i].detectorName = e.target.value;
    if (e.target.value === `Teta SZOA`) {
      SYSTEM.bus[i].deviceType = `siren`;
      delete SYSTEM.bus[i].toledText;
      const container = document.querySelector(`#actionsSegment${i + 1}`);
      const toled = document.querySelector(`#actionsSegment${i + 1} .toledContainer`);
      if (toled) {
        container.removeChild(toled);
      }
    } else if (e.target.value === `TOLED`) {
      SYSTEM.bus[i].deviceType = `siren`;
      createToledSelect(i);
    } else {
      SYSTEM.bus[i].deviceType = `detector`;
      SYSTEM.bus[i].gasDetected = e.target.options[e.target.selectedIndex].getAttribute(`data-detectedgas`);
      delete SYSTEM.bus[i].toledText;
      const container = document.querySelector(`#actionsSegment${i + 1}`);
      const toled = document.querySelector(`#actionsSegment${i + 1} .toledContainer`);
      if (toled) {
        container.removeChild(toled);
      }
    }
    const reduced = systemStatusReducer();

    //sprawdzam, czy w zestawieniu urządzeń występuje duplikat danego urządzenia, jeśli występuje to go usuwam.
    checkIfUsedDevice(reduced);
    //Od tego miejsca tworzone są funkcje które tworzą elementy na liście "Stan systemu" Te funkcje pewnie da się zredukować do jednej, ale nie mam pomysłu jak, a IFowanie to uważam, że słaba opcja. Ewentualnie switch i przekazywać paramentr który warunek ma się wykonywać, ale nie wiem. Jak Ci się uda zoptymalizować to byłoby super.
    systemDetectors(reduced);
    systemSignallers(reduced);
    systemAccessories(reduced);
    statusBusLength(reduced);
    setSystemPowerConsumption();
    // setPreviewImages(SYSTEM.bus);
    initAppliencedDevices(reduced);
    //Aż do tego miejsca.
  });
}

//Funkcja odpowiadająca za nadanie każdemu selektowi w podglądzie systemu listenera na zmianę stanu. Jeśli chodzi o uwagi techniczne to szukałbym błędu w wyszukiwaniu elementu ( patrz Uwagi techniczne pkt 6 ) w funkcji selectEvent.
function actionsSelectListener() {
  const segmentDeviceSelect = document.querySelectorAll(`.segmentDeviceSelect`);
  segmentDeviceSelect.forEach(select => {
    selectEvent(select);
  });
}

function createToledSelect(i) {
  const container = document.querySelector(`#actionsSegment${i + 1}`);
  const toledContainer = document.createElement(`div`);
  toledContainer.className = `toledContainer`;
  const toledSelect = document.createElement(`select`);
  toledSelect.className = `toledSelect`;
  TOLEDOptions.forEach(option => {
    const toledOption = document.createElement(`option`);
    toledOption.innerHTML = `${option.text}`;
    toledOption.value = `${option.type} - ${option.text}`;
    toledSelect.appendChild(toledOption);
  });
  const toledDescription = document.createElement(`p`);
  toledDescription.className = `toledDescription`;
  toledDescription.innerHTML = `Napis`;
  toledContainer.appendChild(toledDescription);
  toledContainer.appendChild(toledSelect);
  container.appendChild(toledContainer);
  toledSelect.addEventListener(`change`, e => {
    SYSTEM.bus[i].toledText = e.target.value;
    const reducer = systemStatusReducer();
    systemDetectors(reducer);
    systemSignallers(reducer);
    systemAccessories(reducer);
  });
}

function systemStatusReducer() {
  const system = getSystem(SYSTEM);
  const reduced = Object.values(
    system.bus.reduce((key, { gasDetected, detectorName, wireLen_m, deviceType }) => {
      if (!key[`amountOfDevices`]) {
        key[`amountOfDevices`] = { amountOfDevices: 0 };
      }
      if (!key[detectorName] && deviceType === `detector`) {
        key[detectorName] = { [`detectedGas`]: gasDetected, [`amount`]: 0, detectorName, deviceType };
      } else if (!key[detectorName] && deviceType === `siren`) {
        key[detectorName] = { detectorName, deviceType, [`amount`]: 0 };
      }

      if (!key[`wire`]) {
        key[`wire`] = { wireLength: 0 };
      }

      key[detectorName][`amount`]++;
      key[`amountOfDevices`][`amountOfDevices`]++;

      key[`wire`][`wireLength`] = parseInt(key[`wire`][`wireLength`]) + parseInt(wireLen_m);
      return key;
    }, Object.create(null))
  );
  console.log(reduced);
  return reduced;
}

function initAppliencedDevices(reduced) {
  const usedDevicesContainer = document.querySelector(`.usedDevicesContainer`);
  const usedDeviceItemList = Array.from(document.querySelectorAll(`.usedDevicePair`));
  reduced.forEach((element, i) => {
    if (element.deviceType === `detector` || element.deviceType === `siren`) {
      const checkIfExists = usedDeviceItemList.find(item => item.getAttribute("id") === element.detectorName);
      if (usedDeviceItemList[0].getAttribute("id") === null) {
        const usedDevicePair = usedDevicesContainer.querySelector(`.usedDevicePair`);
        const usedDeviceItem = document.querySelector(`.usedDeviceItem`);
        usedDevicePair.setAttribute(`id`, `${element.detectorName}`);
        const usedDeviceNameParagraph = usedDeviceItem.querySelector(`.usedDeviceName p`);
        usedDeviceNameParagraph.innerHTML = element.detectorName;
        const gasDetected = usedDeviceItem.querySelector(`.usedDeviceGasDetected p`);
        if (element.deviceType !== `detector`) {
          gasDetected.innerHTML = ``;
        } else {
          gasDetected.innerHTML = element.detectedGas;
        }
        const docs = DEVICEDOCS.find(device => device.type === element.detectorName);
        const usedDeviceDocs = usedDeviceItem.querySelector(`.usedDeviceDocs .usedDeviceDocsAnchor`);
        usedDeviceDocs.setAttribute("href", `${docs.link}`);
        usedDeviceDocs.setAttribute("target", `_blank`);
        const usedDeviceImage = usedDeviceItem.querySelector(`.usedDeviceImageContainer img`);
        usedDeviceImage.setAttribute(`src`, `./PNG/${element.detectorName}.png`);
        usedDeviceImage.setAttribute(`alt`, `unable to find image`);
      } else if (!checkIfExists) {
        const elementToClone = usedDevicesContainer.querySelector(`.usedDevicePair`).cloneNode(true);
        const cloned = elementToClone.querySelector(`.usedDeviceItem`);
        elementToClone.setAttribute(`id`, `${element.detectorName}`);
        const usedDeviceNameParagraph = cloned.querySelector(`.usedDeviceName p`);
        usedDeviceNameParagraph.innerHTML = element.detectorName;
        const gasDetected = cloned.querySelector(`.usedDeviceGasDetected p`);
        if (element.deviceType !== `detector`) {
          gasDetected.innerHTML = ``;
        } else {
          gasDetected.innerHTML = element.detectedGas;
        }

        const docs = DEVICEDOCS.find(device => device.type === element.detectorName);
        const usedDeviceDocs = cloned.querySelector(`.usedDeviceDocs .usedDeviceDocsAnchor`);
        usedDeviceDocs.setAttribute("href", `${docs.link}`);
        usedDeviceDocs.setAttribute("target", `_blank`);
        const usedDeviceImage = cloned.querySelector(`.usedDeviceImageContainer img`);
        usedDeviceImage.setAttribute(`src`, `./PNG/${element.detectorName}.png`);
        usedDeviceImage.setAttribute(`alt`, `unable to find image`);

        usedDevicesContainer.appendChild(elementToClone);
      }
    }
  });
}

function checkIfUsedDevice(reduced) {
  const usedDeviceItemList = Array.from(document.querySelectorAll(`.usedDevicePair`));
  usedDeviceItemList.forEach(container => {
    const arr = reduced.map(element => element.detectorName);
    if (!arr.includes(container.getAttribute(`id`))) {
      const parent = container.closest(`.usedDevicePair`);
      parent.remove();
    }
  });
}

function generateSystem() {
  //funckja zliczajaca ile jest danych urzadzeń, ile metrów kabla etc.
  const reducer = systemStatusReducer();
  //Od tego miejsca tworzone są funkcje które tworzą elementy na liście "Stan systemu" Te funkcje pewnie da się zredukować do jednej, ale nie mam pomysłu jak, a IFowanie to uważam, że słaba opcja. Ewentualnie switch i przekazywać paramentr który warunek ma się wykonywać, ale nie wiem. Jak Ci się uda zoptymalizować to byłoby super.
  systemDetectors(reducer);
  systemSignallers(reducer);
  systemAccessories(reducer);
  statusBusLength(reducer);
  setSystemPowerConsumption();
  //Aż do tego miejsca ^^

  //Tworzenie selectów dla urządzeń w podglądzie systemu
  systemActionDevicesSelect(initSystem.structureType);
  //Tworzenie obrazów
  // setPreviewImages(SYSTEM.bus);
  actionsSelectListener();
  //Dodawanie i usuwanie elementów ( czyli kopiowanie i usuwanie ) oraz dodanie listenera do dodanego segmentu
  addRemoveActionListener();

  //funkcja generująca zestawienie urządzeń w oparciu o dane z reducera
  initAppliencedDevices(reducer);
  //zapis do pliku
  saveSketch();

  //zapis do CSV

  saveListOfDevices();
}

function createPreview() {
  //generowanie konteneru dla zdjęć urządzeń i magistrali
  createSystemDiagram();
  //geneowanie numeracji segmentow, dzialań, selectów, numeracji segmentów etc
  createSystemSegmentsActionsList();
}
