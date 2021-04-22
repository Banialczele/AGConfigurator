function handleDOMChange() {
	assignNewIdToCheckbox();
	setupBusImage();
	handleCheckboxes();
	handlePSU();
	systemInformation();
}


function handlePSU() {
	const psuContainer = document.getElementById('powerSupply');
	psuContainer.addEventListener('change', e => {
		systemData.supplyType = e.target.value;
		systemInformation();
	});
}

function handleCheckboxes() {
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');

	let lastChecked;

	function handleChange(e) {
		let inBetween = false;

		if (e.shiftKey && this.checked) {
			checkboxes.forEach(checkbox => {
				if (checkbox === this || checkbox === lastChecked) {
					inBetween = !inBetween;
				}
				if (inBetween) {
					checkbox.checked = true;
				}
			});
		}
		lastChecked = this;
	}

	checkboxes.forEach(checkbox => checkbox.addEventListener('click', handleChange));
}

function handleButtonEvents() {
	const installationSegment = document.getElementById('powerManagementInstallationContainer');
	installationSegment.addEventListener('click', e => {
		if (e.target.id.includes("Skopiuj")) {
			const amountToCopy = e.target.parentNode.childNodes[1].value;
			handleCopyNthTimes(e, amountToCopy);
		} else if (e.target.id.includes("Usun")) {
			handleDeleteDevice(e);
		} else if (e.target.id.includes('checkCheckboxes')) {
			selectDeselectCheckboxes(e);
		} else if (e.target.id.includes('matchCablesToSystem')) {
			matchCablesToSystem();
		} else if (e.target.id === 'saveSystemToFile') {
			saveToFile(systemData);
		} else if (e.target.id === 'readSystemFromFile') {
			readFromFile(e);
		}
	}, false);
}


function handleInputAndSelectChange(event, selectedSegment) {
	const segments = document.querySelectorAll('.installationSegment');
	const checkedSegments = selectedCheckboxes(segments);
	const indexToUpdate = Array.from(segments).findIndex(currentSegment => currentSegment === selectedSegment);
	switch (event.target.name) {
		case 'deviceQuantity': {
			const amountToCopy = event.target.value;
			handleCopyNthTimes(event, amountToCopy);
			break;
		}
		case 'cableSelect': {
			systemData.bus[indexToUpdate].cableType = event.target.value;
			if (checkedSegments) {
				checkedSegments.forEach((segment) => {
					const indexToUpdate = Array.from(segments).findIndex(checkedSegment => segment === checkedSegment);
					const cableSelect = segment.querySelector(`.cableSelect`);
					cableSelect.value = event.target.value;
					systemData.bus[indexToUpdate].cableType = event.target.value;
				});
			}
			break;
		}

		case 'deviceSelect': {
			const img = selectedSegment.querySelector(`.deviceimage`);
			systemData.bus[indexToUpdate].deviceType = event.target.value;
			chooseImg(img, event.target.value, 'deviceImage');

			if (checkedSegments) {
				checkedSegments.forEach((segment) => {
					const indexOfDevicesToUpdate = Array.from(segments).findIndex(checkedSegment => segment === checkedSegment);
					const deviceSelect = segment.querySelector(`.deviceSelect`);
					const img = segment.querySelector(`.deviceimage`);
					chooseImg(img, event.target.value, 'deviceImage');
					deviceSelect.value = event.target.value;
					systemData.bus[indexOfDevicesToUpdate].deviceType = event.target.value;
				});
			}
			setupBusImage();
			break;
		}

		case 'cableInput': {
			event.target.value === "" ? event.target.value = 1 : '';
			systemData.bus[indexToUpdate].cableLen_m = parseFloat(event.target.value);
			if (checkedSegments) {
				checkedSegments.forEach((segment) => {
					const indexOfCablesToUpdate = Array.from(segments).findIndex(checkedSegment => segment === checkedSegment);
					const cableInput = segment.querySelector('input[name="cableInput"]');
					cableInput.value = event.target.value;
					systemData.bus[indexOfCablesToUpdate].cableLen_m = parseFloat(event.target.value);
				});
			}
			break;
		}
	}
	systemInformation();
}