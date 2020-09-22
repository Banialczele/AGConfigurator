const button = function(Devices, selectedDeviceIndex, selectedWireIndex, segmentDiv, deviceDiv, buttonContainer) {
	Devices.forEach((device, index) => {
		const segmentContainer = document.querySelector(`.${segmentDiv}${index}`);
		const deviceContainer = document.querySelector(`.${segmentDiv}${index} .${deviceDiv}`);
		const checkIfDivExists = document.querySelector(`.${segmentDiv}${index} .${deviceDiv} .${buttonContainer}`);
		let deviceButtonContainer;
		let copyButton;
		let deleteButton;

		if( deviceContainer.contains(checkIfDivExists) ) {
			deviceButtonContainer = document.querySelector(`.${segmentDiv}${index} .${deviceDiv} .${buttonContainer}`);

			const firstElementToDelete = document.getElementById(`Skopiuj${index}`);
			const secondElementToDelete = document.getElementById(`Usun${index + 1}`);
			firstElementToDelete.parentNode.removeChild(firstElementToDelete);
			secondElementToDelete.parentNode.removeChild(secondElementToDelete);
		} else {
			deviceButtonContainer = document.createElement('div');
			deviceButtonContainer.setAttribute('id', `#${buttonContainer}`);
			deviceButtonContainer.className = buttonContainer;
		}
		copyButton = document.createElement('input');
		copyButton.type = 'button';
		copyButton.value = `Skopiuj ...n`;
		copyButton.setAttribute('id', `Skopiuj${index}`);

		copyButton.addEventListener('click', e => handleCopyNthTimes(e, selectedDeviceIndex, selectedWireIndex, index, deviceButtonContainer));

		deleteButton = document.createElement('input');
		deleteButton.type = 'button';
		deleteButton.setAttribute('id', `Usun${index + 1}`);
		deleteButton.value = `Usuń`;
		deleteButton.addEventListener('click', e => handleDeleteDevice(e));

		deviceButtonContainer.appendChild(copyButton);
		deviceButtonContainer.appendChild(deleteButton);
		deviceContainer.appendChild(deviceButtonContainer);
		segmentContainer.appendChild(deviceContainer);
	});
};

function handleCopyNthTimes(e, selectedDeviceIndex, selectedWireIndex, deviceIndex, buttonContainer) {
	const input = document.createElement('input');
	const parentContainer = document.querySelector('.installationContainer');
	const installationContainer = document.getElementById(`segmentContainer${deviceIndex}`);
	input.type = 'Number';
	input.setAttribute('id', `quantity`);
	input.setAttribute('min', 0);
	buttonContainer.appendChild(input);

	input.addEventListener('input', (e) => e.target.value);
	input.addEventListener('keypress', (e) => {
		if( e.key === 'Enter' ) {
			const inputToRemove = document.getElementById("quantity");
			inputToRemove.parentNode.removeChild(inputToRemove);

			for( let i = 0; i < e.target.value; i++ ) {
				clone = installationContainer.cloneNode(true);
				clone.id = `segmentContainer${deviceIndex + 1000 + i}`;
				clone.className = `segmentContainer${deviceIndex + 1000 + i}`;
				clone.children[1].children[0].children[0].selectedIndex = selectedWireIndex;
				clone.children[1].children[0].children[0].selectedOptions = clone.children[1].children[0].children[0].options[selectedWireIndex];
				
				clone.children[2].children[0].children[0].selectedIndex = selectedDeviceIndex;
				clone.children[2].children[0].children[0].selectedOptions = clone.children[2].children[0].children[0].options[selectedDeviceIndex];
				parentContainer.insertBefore(clone, parentContainer.children[deviceIndex + 1 + i]);
			}

		}
	});
}

function handleDeleteDevice(e) {
	const nodeToRemove =	e.srcElement.parentNode.parentNode.parentNode; 
	nodeToRemove.parentNode.removeChild(e.srcElement.parentNode.parentNode.parentNode);
}
