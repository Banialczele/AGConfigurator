const powerSupplies = Installation.powerSupplies.map(powerSupply => ({ ...powerSupply }));
const wires = Installation.cables.map(wires => ({ ...wires }));
const devices = Installation.devices.map(devices => ({ ...devices }));

window.addEventListener('load' || 'change', () => {
	console.table(wires);
	select(powerSupplies, 'powerSupplyLabel', 'powerSupply', 'powerManagementPowerSupplyContainer', `powerSupplyContainer`);
	Cable.cableComponent(wires);
	Device.deviceComponent(devices);
	Device.deviceButtons(devices);
	let selectedWireIndex = null;
	const selectWire = document.querySelectorAll('.wireSelect');
	selectWire.forEach((wire, i) => wire.addEventListener('change', e => {
		wires[i] = wires.find(wire => wire.type === e.target.value);
		selectedWireIndex = wire.selectedIndex;
	}));
	const inputs = document.querySelectorAll(`input[name="wireInput"]`);
	let quantity = 0;
	inputs.forEach((input, i) => input.addEventListener('change', e => e.target.value));
	const selectDevice = document.querySelectorAll('.deviceSelect');
	selectDevice.forEach((device, i) => device.addEventListener('change', (e) => {
		devices[i] = devices.find(device => device.type === e.target.value);
		Device.deviceButtons(devices, device.selectedIndex, selectedWireIndex, quantity);
	}));
});




// const selectArr = document.querySelectorAll('select');
// selectArr.forEach(select => {
// 	select.addEventListener('change', (e) => console.log(`${e.target.name} ${e.target.value}`));
// })
// const inputs = document.querySelectorAll('.wireSelectInput');
// inputs.forEach(input => {
// 	input.addEventListener('change', (e) => console.log(e.target.value))
// })

