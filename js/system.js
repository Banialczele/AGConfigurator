function handleFormSubmit() {
  const entryFormInputs = document.querySelectorAll(".configForm input");
  const entryFormSelects = document.querySelectorAll(".configForm select");

  entryFormInputs.forEach(input => input.addEventListener("keyup", e => (initSystem[e.target.name] = e.target.value)));
  entryFormSelects.forEach(select =>
    select.addEventListener("change", e => {
      if (e.target[e.target.selectedIndex].getAttribute("data-deviceName") !== null) {
        initSystem[`detectorname`] = e.target[e.target.selectedIndex].getAttribute("data-deviceName");
        initSystem[`deviceType`] = e.target[e.target.selectedIndex].getAttribute("data-devicetype");
      }
      initSystem[e.target.name] = e.target.value;
    })
  );
  const form = document.querySelector(".configForm");
  form.addEventListener("submit", e => {
    const system = document.querySelector(`.system`);
    system.scrollIntoView({ behavior: "smooth", block: "start" });
    e.preventDefault();
    setSystem(initSystem);
    createPreview();
    generateSystem();
  });
}

function getSystem(sys) {
  return sys;
}

function setSystem(system) {
  SYSTEM.powerSupply = "Teta MOD Control1";
  for (let i = 0; i < system.amountOfDetectors; i++) {
    SYSTEM.bus.push({
      detectorName: system.detectorName,
      deviceType: system.deviceType,
      gasDetected: system.gasDetected,
      wireLen_m: system.EWL,
    });
  }
}

function createPreviewImages(amount) {
  const systemGraphics = document.querySelector(`.deviceImages`);
  systemGraphics.innerHTML = "";
  for (let i = 0; i < amount; i++) {
    const previewContainer = document.createElement(`div`);
    previewContainer.className = `previewContainer`;
    previewContainer.setAttribute(`id`, `previewContainer${i}`);

    const signallerImageContainer = document.createElement(`div`);
    signallerImageContainer.className = `signallerImageContainer`;

    const signallerImage = document.createElement(`img`);
    signallerImage.setAttribute(`src`, "");
    signallerImage.setAttribute(`alt`, `unable to find a image`);
    signallerImageContainer.appendChild(signallerImage);

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

    previewContainer.appendChild(signallerImageContainer);
    previewContainer.appendChild(busImageContainer);
    previewContainer.appendChild(detectorImageContainer);
    systemGraphics.appendChild(previewContainer);
  }
}

function createPreviewActions(amount) {
  const systemActions = document.querySelector(`.systemActions`);
  const actionDivContainer = document.createElement(`div`);
  for (let i = 0; i <= amount; i++) {
    const actionsContainer = document.createElement(`div`);
    actionsContainer.className = `actionsContainer`;
    actionsContainer.setAttribute(`id`, `actionsContainer${i}`);

    const segmentNumber = document.createElement(`p`);
    segmentNumber.className = `segmentNumber`;
    segmentNumber.innerHTML = `Segment nr `;
    const segmentNumberInput = document.createElement(`input`);
    segmentNumberInput.className = `segmentIdentyfier`;

    actionsContainer.appendChild(segmentNumber);
    const segmentDeviceDescrpition = document.createElement(`p`);
    segmentDeviceDescrpition.className = `segmentDeviceDescription`;
    segmentDeviceDescrpition.innerHTML = `Urządzenie`;
    if (i === 0) {
      const segmentDeviceInput = document.createElement(`input`);
      segmentNumberInput.value = i;
      segmentNumberInput.setAttribute(`id`, `segment${i}`);
      segmentDeviceInput.value = `Teta MOD Control 1`;
      actionsContainer.setAttribute(`data-psu`, `PSU`);
      actionsContainer.appendChild(segmentDeviceDescrpition);

      actionsContainer.appendChild(segmentDeviceInput);
    } else {
      const deviceSelectionContainer = document.createElement(`div`);
      deviceSelectionContainer.className = `deviceSelection`;
      const deviceActionSelect = document.createElement(`select`);
      deviceActionSelect.className = `deviceActionSelect`;
      deviceActionSelect.name = `detector`;
      segmentNumberInput.value = i;
      segmentNumberInput.setAttribute(`id`, `segment${i}`);
      deviceSelectionContainer.appendChild(segmentDeviceDescrpition);
      deviceSelectionContainer.appendChild(deviceActionSelect);
      actionsContainer.appendChild(deviceSelectionContainer);

      const wireLengthContainer = document.createElement(`div`);
      wireLengthContainer.className = `wireLengthActionContainer`;

      const wireLengthLabel = document.createElement(`p`);
      wireLengthLabel.innerHTML = `Odległość do poprzedniego segmentu`;
      wireLengthLabel.className = `wireLength`;
      wireLengthLabel.setAttribute(`id`, `wireLength${i}`);
      const distanceToPreviuous = document.createElement(`input`);
      distanceToPreviuous.className = `distanceToPrevious`;

      distanceToPreviuous.value = SYSTEM.bus[i - 1].wireLen_m;
      actionsContainer.setAttribute(`data-psu`, `detectors`);
      actionsContainer.setAttribute(`data-segmentNumber`, `${i}`);
      wireLengthContainer.appendChild(wireLengthLabel);
      wireLengthContainer.appendChild(distanceToPreviuous);
      actionsContainer.appendChild(wireLengthContainer);
    }
    segmentNumber.appendChild(segmentNumberInput);
    actionDivContainer.className = `actionListContainer`;

    actionDivContainer.appendChild(actionsContainer);
    createAddRemoveButtons(actionsContainer);
  }
  systemActions.appendChild(actionDivContainer);
}

function createAddRemoveButtons(actionsContainer) {
  if (actionsContainer.getAttribute(`data-psu`) !== `PSU`) {
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
    actionsContainer.appendChild(buttonsContainer);
  }
}

function addRemoveActionListener() {
  const segmentListeners = document.querySelector(`.actionListContainer`);

  segmentListeners.addEventListener(
    `click`,
    e => {
      const previewContainer = document.querySelectorAll(`.previewContainer`);
      const actionsList = Array.from(document.querySelectorAll(`.actionsContainer`));

      const imageContainer = document.querySelector(`.deviceImages`);
      const actionsContainer = e.target.closest(`.actionsContainer`);
      const actionContainerToManipulate = actionsList.indexOf(actionsContainer);
      const imageContainerToManipulate = previewContainer[actionContainerToManipulate];
      if (e.target.name === `addSegment`) {
        const objToCopy = Object.assign({}, SYSTEM.bus[actionContainerToManipulate - 1]);
        SYSTEM.bus.splice(actionContainerToManipulate - 1, 0, objToCopy);
        const reduced = systemStatusReducer();

        const segmentCloned = actionsContainer.cloneNode(true);
        const clonedSegmentSelect = segmentCloned.querySelector(`.deviceActionSelect`);
        const newIndex = segmentCloned.querySelector(`.segmentIdentyfier`);
        newIndex.setAttribute(`id`, `segment${actionsList.length}`);
        newIndex.value = actionsList.length;
        clonedSegmentSelect.value = SYSTEM.bus[actionContainerToManipulate].detectorName;
        console.log(clonedSegmentSelect.value);
        selectEvent(clonedSegmentSelect, actionContainerToManipulate);

        imageContainer.insertBefore(imageContainerToManipulate.cloneNode(true), previewContainer[actionContainerToManipulate]);
        actionsContainer.after(segmentCloned);
        systemDetectors(reduced);
        systemSignallers(reduced);
        systemAccessories(reduced);
        statusBusLength(reduced);
        systemPowerConsumption();
        initAppliencedDevices(reduced);
        setPreviewImages(SYSTEM.bus);
      } else if (e.target.name === `removeSegment`) {
        SYSTEM.bus.splice(actionContainerToManipulate - 1, 1);
        actionsContainer.remove();
        imageContainerToManipulate.remove();

        const reduced = systemStatusReducer();
        systemDetectors(reduced);
        systemSignallers(reduced);
        systemAccessories(reduced);
        statusBusLength(reduced);
        systemPowerConsumption();
        initAppliencedDevices(reduced);
        setPreviewImages(SYSTEM.bus);
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
      deviceAmountItem.innerHTML = `${element[Object.values(element)[0]]} <span class ="bold">szt</span>`;
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
      deviceAmountItem.innerHTML = `${element[Object.values(element)[0]]} <span class ="bold">szt</span>`;
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
  accessoryAmountItem.innerHTML = `${findAmounts.amountOfDevices} <span class ="bold">szt</span>`;
  listOfAccessories.appendChild(accessoryItem);
  amountsOfAccessories.appendChild(accessoryAmountItem);
}

function statusBusLength(reduced) {
  const busLength = document.querySelector(`.busLength`);
  busLength.innerHTML = "";
  const busLengthValue = reduced.find(key => key[`wireLength`]);
  busLength.innerHTML = `${busLengthValue[`wireLength`]} <span class="bold"> m </span>`;
}

function systemPowerConsumption(value) {
  const powerConsumption = document.querySelector(`.powerConsumption`);
  powerConsumption.innerHTML = `25 <span class="bold">W</span>`;
}

function setPreviewImages(devices) {
  const previewContainer = document.querySelectorAll(`.previewContainer .busImageContainer img`);
  const detectorImages = document.querySelectorAll(`.previewContainer .detectorImageContainer img`);
  const sirensImages = document.querySelectorAll(`.previewContainer .signallerImageContainer img`);
  devices.forEach((device, i) => {
    if (devices[i].deviceType === `detector`) {
      detectorImages[i].style.visibility = `visible`;
      detectorImages[i].setAttribute("src", `./SVG/${device.detectorName}.svg`);
      previewContainer[i].setAttribute(`src`, `./SVG/tconP.svg`);
      sirensImages[i].style.visibility = `hidden`;
    } else if (devices[i].deviceType === `siren`) {
      sirensImages[i].style.visibility = `visible`;
      sirensImages[i].setAttribute("src", `./SVG/${device.detectorName}.svg`);
      previewContainer[i].setAttribute(`src`, `./SVG/tconL.svg`);
      detectorImages[i].style.visibility = `hidden`;
    }
  });
}

function systemActionDevicesSelect(structureType) {
  const deviceActionSelect = document.querySelectorAll(`.deviceActionSelect`);
  const structureObj = CONSTRUCTIONS.find(constructionType => constructionType.type === structureType);
  const deviceList = structureObj.devices;
  deviceActionSelect.forEach((select, i) => {
    deviceList.forEach((device, i) => {
      if (device.typeOfDevice !== `siren`) {
        const option = document.createElement(`option`);
        option.className = `deviceActionOption`;
        option.innerHTML = `Czujnik ${device.gasDetected}`;
        option.setAttribute(`data-detectedGas`, `${device.gasDetected}`);
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

function selectEvent(select, i) {
  select.addEventListener(`change`, e => {
    SYSTEM.bus[i].detectorName = e.target.value;
    if (e.target.value === `Teta SZOA`) {
      SYSTEM.bus[i].deviceType = `siren`;
      delete SYSTEM.bus[i].toledText;
      const container = document.querySelector(`#actionsContainer${i + 1}`);
      const toled = document.querySelector(`#actionsContainer${i + 1} .toledContainer`);
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
      const container = document.querySelector(`#actionsContainer${i + 1}`);
      const toled = document.querySelector(`#actionsContainer${i + 1} .toledContainer`);
      if (toled) {
        container.removeChild(toled);
      }
    }
    const reduced = systemStatusReducer();
    checkIfUsedDevice(reduced);
    systemDetectors(reduced);
    systemSignallers(reduced);
    systemAccessories(reduced);
    statusBusLength(reduced);
    systemPowerConsumption();
    initAppliencedDevices(reduced);
    setPreviewImages(SYSTEM.bus);
  });
}

function actionsSelectListener() {
  const deviceActionSelect = document.querySelectorAll(`.deviceActionSelect`);
  deviceActionSelect.forEach((select, i) => {
    selectEvent(select, i);
  });
}

function createToledSelect(i) {
  const container = document.querySelector(`#actionsContainer${i + 1}`);
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
      if (!key[detectorName]) {
        key[detectorName] = { [`detectedGas`]: gasDetected, [gasDetected]: 0, detectorName, deviceType };
      }

      if (!key[`wire`]) {
        key[`wire`] = { wireLength: 0 };
      }
      key[detectorName][gasDetected]++;
      key[`amountOfDevices`][`amountOfDevices`]++;

      key[`wire`][`wireLength`] = parseInt(key[`wire`][`wireLength`]) + parseInt(wireLen_m);
      return key;
    }, Object.create(null))
  );
  return reduced;
}

function initAppliencedDevices(reduced) {
  const usedDevicesContainer = document.querySelector(`.usedDevicesContainer`);
  const usedDeviceItemList = Array.from(document.querySelectorAll(`.usedDeviceItem`));
  reduced.forEach((element, i) => {
    if (element.deviceType === `detector` || element.deviceType === `siren`) {
      const checkIfExists = usedDeviceItemList.find(item => item.getAttribute("id") === element.detectorName);
      if (usedDeviceItemList[0].getAttribute("id") === null) {
        const usedDeviceItem = document.querySelector(`.usedDeviceItem`);
        usedDeviceItem.setAttribute(`id`, `${element.detectorName}`);
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
        const cloned = usedDeviceItemList[0].cloneNode(true);
        const clonedDivider = document.querySelector(`.usedDeviceDivider`).cloneNode(true);
        cloned.setAttribute(`id`, `${element.detectorName}`);
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

        usedDevicesContainer.appendChild(cloned);
        usedDevicesContainer.appendChild(clonedDivider);
      }
    }
  });
}

function checkIfUsedDevice(reduced) {
  const usedDeviceItemList = Array.from(document.querySelectorAll(`.usedDeviceItem`));
  usedDeviceItemList.forEach(container => {
    const arr = reduced.map(element => element.detectorName);
    if (!arr.includes(container.getAttribute(`id`))) {
      const parent = container.parentNode;
      const divider = parent.querySelector(`.usedDeviceDivider`);
      parent.removeChild(container);
      parent.removeChild(divider);
    }
  });
}
function generateSystem() {
  const reducer = systemStatusReducer();
  systemDetectors(reducer);
  systemSignallers(reducer);
  systemAccessories(reducer);
  statusBusLength(reducer);
  systemPowerConsumption();
  systemActionDevicesSelect(initSystem.structureType);
  setPreviewImages(SYSTEM.bus);
  actionsSelectListener();
  addRemoveActionListener();
  initAppliencedDevices(reducer);
}

function createPreview() {
  createPreviewImages(SYSTEM.bus.length);
  createPreviewActions(SYSTEM.bus.length);
}
