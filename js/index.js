const powerSupplies = Installation.powerSupplies.map(powerSupply => ({ ...powerSupply }));
// const wires = Installation.cables.map(wires => ({ ...wires }));
// const devices = Installation.devices.map(devices => ({ ...devices }));
const collectedData = [];
const initElement = {
	wireType: "2 x 1 mm2",
	wireLength: "5",
	deviceType: "Teta EcoDet"
}

window.addEventListener('load', () => {
	select(powerSupplies, 'powerSupplyLabel', 'powerSupply', 'PowerSupplySegmentContainer', `powerSupplyContainer`, `powerSupply`);

	collectedData.push(initElement);
	collectedData.forEach((element, index) => {
		Cable.cableComponent(element, index);
		Device.deviceComponent(element, index);
		Device.deviceButtons(element, index);
	})

	const powerSupplyElement = document.getElementById('powerSupply');
	let powerSupply = '';
	powerSupplyElement.addEventListener('change', e => powerSupply = e.target.value);
	//
	// let selectedWireIndex = null;
	// const selectWire = document.querySelectorAll('.wireSelect');
	// selectWire.forEach((wire, i) => wire.addEventListener('change', e => {
	// 	// wires[i] = wires.find(wire => wire.type === e.target.value);
	// 	// selectedWireIndex = wire.selectedIndex;
	// 	console.log(i);
	// }));

	const inputs = document.querySelectorAll(`input[name="wireInput"]`);
	inputs.forEach((input) => input.addEventListener('change', e => e.target.value));

	// const selectDevice = document.querySelectorAll('.deviceSelect');
	// selectDevice.forEach((device, i) => device.addEventListener('change', (e) => {
	// 	// devices[i] = devices.find(device => device.type === e.target.value);
	// 	// Device.deviceButtons(devices, devices.length, device.selectedIndex, selectedWireIndex);
	// 	console.log(i);
	// }));

	const handleDOMChange = function() {
		const installationSegments = document.querySelectorAll('.installationSegment');
		const segmentContainer = '.segmentContainer';
		installationSegments.forEach((segment, i) => {
			segment.addEventListener('click', e => {
				if( e.target.id.includes("Skopiuj") ) {
					handleCopyNthTimes(e, segment, i);
				} else if( e.target.id.includes("Usun") ) {
					handleDeleteDevice(e);
				}
			}, true);
			// const newSegment = {
			// 	cableType: segment.childNodes[1].childNodes[0].childNodes[0].value,
			// 	cableLength: segment.childNodes[1].childNodes[1].childNodes[1].value,
			// 	deviceType: segment.childNodes[2].childNodes[0].childNodes[0].value
			// }
			// collectedData.push(newSegment);
		});
	}
	const targetNode = document.getElementById("installationContainer");
	const config = { childList: true };
	const observer = new MutationObserver(handleDOMChange);
	observer.observe(targetNode, config);

});

// window.addEventListener('change', () => {
// 	const handleDOMChange = function() {
// 		const installationSegments = document.querySelectorAll('.installationSegment');
// 		const segmentContainer = '.segmentContainer';
// 		installationSegments.forEach((segment, i) => {
// 			segment.addEventListener('click', e => {
// 				if( e.target.id.includes("Skopiuj") ) {
// 					handleCopyNthTimes(e, segment, i);
// 				} else if( e.target.id.includes("Usun") ) {
// 					handleDeleteDevice(e);
// 				}
// 			}, true);
// 			const newSegment = {
// 				cableType: segment.childNodes[1].childNodes[0].childNodes[0].value,
// 				cableLength: segment.childNodes[1].childNodes[1].childNodes[1].value,
// 				deviceType: segment.childNodes[2].childNodes[0].childNodes[0].value
// 			}
// 			collectedData.push(newSegment);
// 		});
// 	}
//
// 	const targetNode = document.getElementById("installationContainer");
// 	const config = { childList: true };
// 	const observer = new MutationObserver(handleDOMChange);
// 	observer.observe(targetNode, config);
//	
// 	console.table(collectedData);
// })
//



// const selectArr = document.querySelectorAll('select');
// selectArr.forEach(select => {
// 	select.addEventListener('change', (e) => console.log(`${e.target.name} ${e.target.value}`));
// })
// const inputs = document.querySelectorAll('.wireSelectInput');
// inputs.forEach(input => {
// 	input.addEventListener('change', (e) => console.log(e.target.value))
// })

