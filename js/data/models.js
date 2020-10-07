const PowerSupplies = [
  {
    "type": "24V bez podtrzymania",
    "supplyVoltage_V": 24
  },
  {
    "type": "24V z podtrzymaniem",
    "supplyVoltage_V": 21
  },
  {
    "type": "48V z/bez podtrzymaniem",
    "supplyVoltage_V": 48
  }
];

const Cables = [
  {
    type: "2 x 1 mm2",
    resistivity_OhmPerMeter: 4
  },
  {
    type: "2 x 1,5 mm2",
    resistivity_OhmPerMeter: 3
  },
  {
    type: "2 x 2,5 mm2",
    resistivity_OhmPerMeter: 2
  },
  {
    type: "2 x 4 mm2",
    resistivity_OhmPerMeter: 1
  }
]
const Devices = [
  {
    type: "Teta EcoWent",
    power_W: 0.1,
    current_A: 0.1,
    minVoltage_V: 15,
    icon: "EcoWent.svg"
  },
  {
    type: "Teta EcoDet",
    power_W: 1.5,
    current_A: 0,
    minVoltage_V: 15,
    icon: "EcoDet.svg"
  },
  {
    type: "Teta EcoWent + MiniDet",
    power_W: 1.5,
    current_A: 0,
    minVoltage_V: 15,
    icon: "EcoWent_MiniPel.svg"
  },
  {
    type: "Teta EcoTerm",
    power_W: 1.7,
    current_A: 0,
    minVoltage_V: 15,
    icon: "EcoTerm.svg"
  },
  {
    type: "Teta EcoH",
    power_W: 1.7,
    current_A: 0,
    minVoltage_V: 15,
    icon: "EcoH.svg"
  },
  {
    type: "Teta EcoN",
    power_W: 1.7,
    current_A: 0,
    minVoltage_V: 15,
    icon: "EcoN.svg"
  },
  {
    type: "TOLED",
    power_W: 1.7,
    current_A: 0,
    minVoltage_V: 15,
    icon: "TOLED.svg"
  },
  {
    type: "SZOA",
    power_W: 1.7,
    current_A: 0,
    minVoltage_V: 15,
    icon: "SZOA.svg"
  },
  {
    type: "Control V",
    power_W: 1.7,
    current_A: 0,
    minVoltage_V: 15,
    icon: "ControlV.svg"
  },
]
