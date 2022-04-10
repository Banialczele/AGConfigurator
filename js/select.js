function generateStructureOptions() {
  const structureSelect = document.querySelector(`.structureSelect`);
  for (let i = 0; i < CONSTRUCTIONS.length; i++) {
    const option = document.createElement(`option`);
    option.className = "structureOption";
    option.name = "structureType";
    option.value = CONSTRUCTIONS[i].type;
    option.innerHTML = CONSTRUCTIONS[i].type;
    structureSelect.appendChild(option);
  }
  initSystem.structureType = structureSelect.options[0].value;
  structureSelect.addEventListener("change", e => {
    initSystem.structureType = e.target.value;
    const gasDetectSelect = document.querySelector(`.gasSelect`);
    gasDetectSelect.length = 0;
    generateGasDetectedOptions();
  });
}

function generateGasDetectedOptions() {
  const gasDetectSelect = document.querySelector(`.gasSelect`);
  const deviceListForConstruction = CONSTRUCTIONS.find(element => element.type === initSystem.structureType);
  for (let i = 0; i < deviceListForConstruction.devices.length; i++) {
    if (deviceListForConstruction.devices[i].typeOfDevice === `detector`) {
      const option = document.createElement(`option`);
      option.className = "gasOption";
      option.name = "detectorType";
      option.value = deviceListForConstruction.devices[i].gasDetected;
      option.innerHTML = deviceListForConstruction.devices[i].gasDetected;
      option.setAttribute(`data-deviceName`, `${deviceListForConstruction.devices[i].type}`);
      option.setAttribute(`data-deviceType`, `${deviceListForConstruction.devices[i].typeOfDevice}`);
      gasDetectSelect.appendChild(option);
    }
  }
  initSystem.gasDetected = gasDetectSelect.options[0].value;
  initSystem.detectorName = gasDetectSelect.options[0].getAttribute(`data-deviceName`);
  initSystem.deviceType = gasDetectSelect.options[0].getAttribute(`data-deviceType`);
}

function generateBatteryBackUpOptions() {
  const batteryBackUp = document.querySelector(`.batterySelect`);
  const optionYes = document.createElement(`option`);
  optionYes.className = "batteryBackupOption";
  optionYes.name = "batteryBackUp";
  optionYes.value = `Tak`;
  optionYes.innerHTML = `Tak`;
  batteryBackUp.appendChild(optionYes);
  const optionNo = document.createElement(`option`);
  optionNo.className = "batteryBackupOption";
  optionNo.name = "batteryBackUp";
  optionNo.value = `No`;
  optionNo.innerHTML = `No`;
  batteryBackUp.appendChild(optionNo);
  initSystem.batteryBackUp = batteryBackUp.options[0].value;
  batteryBackUp.addEventListener("change", e => (initSystem.batteryBackUp = e.target.value));
}
