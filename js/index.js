// Ustawienie domyślnego języka widoku aplikacji
let lang = "PL";

// Główny obiekt zawierający dane utworzonego systemu
const systemData = {
  powerSupply: "",
  devicesTypes: { detectors: [], signallers: [] },
  devices: []
};

// Obiekt inicjacyjny systemu
const initSystem = {
  powerSupply: "Teta MOD Control 1",
  amountOfDetectors: 1,
  EWL: 15,
  detectorName: "Teta EcoWent",
  deviceType: "detector",
  gasDetected: "CO",
  structureType: "garageAndUndergroundCarPark",
  batteryBackUp: "YES",
};

// Etykiety dla widoku aplikacji w obsługiwanych przez aplikację językach
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

// Ustawienie języka aplikacji
function checkLang() {
  let HREF = window.location.href;
  if (HREF.includes("lang=pl")) {
    lang = "PL";
  } else if (HREF.includes("lang=eng")) {
    lang = "EN";
  } else if (HREF.includes("licenses")) {
    displayLicenseInfo();
  }
}

// Wybór języka treści etykiety
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

// Ustawienie nasłuchiwania na przycisku mobilnego menu
function setMobileMenuClickEvent() {
  document.getElementById("navMobileActivationBtn")
    .addEventListener("click", () => {
      document.getElementById("configuratorNavMobile").classList.toggle("active");
      document.querySelector(".navMobileActivationBtnIcon").classList.toggle("active");
    });
}

// Entry point aplikacji, generowanie całego widoku do wproadzenia danych
window.addEventListener("load", () => {
  setMobileMenuClickEvent();
  // Sprawdzenie języka widoku aplikacji po URL
  checkLang();
  // Inicjalizacja formularza wraz z domyślnymi ustawieniami
  formInit();
  // Przetwarzanie formularza dot. systemu
  handleFormSubmit();
  setExportToCSVButtonEvent();
  setExportToJSONButtonEvent();
});

// Reset pozycji scrolla do początku strony
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

// Zbiór rodzaju obiektów
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
        type: "Teta EcoTerm",
        gasDetected: "NG",
        typeOfDevice: "detector",
      },
      {
        type: "Teta EcoDet",
        gasDetected: "LPG",
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
        type: "Teta EcoTerm",
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

// Lista możliwych do wyboru przez użytkownika etykiet dla urządzenia typu TOLED
const TOLED_OPTIONS = [
  { type: "WE", label: "NADMIAR SPALIN NIE WCHODZIĆ" },
  { type: "WJ", label: "NADMIAR SPALIN NIE WJEŻDŻAĆ" },
  { type: "OP", label: "NADMIAR SPALIN OPUŚĆ GARAŻ" },
  { type: "WS", label: "Napis na życzenie klienta" },
];

// Lista z linkami do dokumentacji poszczególnych urządzeń
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
