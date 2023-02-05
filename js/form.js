// Tworzenie opcji dla selecta dot. rodzaju struktury
function createStructureTypesListSelect() {
  const structureTypeSelect = document.getElementById("structureType");
  STRUCTURE_TYPES.forEach((structure) => {
    const structureOption = document.createElement("option");
    setAttributes(structureOption, { class: "structureOption", value: structure.type });
    if (structure.type === initSystem.structureType) {
      setAttributes(structureOption, { selected: "selected" });
    }
    structureOption.appendChild(document.createTextNode(structure.label));
    structureTypeSelect.appendChild(structureOption);
  });
  // Wyłapanie zmian w select dot. wybranego typu struktury, przypisanie go do obiektu inicjującego podgląd systemu, a następnie wygenerowanie listy możliwych do wyboru typu gazu
  structureTypeSelect.addEventListener("change", (event) => {
    initSystem.structureType = event.target[event.target.selectedIndex].value;
    createDetectedGasListSelect();
  });
}

// Tworzenie opcji dla selecta dot. typu gazu
function createDetectedGasListSelect() {
  const gasDetectedSelect = document.getElementById("gasDetected");
  gasDetectedSelect.replaceChildren();
  const { devices } = STRUCTURE_TYPES.find((structure) => structure.type === initSystem.structureType);
  devices.forEach(({ gasDetected, type, typeOfDevice }) => {
    if (typeOfDevice === "detector") {
      const gasOption = document.createElement("option");
      setAttributes(gasOption, { class: "gasOption", value: gasDetected, "data-deviceName": type, "data-deviceType": typeOfDevice });
      if (gasDetected === initSystem.gasDetected) {
        setAttributes(gasOption, { selected: "selected" });
      }
      gasOption.appendChild(document.createTextNode(gasDetected));
      gasDetectedSelect.appendChild(gasOption);
    }
  });
  // Wyłapanie zmian w select dot. wybranego typu gazu i przypisanie nazwy czujnika + rodzaju czujnika do obiektu inicjującego podgląd systemu
  gasDetectedSelect.addEventListener("change", (event) => {
    const option = event.target;
    initSystem.detectorName = option[option.selectedIndex].dataset.devicename;
    initSystem.deviceType = option[option.selectedIndex].dataset.devicetype;
  });
}

// Tworzenie opcji dla selecta dot. możliwości akumulatorowego podtrzymywania pracy
function createBatteryBackUpListSelect() {
  const batteryBackUpSelect = document.getElementById("batteryBackUp");
  const yesOption = document.createElement("option");
  const noOption = document.createElement("option");
  setAttributes(yesOption, { class: "batteryBackupOption", value: "YES" });
  setAttributes(noOption, { class: "batteryBackupOption", value: "NO" });
  if (initSystem.batteryBackUp === "YES") {
    setAttributes(yesOption, { selected: "selected" });
  } else {
    setAttributes(noOption, { selected: "selected" });
  }
  yesOption.appendChild(document.createTextNode("Tak"));
  noOption.appendChild(document.createTextNode("Nie"));
  batteryBackUpSelect.appendChild(yesOption);
  batteryBackUpSelect.appendChild(noOption);
}

// Ustawienie domyślnych wartości dla inputa liczby urządzeń oraz odległości między urządzeniami
function setInputDefaultData() {
  document.getElementById("amountOfDetectors").value = initSystem.amountOfDetectors;
  document.getElementById("EWL").value = initSystem.EWL;
}

// Inicjowanie formularza wraz z domyślnymi ustawieniami
function formInit() {
  createStructureTypesListSelect();
  createDetectedGasListSelect();
  createBatteryBackUpListSelect();
  setInputDefaultData();
}

// Przetwarzanie formularza dot. systemu
function handleFormSubmit() {
  //Zatwierdzenie formularza, przypisanie wybranych przez użytkownika parametrów do obiektu inicjującego podgląd systemu i wygenerowanie podglądu
  const form = document.querySelector(".configForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const system = document.getElementById("system");
    initSystem.amountOfDetectors = parseInt(document.getElementById("amountOfDetectors").value);
    initSystem.structureType = document.getElementById("structureType").value;
    initSystem.gasDetected = document.getElementById("gasDetected").value;
    initSystem.batteryBackUp = document.getElementById("batteryBackUp").value;
    initSystem.EWL = parseInt(document.getElementById("EWL").value);
    createSystemData();
    setSystem(initSystem);
    system.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}