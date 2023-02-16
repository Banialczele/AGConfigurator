//Podgląd systemu, na tych danych bazują wszystkie funkcje
const SYSTEM = {
  powerSupply: "",
  bus: [],
};

// Główny obiekt zawierający dane utworzonego systemu
const systemData = {
  powerSupply: "",
  devicesTypes: { detectors: [], signallers: [] },
  devices: []
};

//Dane, które są wprowadzane z pierwszego widoku.
let initSystem = {
  powerSupply: "Teta MOD Control 1",
  amountOfDetectors: 3,
  EWL: 15,
  detectorName: "Teta EcoWent",
  deviceType: "detector",
  gasDetected: "CO",
  structureType: "garageAndUndergroundCarPark",
  batteryBackUp: "YES",
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

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

//Entry point apki, generowanie całego widoku do wproadzenia danych.
window.addEventListener("load", () => {
  //Sprawdzenie języka po URL
  checkLang();
  //Podświetlenie napisu TETA
  highlightTeta();
  // Inicjalizacja formularza z domyślnymi ustawieniami
  formInit();
  //Walidacja danych z podglądu systemu
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

const STRUCTURE_TYPES = [
  {
    type: "garageAndUndergroundCarPark",
    label: "Garaże i parkingi podziemne",
    devices: [
      {
        type: "Teta EcoWent",
        gasDetected: "CO",
        typeOfDevice: "detector",
      },
      {
        type: "Teta EcoDet",
        gasDetected: "LPG",
        typeOfDevice: "detector",
      },
      {
        type: "Teta EcoWent + MiniDet",
        gasDetected: "CO + LPG",
        typeOfDevice: "detector",
      },
      {
        type: "Teta EcoN",
        gasDetected: "NO2",
        typeOfDevice: "detector",
      },
      // {
      //   type: "Teta MiniDet",
      //   gasDetected: "LPG",
      //   typeOfDevice: "detector",
      // },
      {
        type: "Teta SZOA",
        typeOfDevice: "signaller",
      },
      {
        type: "TOLED",
        typeOfDevice: "signaller",
      },
    ],
  },
  {
    type: "powerPack",
    label: "Akumulatornie",
    devices: [
      {
        type: "Teta EcoH",
        gasDetected: "H2",
        typeOfDevice: "detector",
      },
      {
        type: "Teta SZOA",
        typeOfDevice: "signaller",
      },
      {
        type: "TOLED",
        typeOfDevice: "signaller",
      },
    ],
  },
  {
    type: "hall",
    label: "Hale",
    devices: [
      {
        type: "Teta EcoDet",
        gasDetected: "LPG",
        typeOfDevice: "detector",
      },
      {
        type: "Teta Term",
        gasDetected: "NG",
        typeOfDevice: "detector",
      },
      {
        type: "Teta SZOA",
        typeOfDevice: "signaller",
      },
      {
        type: "TOLED",
        typeOfDevice: "signaller",
      },
    ],
  },
  {
    type: "other",
    label: "Inne",
    devices: [
      {
        type: "Teta EcoWent",
        gasDetected: "CO",
        typeOfDevice: "detector",
      },
      {
        type: "Teta EcoDet",
        gasDetected: "LPG",
        typeOfDevice: "detector",
      },
      {
        type: "Teta EcoWent + MiniDet",
        gasDetected: "CO + LPG",
        typeOfDevice: "detector",
      },
      {
        type: "Teta EcoN",
        gasDetected: "NO2",
        typeOfDevice: "detector",
      },
      {
        type: "Teta MiniDet",
        gasDetected: "LPG",
        typeOfDevice: "detector",
      },
      {
        type: "Teta EcoH",
        gasDetected: "H2",
        typeOfDevice: "detector",
      },
      {
        type: "Teta Term",
        gasDetected: "NG",
        typeOfDevice: "detector",
      },
      {
        type: "Teta SZOA",
        typeOfDevice: "signaller",
      },
      {
        type: "TOLED",
        typeOfDevice: "signaller",
      },
    ],
  },
];

const TOLED_OPTIONS = [
  { type: "WE", label: "NADMIAR SPALIN NIE WCHODZIĆ" },
  { type: "WJ", label: "NADMIAR SPALIN NIE WJEŻDŻAĆ" },
  { type: "OP", label: "NADMIAR SPALIN OPUŚĆ GARAŻ" },
  { type: "WS", label: "Napis na życzenie klienta" },
];

const DEVICES_DOCS = {
  "Teta EcoWent": "https://www.atestgaz.pl/produkt/czujnik-gazu-teta-ecowent",
  "Teta EcoWent + MiniDet": "https://www.atestgaz.pl/produkt/czujnik-gazu-teta-ecowent",
  "Teta EcoDet": "https://www.atestgaz.pl/produkt/czujnik-gazu-teta-ecodet",
  "Teta EcoN": "https://www.atestgaz.pl/produkt/czujnik-gazu-teta-econ",
  "Teta EcoH": "https://www.atestgaz.pl/produkt/czujnik-gazu-teta-ecoh",
  "Teta MiniDet": "https://www.atestgaz.pl/produkt/czujnik-gazu-teta-minidet",
  "Teta SZOA": "https://www.atestgaz.pl/produkt/sygnalizator-teta-szoa",
  "TOLED": "https://www.atestgaz.pl/produkt/tablica-ostrzegawcza-toled",
  "MSV": "https://www.atestgaz.pl/produkt/zawor-odcinajacy-msv",
  "Control V": "https://www.atestgaz.pl/produkt/sterownik-zaworu-control-v"
}
