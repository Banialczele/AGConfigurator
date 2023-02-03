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
  setAttributes(warningDeviceImage, { src: "", alt: "Warning device image" });
  setAttributes(busImage, { src: "./SVG/tconP.svg", alt: "T-Konektor image" });
  setAttributes(detectorImage, { src: `./SVG/${device.name}.svg`, alt: "Detector image" });
  warningDeviceImage.style.visibility = "hidden";
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
  setAttributes(actionsSegment, { class: "actionsSegment", id: `actionsSegment${device.index}`, "data-segmentType": "detectors", "data-segmentIndex": `${device.index}` });
  setAttributes(segmentDeviceSelectContainer, { class: "segmentDeviceSelectContainer" });
  setAttributes(segmentWireLengthContainer, { class: "segmentsegmentWireLengthContainer" });
  actionsSegment.appendChild(segmentIndexLabel);
  actionsSegment.appendChild(segmentDeviceSelectContainer);
  actionsSegment.appendChild(segmentWireLengthContainer);
  setAttributes(segmentIndexLabel, { class: "segmentIndexLabel", for: `actionsSegmentIndex${device.index}` });
  setAttributes(segmentDeviceLabel, { class: "segmentDeviceLabel", for: `actionsSegmentDevice${device.index}` });
  setAttributes(segmentWireLengthLabel, { class: "segmentWireLengthLabel", for: `actionsSegmentWireLength${device.index}` });
  segmentIndexLabel.appendChild(document.createTextNode("Segment nr "));
  segmentDeviceLabel.appendChild(document.createTextNode("Urządzenie"));
  segmentWireLengthLabel.appendChild(document.createTextNode("Odległość do poprzedniego segmentu"));
  const segmentIndexInput = document.createElement("input");
  const segmentDeviceSelect = document.createElement("select");
  const segmentWireLengthInput = document.createElement("input");
  setAttributes(segmentIndexInput, { class: "segmentId", id: `actionsSegmentIndex${device.index}`, type: "number", min: 0, max: 50, value: device.index });
  setAttributes(segmentDeviceSelect, { class: "segmentDeviceSelect", id: `actionsSegmentDevice${device.index}` });
  setAttributes(segmentWireLengthInput, { class: "segmentWireLength", id: `actionsSegmentWireLength${device.index}`, type: "number", min: 1, value: device.wireLength });
  segmentIndexLabel.appendChild(segmentIndexInput);
  segmentDeviceSelectContainer.appendChild(segmentDeviceLabel);
  segmentDeviceSelectContainer.appendChild(segmentDeviceSelect);
  segmentWireLengthContainer.appendChild(segmentWireLengthLabel);
  segmentWireLengthContainer.appendChild(segmentWireLengthInput);

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
function setSystemPowerConsumption(value) {
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

//Generowanie wszystkich pojemników na zdjęcia, akcje dotyczące kontenerów w zależności od ilości wprowadzonych urządzeń na widoku podstawowym ( czyt. po zaladowaniu strony )
function createPreviewImages(amount) {
  const systemGraphics = document.querySelector(`.systemDiagram`);
  systemGraphics.innerHTML = "";
  for (let i = 0; i < amount; i++) {
    const deviceSegment = document.createElement(`div`);
    deviceSegment.className = `deviceSegment`;
    deviceSegment.setAttribute(`id`, `deviceSegment${i}`);

    const warningDeviceImageContainer = document.createElement(`div`);
    warningDeviceImageContainer.className = `warningDeviceImageContainer`;

    const warningDeviceImage = document.createElement(`img`);
    warningDeviceImage.setAttribute(`src`, "");
    warningDeviceImage.setAttribute(`alt`, `unable to find a image`);
    warningDeviceImageContainer.appendChild(warningDeviceImage);

    const busImageContainer = document.createElement(`div`);
    busImageContainer.className = `busImageContainer`;

    const busImage = document.createElement(`img`);
    busImage.setAttribute(`src`, "");
    busImage.setAttribute(`alt`, `unable to find a image`);
    busImageContainer.appendChild(busImage);

    const detectorImageContainer = document.createElement(`div`);
    detectorImageContainer.className = `detectorImageContainer`;
    const detectorImage = document.createElement(`img`);
    detectorImage.setAttribute(`src`, "");
    detectorImage.setAttribute(`alt`, `unable to find a image`);
    detectorImageContainer.appendChild(detectorImage);

    deviceSegment.appendChild(warningDeviceImageContainer);
    deviceSegment.appendChild(busImageContainer);
    deviceSegment.appendChild(detectorImageContainer);
    systemGraphics.appendChild(deviceSegment);
  }
}

//Generowanie wszystkich pojemników na zdjęcia, akcje dotyczące kontenerów w zależności od ilości wprowadzonych urządzeń na widoku podstawowym ( czyt. po zaladowaniu strony )
function createPreviewActions(amount) {
  const actionsList = document.querySelector(`.actionsList`);

  for (let i = 0; i <= amount; i++) {
    const actionsSegment = document.createElement(`div`);
    actionsSegment.className = `actionsSegment`;
    actionsSegment.setAttribute(`id`, `actionsSegment${i}`);

    const segmentIndexLabel = document.createElement(`p`);
    segmentIndexLabel.className = `segmentIndexLabel`;
    segmentIndexLabel.innerHTML = `Segment nr `;
    const segmentIndexInput = document.createElement(`input`);
    segmentIndexInput.className = `segmentId`;

    actionsSegment.appendChild(segmentIndexLabel);
    const segmentDeviceLabel = document.createElement(`p`);
    segmentDeviceLabel.className = `segmentDeviceLabel`;
    segmentDeviceLabel.innerHTML = `Urządzenie`;
    if (i === 0) {
      const segmentDeviceInput = document.createElement(`input`);
      segmentIndexInput.value = i;
      segmentIndexInput.setAttribute(`id`, `segment${i}`);
      segmentDeviceInput.value = `Teta MOD Control 1`;
      actionsSegment.setAttribute(`data-segmentType`, `PSU`);
      actionsSegment.appendChild(segmentDeviceLabel);

      actionsSegment.appendChild(segmentDeviceInput);
    } else {
      const segmentDeviceSelectContainer = document.createElement(`div`);
      segmentDeviceSelectContainer.className = `segmentDeviceSelectContainer`;
      const segmentDeviceSelect = document.createElement(`select`);
      segmentDeviceSelect.className = `segmentDeviceSelect`;
      segmentDeviceSelect.name = `detector`;
      segmentIndexInput.value = i;
      segmentIndexInput.setAttribute(`id`, `segment${i}`);
      segmentDeviceSelectContainer.appendChild(segmentDeviceLabel);
      segmentDeviceSelectContainer.appendChild(segmentDeviceSelect);
      actionsSegment.appendChild(segmentDeviceSelectContainer);

      const segmentWireLengthContainer = document.createElement(`div`);
      segmentWireLengthContainer.className = `segmentWireLengthContainer`;

      const segmentWireLengthLabel = document.createElement(`p`);
      segmentWireLengthLabel.innerHTML = `Odległość do poprzedniego segmentu`;
      segmentWireLengthLabel.className = `segmentWireLengthLabel`;
      segmentWireLengthLabel.setAttribute(`id`, `wireLength${i}`);
      const segmentWireLengthInput = document.createElement(`input`);
      segmentWireLengthInput.className = `segmentWireLengthInput`;

      segmentWireLengthInput.value = SYSTEM.bus[i - 1].wireLen_m;
      actionsSegment.setAttribute(`data-segmentType`, `detectors`);
      actionsSegment.setAttribute(`data-segmentIndex`, `${i}`);
      segmentWireLengthContainer.appendChild(segmentWireLengthLabel);
      segmentWireLengthContainer.appendChild(segmentWireLengthInput);
      actionsSegment.appendChild(segmentWireLengthContainer);
    }
    segmentIndexLabel.appendChild(segmentIndexInput);

    actionsList.appendChild(actionsSegment);
    //funkcja dodająca przyciski dodawania i usuwania przycisków
    createAddRemoveButtons(actionsSegment);
  }
}

function createAddRemoveButtons(actionsSegment) {
  if (actionsSegment.getAttribute(`data-segmentType`) !== `PSU`) {
    const buttonsContainer = document.createElement(`div`);
    buttonsContainer.className = `buttonsContainer`;

    const addButton = document.createElement(`button`);
    addButton.className = `addButton`;
    const addImage = document.createElement(`img`);
    addImage.setAttribute(`src`, `./SVG/add.svg`);
    addImage.setAttribute(`alt`, `unable to find image`);
    addImage.setAttribute(`name`, `addSegment`);

    addButton.appendChild(addImage);

    const removeButton = document.createElement(`button`);
    removeButton.className = `removeButton`;
    const removeImage = document.createElement(`img`);
    removeImage.setAttribute(`src`, `./SVG/remove.svg`);
    removeImage.setAttribute(`alt`, `unable to find image`);
    removeImage.setAttribute(`name`, `removeSegment`);

    removeButton.appendChild(removeImage);
    buttonsContainer.appendChild(addButton);
    buttonsContainer.appendChild(removeButton);
    actionsSegment.appendChild(buttonsContainer);
  }
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
        systemPowerConsumption();
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
        systemPowerConsumption();
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

function systemPowerConsumption(value) {
  const powerConsumption = document.querySelector(`.powerConsumption`);
  powerConsumption.innerHTML = `<span class="bold">${value === undefined ? 25 : null}</span> W`;
}

function setPreviewImages(devices) {
  const deviceSegment = document.querySelectorAll(`.deviceSegment .busImageContainer img`);
  const detectorImages = document.querySelectorAll(`.deviceSegment .detectorImageContainer img`);
  const sirensImages = document.querySelectorAll(`.deviceSegment .warningDeviceImageContainer img`);
  devices.forEach((device, i) => {
    if (devices[i].deviceType === `detector`) {
      detectorImages[i].style.visibility = `visible`;
      detectorImages[i].setAttribute("src", `./SVG/${device.detectorName}.svg`);
      deviceSegment[i].setAttribute(`src`, `./SVG/tconP.svg`);
      sirensImages[i].style.visibility = `hidden`;
    } else if (devices[i].deviceType === `siren`) {
      sirensImages[i].style.visibility = `visible`;
      sirensImages[i].setAttribute("src", `./SVG/${device.detectorName}.svg`);
      deviceSegment[i].setAttribute(`src`, `./SVG/tconL.svg`);
      detectorImages[i].style.visibility = `hidden`;
    }
  });
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
    systemPowerConsumption();
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
  systemPowerConsumption();
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
  // createPreviewImages(SYSTEM.bus.length);
  createSystemDiagram();
  //geneowanie numeracji segmentow, dzialań, selectów, numeracji segmentów etc
  // createPreviewActions(SYSTEM.bus.length);
  createSystemSegmentsActionsList();
}
