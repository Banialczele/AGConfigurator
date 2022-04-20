const SYSTEM = {
  powerSupply: "",
  bus: [],
};

let initSystem = {
  amountOfDetectors: 0,
  EWL: 0,
  detectorName: "",
  deviceType: "",
  gasDetected: "",
  structureType: "",
  batteryBackUp: "",
};

let lang = "PL";

const usedText = {
  konfigurator: {
    pl: "Konfigurator Systemów Teta",
    en: "Teta System Configurator",
  },
  systemNiepoprawny: {
    pl: "System: N/A",
    en: "System: N/A",
  },
  zapotrzebowanieMocy: {
    pl: "Zapotrzebowanie na moc przez elementy magistrali: ",
    en: "System power demand: ",
  },
  zaznaczWszystkie: {
    pl: "Zaznacz wszystkie",
    en: "Select all",
  },
  odznaczWszystkie: {
    pl: "Odznacz wszystkie",
    en: "Deselect all",
  },
  dobierzKabel: {
    pl: "Dobierz kabel",
    en: "Adjust cable",
  },
  zachowajSystem: {
    pl: "Zachowaj system",
    en: "Save system",
  },
  wczytajSystem: {
    pl: "Wczytaj system",
    en: "Load system",
  },
  usunSegment: {
    pl: "Usunieto segment",
    en: "Deleted segment",
  },
  usunJedynySegment: {
    pl: "Nie można usunąć jedynego segmentu",
    en: "Cannot delete only segment",
  },
};

const usedIndexes = [];

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

window.addEventListener("load", () => {
  checkLang();
  highlightTeta();
  generateStructureOptions();
  generateGasDetectedOptions();
  generateBatteryBackUpOptions();
  handleDragAndDrop();

  handleFormSubmit();
});

function highlightTeta() {
  let text = document.getElementById(`configuratorInfo`);
  const highlightedText = text.innerHTML.replace(/Teta/, "<span class=hightlighted>Teta</span>");
  text.innerHTML = highlightedText;
}

// index file
function checkLang() {
  let HREF = window.location.href;
  if (HREF.includes(`lang=pl`)) {
    lang = "PL";
  } else if (HREF.includes(`lang=eng`)) {
    lang = "EN";
  } else if (HREF.includes(`licenses`)) {
    displayLicenseInfo();
  }
}

//info file
function chooseText(text) {
  let res;
  switch (lang) {
    case "PL": {
      res = text.pl;
      break;
    }
    case "EN": {
      res = text.en;
      break;
    }
  }
  return res;
}
