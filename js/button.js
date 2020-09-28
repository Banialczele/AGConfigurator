const idArray = [];

const button = function(Devices, selectedDeviceIndex, selectedWireIndex) {
	Devices.forEach((device, index) => {
		const segmentContainer = document.querySelector(`#segmentContainer${index}`);
		const deviceContainer = document.querySelector(`#segmentContainer${index} .deviceContainer`);
		const deviceButtons = document.querySelector(`#segmentContainer${index} .deviceContainer .deviceButtons`);
		let deviceButtonContainer;

		if( deviceContainer.contains(deviceButtons) ) {
			deviceButtonContainer = document.querySelector(`#segmentContainer${index} .deviceContainer .deviceButtons`);

			const firstElementToDelete = document.getElementById(`Skopiuj${index}`);
			const secondElementToDelete = document.getElementById(`Usun${index + 1}`);
			firstElementToDelete.parentNode.removeChild(firstElementToDelete);
			secondElementToDelete.parentNode.removeChild(secondElementToDelete);
		} else {
			deviceButtonContainer = document.createElement('div');
			deviceButtonContainer.setAttribute('id', `#deviceButtons`);
			deviceButtonContainer.className = `deviceButtons`;
		}
		const copyButton = document.createElement('input');
		copyButton.type = 'button';
		copyButton.value = `Skopiuj ...n`;
		copyButton.setAttribute('id', `Skopiuj${index}`);
		copyButton.addEventListener('click', e => handleCopyNthTimes(e, selectedDeviceIndex, selectedWireIndex, segmentContainer, index));

		const deleteButton = document.createElement('input');
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

function handleCopyNthTimes(e, selectedDeviceIndex, selectedWireIndex, segmentContainer, index) {
	const checkIfInputExists = document.querySelector(`#${segmentContainer.id} .deviceContainer .deviceButtons #quantity`);
	if( checkIfInputExists !== null ) {
		const inputToRemove = document.getElementById("quantity");
		inputToRemove.parentNode.removeChild(inputToRemove);
	} else {
		const input = document.createElement('input');
		const installationContainer = document.querySelector('.installationContainer');
		const segmentDiv = segmentContainer;
		const buttonContainer = document.querySelector(`#${segmentContainer.id} .deviceContainer .deviceButtons`);
		console.log(checkIfInputExists);
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
					clone = segmentDiv.cloneNode(true);

					clone.id = `segmentContainer${50 + 1000 + i}`;
					clone.className = `segmentContainer${50 + 1000 + i}`;
					clone.classList.add("installationSegment");
					clone.children[1].children[0].children[0].selectedIndex = selectedWireIndex;
					clone.children[1].children[0].children[0].selectedOptions = clone.children[1].children[0].children[0].options[selectedWireIndex];

					clone.children[2].children[0].children[0].selectedIndex = selectedDeviceIndex;
					clone.children[2].children[0].children[0].selectedOptions = clone.children[2].children[0].children[0].options[selectedDeviceIndex];
					installationContainer.insertBefore(clone, installationContainer.children[index + 1 + i]);
				}

			}
		});
	}

}

function handleDeleteDevice(e) {
	const nodeToRemove = e.srcElement.parentNode.parentNode.parentNode;
	nodeToRemove.parentNode.removeChild(e.srcElement.parentNode.parentNode.parentNode);
}
