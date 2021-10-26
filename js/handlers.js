function handlePSU() {
	const psuContainer = document.getElementById('powerSupply');
	psuContainer.addEventListener('change', e => {
		systemData.supplyType = e.target.value;
		// systemInformation();
	});
}

function addSegmentsToBus(amount) {
	for (let i = 0; i < parseInt(amount); i++) {
		systemData.bus.push(systemData.bus[0]);
		if (i !== 0) {
			createInstallationSegment(i);
		}
	}
}


function adjustSystemCables() {
	const installationSegment = document.querySelector(`.adjustCable`);
	installationSegment.addEventListener('click', e => { matchCablesToSystem(); }, false);
}

function handleFileButtons() {
	const fileButtons = document.querySelector('.fileButtons');
	fileButtons.addEventListener('click', e => {
		if (e.target.id === 'saveSystemToFile') {
			saveToFile(systemData);
		} else if (e.target.id === 'readSystemFromFile') {
			readFromFile(e);
		}
	}, false);
}

function handleBasicDataChange(e, targetName) {
	const rightPanelDevice = document.querySelector(`.deviceSelect`);
	const rightPanelSelect = document.querySelector(`.cableSelect`);
	const rightPanelInput = document.querySelector(`.segmentListCableLength`);
	const segmentContainer = document.querySelectorAll(`.segmentContainer`);
	if (segmentContainer.length === 1) {
		if (targetName === `elementalDeviceLabel`) {
			systemData.bus[0].deviceName = e.target.value;
			rightPanelDevice.value = systemData.bus[0].deviceName ;
		} else if (targetName === `elementalCableLabel`) {
			systemData.bus[0].cableType = e.target.value;
			rightPanelSelect.value = systemData.bus[0].cableType;
		} else if (targetName === `powerSupply`) {
			systemData.supplyType = e.target.value;
		} else if (targetName === `wireDistance`) {
			systemData.bus[0].cableLen_m = parseInt(e.target.value);
			rightPanelInput.value = parseInt(e.target.value);
		}
	}
	setupBusImage();
}

function handleInputAndSelectChange(event, selectedSegment) {
	const segments = document.querySelectorAll('.segmentListContainer');
	const indexToUpdate = Array.from(segments).findIndex(currentSegment => currentSegment === selectedSegment);
	const installationSegments = document.querySelectorAll(`.installationSegment`);
	switch (event.target.name) {
		case 'deviceQuantity': {
			const amountToCopy = event.target.value;
			handleCopyNthTimes(event, amountToCopy);
			break;
		}
		case 'cableSelect': {
			console.log(indexToUpdate);
			systemData.bus[indexToUpdate].cableType = event.target.value;
			const cableSelect = segments[indexToUpdate].querySelector(`.cableSelect`);
			cableSelect.value = event.target.value;
			systemData.bus[indexToUpdate].cableType = event.target.value;
			break;
		}

		case 'deviceSelect': {
			const segmentImg = selectedSegment.querySelector(`.deviceImage${indexToUpdate}`);
			const systemImg = installationSegments[indexToUpdate].querySelector(`.deviceimage`);
			systemData.bus[indexToUpdate].deviceName = event.target.value;
			chooseImg(systemImg, event.target.value, 'deviceImage');

			setupBusImage();
			break;
		}

		case 'cableInput': {
			event.target.value === "" ? event.target.value = 1 : '';
			systemData.bus[indexToUpdate].cableLen_m = parseFloat(event.target.value);
			const cableInput = segments[indexToUpdate].querySelector('input[name="cableInput"]');
			cableInput.value = event.target.value;

			break;
		}
	}
	// systemInformation();
}