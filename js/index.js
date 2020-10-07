const powerSupplies = PowerSupplies.map(powerSupply => ({ ...powerSupply }));
const wires = Cables.map(cable => ({ ...cable }));
const deviceArr = Devices.map(devices => ({ ...devices }));

const collectedData = [];
const initElement = {
	deviceType: "",
	cableType: "",
	calbleLen_m: 0,
}
const completeData = {};

window.addEventListener('load', () => {
	let ExampleSystem1 =
			{
				supplyType: "24V bez podtrzymania",
				bus:
						[
							{
								cableType: "2 x 4 mm2",
								calbleLen_m: 1,
								deviceType: "Teta EcoWent"
							},
							{
								cableType: "2 x 4 mm2",
								calbleLen_m: 1,
								deviceType: "Teta EcoWent"
							},
							{
								cableType: "2 x 4 mm2",
								calbleLen_m: 1,
								deviceType: "Teta EcoWent"
							},
							{
								cableType: "2 x 4 mm2",
								calbleLen_m: 1,
								deviceType: "Teta EcoWent"
							}
						]
			}
			console.log(isSystemOk(ExampleSystem1));

	select(powerSupplies, 'powerSupplyLabel', 'powerSupply', 'powerSupplySegmentContainer', `powerSupplyContainer`, `powerSupply`);
	picture('psu', `psuImageContainer`, `powerSupplyContainer`, `imagePSU`);

	collectedData.push(initElement);
	collectedData.forEach((element, index) => {
		Cable.cableComponent(element, index);
		Device.deviceComponent(element, index);
		Device.deviceButtons(element, index);
	})
	const wireSelect = document.querySelector('.wireSelect');
	const deviceSelect = document.querySelector('.deviceSelect');
	const input = document.querySelector('.wireContainerInput input');

	wireSelect.selectedIndex = wires.findIndex(cable => cable.type === initElement.cableType) + 1;
	deviceSelect.selectedIndex = deviceArr.findIndex(device => device.type === initElement.deviceType) + 1;
	input.value = initElement.calbleLen_m;

	const powerSupplyElement = document.getElementById('powerSupply');
	powerSupplyElement.addEventListener('change', e => {
		completeData.supplyType = e.target.value;
		const img = document.getElementById("imagePSU");
		if( e.target.value === '' ) {
			const parentNode = img.parentNode.parentNode;
			parentNode.removeChild(img.parentNode);
			const newImg = document.createElement('img');
			newImg.setAttribute('id', `imagePSU`);
			const imageSection = document.createElement('div');
			imageSection.className = `imageContainer`;
			imageSection.appendChild(newImg);
			parentNode.prepend(imageSection);
		}
		img.srcset = "./Gfx/CU.svg";
		img.src = "./Gfx/CU.svg";
		img.alt = 'Unable to find image';
	});

	const selectAllCheckboxesButton = document.createElement('input');
	selectAllCheckboxesButton.type = 'button';
	selectAllCheckboxesButton.value = 'Zaznacz wszystkie';
	const unselectAllCheckboxesButton = document.createElement('input');
	unselectAllCheckboxesButton.type = 'button';
	unselectAllCheckboxesButton.value = 'Odznacz wszystkie';

	selectAllCheckboxesButton.addEventListener('click', checkAllCheckboxes);
	unselectAllCheckboxesButton.addEventListener('click', uncheckAllCheckboxes);
	const installationContainer = document.querySelector('.installationContainer');
	installationContainer.append(selectAllCheckboxesButton);
	installationContainer.append(unselectAllCheckboxesButton);
	handleInputAndSelectChange('wireSelect');
	handleInputAndSelectChange('deviceSelect');
	handleInputAndSelectChange('wireContainerInput input');
	

	const handleDOMChange = function() {
		const installationSegments = document.querySelectorAll('.installationSegment');
		const powerSupplyElement = document.getElementById('powerSupply');
		powerSupplyElement.addEventListener('change', e => completeData.supplyType = e.target.value);

		//single segment changes
		handleInputAndSelectChange('wireSelect');
		handleInputAndSelectChange('deviceSelect');
		handleInputAndSelectChange('wireContainerInput input');

		// const segments = document.querySelectorAll('.installationSegment');
		// const checkboxes = document.querySelectorAll('input[type="checkbox"]');
		// let lastChecked;
		//
		// function handleCheck(e) {
		// 	let inBetween = false;
		//
		// 	if( e.shiftKey && this.checked ) {
		// 		checkboxes.forEach(checkbox => {
		// 			if( checkbox === this || checkbox === lastChecked ) {
		// 				inBetween = !inBetween;
		// 			}
		// 			if( inBetween ) {
		// 				checkbox.checked = true;
		// 			}
		// 		})
		// 	}
		// 	lastChecked = this;
		// }
		//
		// segments.forEach(segment => {
		// 	const checkbox = segment.querySelector('input[type="checkbox"]');
		// 	checkbox.addEventListener('change', handleCheck);
		//
		// 	if( checkbox.checked ) {
		// 		handleManySegmentsChange(segment);
		// 	}
		// })


		//adding buttons functionality
		installationSegments.forEach((segment, i) => {
			segment.addEventListener('click', e => {
				if( e.target.id.includes("Skopiuj") ) {
					handleCopyNthTimes(e, segment, i);
				} else if( e.target.id.includes("Usun") ) {
					handleDeleteDevice(e, segment, i);
				}
			}, false);
		});
		completeData.bus = [ ...collectedData ];
		console.log(ExampleSystem1);
		console.log(completeData);
		console.log(isSystemOk(completeData));
	}

	const targetNode = document.getElementById("installationContainer");
	const config = { childList: true };
	const observer = new MutationObserver(handleDOMChange);
	observer.observe(targetNode, config);
});

const uncheckAllCheckboxes = function() {
	const segments = document.querySelectorAll('.installationSegment');
	segments.forEach((segment) => {
		const checkbox = segment.querySelector('input[type="checkbox"]');
		checkbox.checked = false;
	});
}

const checkAllCheckboxes = function() {
	const segments = document.querySelectorAll('.installationSegment');
	segments.forEach((segment) => {
		const checkbox = segment.querySelector('input[type="checkbox"]');
		checkbox.checked = true;
		if( checkbox.checked === true ) {
			handleManySegmentsChange(segment);
		}
	});
};

handleManySegmentsChange = function(segment) {
	segment.addEventListener('change', (e) => {
		switch( e.target.name ) {
			case 'wireSelect': {
				const images = document.querySelectorAll('.cableImageContainer');
				const allWireSelect = document.querySelectorAll('.wireSelect');
				allWireSelect.forEach(wire => wire.value = e.target.value);
				images.forEach((image, i) => {
					if( i < images.length - 1 ) {
						chooseImg(image.firstChild, 'bus');
					} else if( i === images.length - 1 ) {
						chooseImg(image.firstChild, `busEnd`);
					}
				});
				collectedData.forEach(wire => wire.cableType = e.target.value);
				break;
			}
			case 'deviceSelect': {
				const images = document.querySelectorAll('.deviceImageContainer');
				const allDeviceSelect = document.querySelectorAll('.deviceSelect');

				allDeviceSelect.forEach(device => device.value = e.target.value);
				images.forEach(image => chooseImg(image.firstChild, e.target.value));
				collectedData.forEach(device => device.deviceType = e.target.value);
				break;
			}
			case 'wireInput': {
				const allInputs = document.querySelectorAll('input[name="wireInput"]');
				allInputs.forEach(input => input.value = e.target.value);
				collectedData.forEach(input => input.calbleLen_m = e.target.value);
				break;
			}
		}
	});
}

handleInputAndSelectChange = (selector) => {
	const selectElement = document.querySelectorAll(`.${selector}`);
	selectElement.forEach((element, i) => element.addEventListener('change', e => {
		switch( e.target.name ) {
			case 'wireSelect': {
				const img = document.getElementById(`cableimage${i}`);
				collectedData[i].cableType = e.target.value;
				if( selectElement.length !== 0 && selectElement.length !== selectElement.length - 1 ) {
					chooseImg(img, 'bus');
				} else {
					chooseImg(img, `busEnd`);
				}
				break;
			}
			case 'deviceSelect': {
				const img = document.getElementById(`deviceimage${i}`);
				collectedData[i].deviceType = e.target.value;
				chooseImg(img, e.target.value);
				break;
			}
			case 'wireInput': {
				collectedData[i].calbleLen_m = e.target.value;
			}
		}
	}));
};

chooseImg = (img, value) => {
	switch( value ) {
		case "Teta EcoWent" : {
			img.srcset = "./Gfx/EcoWent.svg";
			img.src = "./Gfx/EcoWent.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "Teta EcoDet": {
			img.srcset = "./Gfx/EcoDet.svg";
			img.src = "./Gfx/EcoDet.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "Teta EcoWent + MiniDet": {
			img.srcset = "./Gfx/EcoWent_MiniPel.svg";
			img.src = "./Gfx/EcoWent_MiniPel.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "Teta EcoTerm": {
			img.srcset = "./Gfx/EcoTerm.svg";
			img.src = "./Gfx/EcoTerm.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "Teta EcoH": {
			img.srcset = "./Gfx/TetaEcoH.svg";
			img.src = "./Gfx/TetaEcoH.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "Teta EcoN": {
			img.srcset = "./Gfx/TetaEcoN.svg";
			img.src = "./Gfx/TetaEcoN.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "TOLED": {
			img.srcset = "./Gfx/TOLED.svg";
			img.src = "./Gfx/TOLED.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "SZOA": {
			img.srcset = "./Gfx/SZOA.svg";
			img.src = "./Gfx/SZOA.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "Control V": {
			img.srcset = "./Gfx/ControlV.svg";
			img.src = "./Gfx/ControlV.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "bus": {
			img.srcset = "./Gfx/Bus.svg";
			img.src = "./Gfx/Bus.svg";
			img.alt = 'Unable to find image';
			break;
		}
		case "busEnd": {
			img.srcset = "./Gfx/busEnd.svg";
			img.src = "./Gfx/busEnd.svg";
			img.alt = 'Unable to find image';
			break;
		}
	}
}
