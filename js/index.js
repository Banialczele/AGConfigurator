//Podgląd systemu, na tych danych bazują wszystkie funkcje
const SYSTEM = {
  powerSupply: "",
  bus: [],
};

//Dane, które są wprowadzane z pierwszego widoku.
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
    pl: "Usunięto segment",
    en: "Deleted segment",
  },
  usunJedynySegment: {
    pl: "Nie można usunąć jedynego segmentu",
    en: "Cannot delete only segment",
  },
};

//Tablica z używanymi indexami
const usedIndexes = [];

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

//Entry point apki, generowanie całego widoku do wproadzenia danych.
window.addEventListener("load", () => {
  //Sprawdzenie języka po URL
  checkLang();
  //Podświetlenie napisu TETA
  highlightTeta();
  //Generowanie opcji kolejno: rodzaj obiektu, wykrywany gaz, podtrzymanie akumulatorowe pracy.
  generateStructureOptions();
  generateGasDetectedOptions();
  generateBatteryBackUpOptions();
  //Obsługa drag'n'drop która nie działa, trzeba to wykończyć!
  handleDragAndDrop();
  //Wczytanie systemu z pliku
  readFromFile();
  //Walidacja danych z podglądu systemu
  console.log("sdflks");
  handleFormSubmit();
});

//Podświetlenie napisu "TETA" na czerwono w nagłówku strony
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

//Wybór języka
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

//Zmiany w nazewnictwie!
