// test data see adms://s:192.168.0.251/b:archidemes/i:224904
let ExampleSystem1 =
{
	supplyType: "24V bez podtrzymania",
	bus: 
	[
		{cableType: "2 x 1,5 mm2", cableLen_m: 250, deviceType: "Teta EcoWent"},
		{cableType: "2 x 1,5 mm2", cableLen_m: 50, deviceType: "Teta EcoWent"},
		{cableType: "2 x 1,5 mm2", cableLen_m: 50, deviceType: "Teta EcoWent"},
		{cableType: "2 x 1,5 mm2", cableLen_m: 50, deviceType: "Teta EcoWent"}
	],
    require:
    [
        {deviceSupplyVoltage_V: 23.54, inputCurrent_A: 0.068, inputVoltage_V: 24, isDeviceGoodVoltage: true},
        {deviceSupplyVoltage_V: 23.47, inputCurrent_A: 0.051, inputVoltage_V: 23.54, isDeviceGoodVoltage: true},
        {deviceSupplyVoltage_V: 23.42, inputCurrent_A: 0.034, inputVoltage_V: 23.47, isDeviceGoodVoltage: true},
        {deviceSupplyVoltage_V: 23.4, inputCurrent_A: 0.017, inputVoltage_V: 23.42, isDeviceGoodVoltage: true}
    ]
}

let ExampleSystem2 =
{
	supplyType: "24V bez podtrzymania",
	bus: 
	[
		{cableType: "2 x 1,5 mm2", cableLen_m: 250, deviceType: "Teta EcoWent"},
		{cableType: "2 x 1,5 mm2", cableLen_m: 5, deviceType: "Teta EcoDet"},
		{cableType: "2 x 1,5 mm2", cableLen_m: 50, deviceType: "Teta EcoTerm"},
		{cableType: "2 x 1,5 mm2", cableLen_m: 50, deviceType: "Teta EcoWent + MiniDet"},
        {cableType: "2 x 4 mm2", cableLen_m: 2, deviceType: "Teta EcoWent + MiniDet"}
	],
    require:
    [
        {deviceSupplyVoltage_V: 43.51, inputCurrent_A: 0.667, inputVoltage_V: 48, isDeviceGoodVoltage: true},
        {deviceSupplyVoltage_V: 43.36, inputCurrent_A: 0.655, inputVoltage_V: 43.51, isDeviceGoodVoltage: true},
        {deviceSupplyVoltage_V: 42.47, inputCurrent_A: 0.621, inputVoltage_V: 43.36, isDeviceGoodVoltage: true},
        {deviceSupplyVoltage_V: 41.64, inputCurrent_A: 0.587, inputVoltage_V: 42.47, isDeviceGoodVoltage: true},
        {deviceSupplyVoltage_V: 41.57, inputCurrent_A: 0.518, inputVoltage_V: 41.64, isDeviceGoodVoltage: true},
        
        
        
        
        
        
        
        
        
    ]
}

//-----------------------------------------------------------------------------
// helper functions

function logEleStatus(bus)
{
	console.log(bus);
	console.log("Sections:");
	for (let i = 0; i < bus.length; i++)
	{
		console.log("Section " + i + ":");
		console.log(bus[i].eleStatus);
	}
}

function isGoodCalculateBusSection(bus, require, lambda_percent)
{
    for (let num = 0; num < bus.length; num++)
	{
        if (((Math.abs(bus[num].eleStatus.inputVoltage_V - require[num].inputVoltage_V))/ require[num].inputVoltage_V < lambda_percent * 0.01) && 
            ((Math.abs(bus[num].eleStatus.deviceSupplyVoltage_V - require[num].deviceSupplyVoltage_V))/ require[num].deviceSupplyVoltage_V < lambda_percent * 0.01) && 
            ((Math.abs(bus[num].eleStatus.inputCurrent_A - require[num].inputCurrent_A))/ require[num].inputCurrent_A < lambda_percent * 0.01) &&
            (bus[num].eleStatus.isDeviceGoodVoltage == require[num].isDeviceGoodVoltage))
                 
        
	   {
		console.log("Good");
	   }
	   else
	   {
		console.log("Wrong", "Section number:", num);
        console.log("Require:", require[num]);
        console.log("It was calculate:", bus[num].eleStatus);
	   }    
    }
}

//-----------------------------------------------------------------------------
// tests
function runTests()
{
	console.log("run tests from");
	console.log(ExampleSystem1);
	console.log(isSystemOk(ExampleSystem1));
	
	console.log(getDeviceCurrent(getObjByType(Devices, "Teta EcoDet"), 20));
	console.log(getDeviceCurrent(getObjByType(Devices, "Teta EcoDet"), 10));
	console.log(getDeviceCurrent(getObjByType(Devices, "Teta EcoDet"), 30));
	
	console.log(getBusSectionVoltageDrop_V(ExampleSystem1.bus[1], 1));
	
	let sectEleStatus = {
		inputVoltage_V: 20,		
		inputCurrent_A: 0,
		deviceSupplyVoltage_V: 20
	};
	
	console.log(getBusSectionEleStatus(ExampleSystem1.bus[1], sectEleStatus));
	console.log(getBusEleStatus(ExampleSystem1.bus, 20));
    
    
    
	logEleStatus(ExampleSystem1.bus);
	console.log(ExampleSystem1.bus[1].eleStatus.inputVoltage_V);
	
	console.log(getBusEleStatus(ExampleSystem1.bus, 6));
	logEleStatus(ExampleSystem1.bus);
	
	console.log(analiseSystem(ExampleSystem1));
	
	logEleStatus(ExampleSystem1.bus);
	console.log(isSystemOk(ExampleSystem1));
		
	console.log(analiseSystem(ExampleSystem2));
	logEleStatus(ExampleSystem2.bus);	
	console.log(isSystemOk(ExampleSystem2));
	console.log(ExampleSystem1.require[1].inputCurrent_A);
    
    console.log("---------------------------------------------");
    console.log("Test ExampleSystem1");
    console.log("---------------------------------------------");
    isGoodCalculateBusSection(ExampleSystem1.bus, ExampleSystem1.require, 1);
    console.log("----------------END TEST -----ExampleSystem1------------------");
    
}
