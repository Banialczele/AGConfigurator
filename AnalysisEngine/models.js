const PowerSupplies =
	[
		{ type: "24V bez podtrzymania", supplyVoltage_V: 24, device: `Jednostka sterująca`},
		{ type: "24V z podtrzymaniem", supplyVoltage_V: 21, device: `Jednostka sterująca` },
		{ type: "48V z/bez podtrzymaniem", supplyVoltage_V: 48, device: `Jednostka sterująca` }
	];


const Cables =
	[
		{ type: "2 x 1 mm2", resistivity_OhmPerMeter: 0.0181 },
		{ type: "2 x 1,5 mm2", resistivity_OhmPerMeter: 0.0121 },
		{ type: "2 x 2,5 mm2", resistivity_OhmPerMeter: 0.00741 },
		{ type: "2 x 4 mm2", resistivity_OhmPerMeter: 0.00461 }
	];

const Devices =
	[
		{ type: "Teta EcoWent", power_W: 0.3, current_A: 0.006, minVoltage_V: 12, icon: "EcoWent.svg" }, // see adms://s:192.168.0.251/b:archidemes/i:165964
		{ type: "Teta EcoDet", power_W: 1.27, current_A: 0.008, minVoltage_V: 12, icon: "EcoDet.svg" }, // see adms://s:192.168.0.251/b:archidemes/i:165964
		{ type: "Teta EcoWent + MiniDet", power_W: 1.27, current_A: 0.008, minVoltage_V: 12, icon: "EcoWent_MiniPel.svg", isBig: true }, // see adms://s:192.168.0.251/b:archidemes/i:165964
		{ type: "Teta EcoTerm", power_W: 1.27, current_A: 0.008, minVoltage_V: 12, icon: "EcoTerm.svg" }, // see adms://s:192.168.0.251/b:archidemes/i:165964
		{ type: "Teta EcoH", power_W: 1.8, current_A: 0.002, minVoltage_V: 12, icon: "TetaEcoH.svg" }, // see adms://s:192.168.0.251/b:archidemes/i:226424
		{ type: "Teta EcoN", power_W: 1.27, current_A: 0.008, minVoltage_V: 12, icon: "TetaEcoN.svg" }, // see EcoTerm
		{ type: "TOLED", power_W: 2.62, current_A: -0.005, minVoltage_V: 15, icon: "TOLED.svg" }, // see adms://s:192.168.0.251/b:archidemes/i:226424	
		{ type: "Teta SZOA", power_W: 2.91, current_A: -0.007, minVoltage_V: 15, icon: "SZOA.svg" },	// see adms://s:192.168.0.251/b:archidemes/i:226424
		{ type: "Control V", power_W: 3.47, current_A: -0.011, minVoltage_V: 15, icon: "ControlV.svg" }	// see adms://s:192.168.0.251/b:archidemes/i:226424
	];

const NewDevices = [
	{ type: "Teta EcoWent", power_W: 0.3, current_A: 0.006, minVoltage_V: 12, icon: "Teta EcoWent.svg", typeOfDevice: `device`, device: `Czujnik gazu`}, // see adms://s:192.168.0.251/b:archidemes/i:165964
	{ type: "Teta EcoDet", power_W: 1.27, current_A: 0.008, minVoltage_V: 12, icon: "Teta EcoDet.svg", typeOfDevice: `device`, device: `Czujnik gazu`}, // see adms://s:192.168.0.251/b:archidemes/i:165964
	{ type: "Teta EcoWent + MiniDet", power_W: 1.27, current_A: 0.008, minVoltage_V: 12, icon: "Teta EcoWentMiniDet.svg", isBig: true, typeOfDevice: `device`, device: `Czujnik gazu`}, // see adms://s:192.168.0.251/b:archidemes/i:165964
	{ type: "Teta EcoTerm", power_W: 1.27, current_A: 0.008, minVoltage_V: 12, icon: "Teta EcoTerm.svg", typeOfDevice: `device`, device: `Czujnik gazu` }, // see adms://s:192.168.0.251/b:archidemes/i:165964
	{ type: "Teta EcoH", power_W: 1.8, current_A: 0.002, minVoltage_V: 12, icon: "Teta EcoH.svg", typeOfDevice: `device`, device: `Czujnik gazu`}, // see adms://s:192.168.0.251/b:archidemes/i:226424
	{ type: "Teta EcoN", power_W: 1.27, current_A: 0.008, minVoltage_V: 12, icon: "Teta EcoN.svg", typeOfDevice: `device`, device: `Czujnik gazu`}, // see EcoTerm
	{ type: "TOLED", power_W: 2.62, current_A: -0.005, minVoltage_V: 15, icon: "TOLED.svg", typeOfDevice: `siren`, device: `Tablica ostrzegawcza`}, // see adms://s:192.168.0.251/b:archidemes/i:226424	
	{ type: "Teta SZOA", power_W: 2.91, current_A: -0.007, minVoltage_V: 15, icon: "Teta SZOA.svg", typeOfDevice: `siren`, device: `Sygnalizator`},	// see adms://s:192.168.0.251/b:archidemes/i:226424
	{ type: "Teta SZOAmini", power_W: 2.91, current_A: -0.007, minVoltage_V: 15, icon: "SZOAmini.svg", typeOfDevice: `siren`, device: `Sygnalizator`},	// see adms://s:192.168.0.251/b:archidemes/i:226424
	{ type: "Control V", power_W: 3.47, current_A: -0.011, minVoltage_V: 15, icon: "ControlV.svg", typeOfDevice: `siren`, device: `Sterownik`},	// see adms://s:192.168.0.251/b:archidemes/i:226424
	{ type: "Control V + zawór", power_W: 3.47, current_A: -0.011, minVoltage_V: 15, icon: "ControlVZawor.svg", typeOfDevice: `siren`, device: `Zawór ze sterownikiem`},	// see adms://s:192.168.0.251/b:archidemes/i:226424
	{ type: "T-conL", icon: "T-conL.svg", typeOfDevice: `bus`},
	{ type: "T-conP", icon: "T-conP.svg", typeOfDevice: `bus`}
];

