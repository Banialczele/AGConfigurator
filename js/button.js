const button = function(segment, index) {
	const segmentContainer = document.querySelector(`#segmentContainer${index}`);
	const deviceContainer = document.querySelector(`#segmentContainer${index} .deviceContainer`);
	const deviceButtons = document.querySelector(`#segmentContainer${index} .deviceContainer .deviceButtons`);
	let deviceButtonContainer;
	if( deviceContainer.contains(deviceButtons) ) {
		deviceButtonContainer = document.querySelector(`#segmentContainer${index} .deviceContainer .deviceButtons`);
		const firstElementToDelete = document.getElementById(`Skopiuj${index}`);
		const secondElementToDelete = document.getElementById(`Usun${index}`);
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
	const deleteButton = document.createElement('input');
	deleteButton.type = 'button';
	deleteButton.value = `Usuń`;

	copyButton.setAttribute('id', `Skopiuj0`);
	deleteButton.setAttribute('id', `Usun0`);


	copyButton.addEventListener('click', e => handleCopyNthTimes(e, segmentContainer, index));
	deleteButton.addEventListener('click', e => handleDeleteDevice(e));

	deviceButtonContainer.appendChild(copyButton);
	deviceButtonContainer.appendChild(deleteButton);
	deviceContainer.appendChild(deviceButtonContainer);
	segmentContainer.appendChild(deviceContainer);
};

function handleCopyNthTimes(e, segmentContainer, index) {
	const cableTypeToCopy = e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].value;
	const cableIndexToCopy = e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].selectedIndex;
	const deviceTypeToCopy = e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0].childNodes[0].value;
	const deviceIndexToCopy = e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0].childNodes[0].selectedIndex;
	console.log(cableTypeToCopy);
	console.log(deviceTypeToCopy);
	const checkIfInputExists = document.querySelector(`#${segmentContainer.id} .deviceContainer .deviceButtons #quantity`);
	if( checkIfInputExists !== null ) {
		const inputToRemove = document.getElementById("quantity");
		inputToRemove.parentNode.removeChild(inputToRemove);
	} else {
		const input = document.createElement('input');
		const installationContainer = document.querySelector('.installationContainer');
		const segmentDiv = segmentContainer;
		const buttonContainer = document.querySelector(`#${segmentContainer.id} .deviceContainer .deviceButtons`);
		input.type = 'Number';
		input.setAttribute('id', `quantity`);
		input.setAttribute('min', 0);
		let newIndex = 0;
		buttonContainer.appendChild(input);
		input.addEventListener('input', (e) => e.target.value);
		input.addEventListener('keypress', (e) => {
			if( e.key === 'Enter' ) {
				const inputToRemove = document.getElementById("quantity");
				inputToRemove.parentNode.removeChild(inputToRemove);
				for( let i = 0; i < e.target.value; i++ ) {
					//generating unique index for segment.
					while( newIndex === Cable.usedIndexes[newIndex] ) {
						newIndex++;
						if( newIndex !== Cable.usedIndexes[newIndex] ) {
							Cable.usedIndexes.push(newIndex);
							break;
						}
					}
					clone = segmentDiv.cloneNode(true);
					clone.id = `segmentContainer${newIndex}`;
					clone.className = `segmentContainer${newIndex}`;
					clone.classList.add("installationSegment");
					clone.children[1].children[0].children[0].selectedIndex = cableIndexToCopy;
					clone.children[1].children[0].children[0].selectedOptions = clone.children[1].children[0].children[0].options[cableTypeToCopy];
				 	clone.childNodes[2].childNodes[1].childNodes[0].setAttribute('id', `Skopiuj${newIndex}`);
				 	clone.childNodes[2].childNodes[1].childNodes[1].setAttribute('id', `Usun${newIndex}`);
					clone.children[2].children[0].children[0].selectedIndex = deviceIndexToCopy;
					clone.children[2].children[0].children[0].selectedOptions = clone.children[2].children[0].children[0].options[deviceTypeToCopy];
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

