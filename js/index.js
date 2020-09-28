const powerSupplies = Installation.powerSupplies.map(powerSupply => ({ ...powerSupply }));
const wires = Installation.cables.map(wires => ({ ...wires }));
const devices = Installation.devices.map(devices => ({ ...devices }));

window.addEventListener('load', () => {
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
	inputs.forEach((input, i) => input.addEventListener('change', e => e.target.value));
	const selectDevice = document.querySelectorAll('.deviceSelect');
	selectDevice.forEach((device, i) => device.addEventListener('change', (e) => {
		devices[i] = devices.find(device => device.type === e.target.value);
		Device.deviceButtons(devices, device.selectedIndex, selectedWireIndex);
	}));



	const handleDOMChange = function() {
		const installationSegments = document.querySelectorAll('.installationSegment');
		const segmentContainer = '.segmentContainer';
		installationSegments.forEach((segment, i) => {
			const deviceButtonContainer = document.querySelector(`${segmentContainer}${i} .deviceContainer .buttonContainer `);	
			segment.addEventListener('click', e => {
				if( e.target.id.includes("Skopiuj") ) {
					handleCopyNthTimes(e, selectedWireIndex,deviceButtonContainer, segment, i);	
				} else if( e.target.id.includes("Usun")) {
					handleDeleteDevice(e);
				}
			}, true)
		})
	}

	const targetNode = document.getElementById("installationContainer");
	const config = { childList: true }
	const observer = new MutationObserver(handleDOMChange);
	observer.observe(targetNode, config)


});




// const selectArr = document.querySelectorAll('select');
// selectArr.forEach(select => {
// 	select.addEventListener('change', (e) => console.log(`${e.target.name} ${e.target.value}`));
// })
// const inputs = document.querySelectorAll('.wireSelectInput');
// inputs.forEach(input => {
// 	input.addEventListener('change', (e) => console.log(e.target.value))
// })

