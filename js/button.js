const button = function(index) {
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

	deviceButtonContainer.appendChild(copyButton);
	deviceButtonContainer.appendChild(deleteButton);
	deviceContainer.appendChild(deviceButtonContainer);
	segmentContainer.appendChild(deviceContainer);
};

function handleCopyNthTimes(e) {
	//get number of element from id
	const index = e.target.id.match(/\d+/)[0];
	const segmentContainer = e.target.parentNode.parentNode.parentNode;
	
	const cableTypeToCopy = segmentContainer.querySelector(`.cableSelect`).value;
	const cableIndexToCopy = segmentContainer.querySelector(`.cableSelect`).selectedIndex;
	const deviceTypeToCopy = segmentContainer.querySelector(`.deviceSelect`).value;
	const deviceIndexToCopy = segmentContainer.querySelector(`.deviceSelect`).selectedIndex;
	
	const checkIfInputExists = document.querySelector(`#${segmentContainer.id} .deviceContainer .deviceButtons #quantity`);
	if( checkIfInputExists !== null ) {
		const inputToRemove = document.getElementById("quantity");
		inputToRemove.parentNode.removeChild(inputToRemove);
	} else {
		const input = document.createElement('input');
		const installationContainer = document.querySelector('.installationContainer');
		const segmentDiv = segmentContainer;
		const buttonContainer = document.querySelector(`#${segmentContainer.id} .deviceContainer .deviceButtons`);
		const cableLengthDiv = document.querySelector(`#${segmentContainer.id} .cableContainer .cableContainerInput`);
		let cableLength = cableLengthDiv.childNodes[1].value;
		let num = parseInt(cableLength) || 0 ;
		input.type = 'Number';
		input.setAttribute('id', `quantity`);
		input.setAttribute('min', 0);
		let newIndex = 0;
		buttonContainer.appendChild(input);
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
					const newSegment = {
						cableType: `${cableTypeToCopy}`,
						calbleLen_m: num,
						deviceType: `${deviceTypeToCopy}`
					}
					collectedData.splice(index + 1, 0, newSegment);
					clone = segmentDiv.cloneNode(true);
					const checkboxNewId = clone.querySelector('input[type="checkbox"]');
					checkboxNewId.setAttribute('id', `checkbox${newIndex}`);
					clone.id = `segmentContainer${newIndex}`;
					clone.className = `segmentContainer${newIndex}`;
					clone.classList.add("installationSegment");
					clone.children[2].children[1].children[0].children[0].selectedIndex = cableIndexToCopy;
					clone.children[2].children[1].children[0].children[0].selectedOptions = clone.children[2].children[1].children[0].children[0].options[cableTypeToCopy];
					clone.childNodes[0].childNodes[0].setAttribute('id', `deviceimage${newIndex}`);
					clone.childNodes[1].childNodes[0].setAttribute('id', `cableimage${newIndex}`);
					clone.childNodes[3].childNodes[1].childNodes[0].setAttribute('id', `Skopiuj${newIndex}`);
					clone.childNodes[3].childNodes[1].childNodes[1].setAttribute('id', `Usun${newIndex}`);
					clone.children[3].children[0].children[0].selectedIndex = deviceIndexToCopy;
					clone.children[3].children[0].children[0].selectedOptions = clone.children[3].children[0].children[0].options[deviceTypeToCopy];
					installationContainer.insertBefore(clone, installationContainer.children[index + 1 + i]);
				}
			}
		});
	}
}

function handleDeleteDevice(e) {
	//get number of element from id
	const index = e.target.id.match(/\d+/)[0];	
	const segmentContainer = e.target.parentNode.parentNode.parentNode;
	
	if( segmentContainer !== null && segmentContainer.parentNode !== null) {
		segmentContainer.parentNode.removeChild(segmentContainer);
	}
	collectedData.splice(index, 1);
}

