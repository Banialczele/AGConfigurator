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
	//get index of an element from id
	const index = e.target.id.match(/\d+/)[0];
	
	//select segment to copy
	const segmentContainer = document.querySelector(`.segmentContainer${index}`);

	//get data from segment to insert into copy
	const cableTypeToCopy = (segmentContainer.querySelector(`.cableSelect`)).value;
	const cableIndexToCopy = (segmentContainer.querySelector(`.cableSelect`)).selectedIndex;
	const deviceTypeToCopy = (segmentContainer.querySelector(`.deviceSelect`)).value;
	const deviceIndexToCopy = (segmentContainer.querySelector(`.deviceSelect`)).selectedIndex;
 	const cableLength = (segmentContainer.querySelector(`.cableContainerInput input`)).value;

	//create input element to get amount of segments to create
	const input = document.createElement('input');
	//select parentNode of container to insert data at specific index
	const installationContainer = segmentContainer.parentNode;
	//button container to insert input to
	const buttonContainer = segmentContainer.querySelector(`.deviceButtons`);

	const num = parseInt(cableLength) || 0;

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
					cableLen_m: num,
					deviceType: `${deviceTypeToCopy}`
				};
				
				//adding new segment at specific index ( not at the end of array )
				collectedData.splice(index + 1, 0, newSegment);
				
				let clone = segmentContainer.cloneNode(true);
				
				const checkboxNewId = clone.querySelector('input[type="checkbox"]');
				checkboxNewId.setAttribute('id', `checkbox${newIndex}`);
				clone.id = `segmentContainer${newIndex}`;
				clone.className = `segmentContainer${newIndex}`;
				clone.classList.add("installationSegment");
				
				const cableSelect = clone.querySelector('select[name="cableSelect"]');
				cableSelect.selectedIndex = cableIndexToCopy;
				cableSelect.selectedOptions = cableSelect.options[cableTypeToCopy];
				
				const cloneImage = clone.querySelector('.deviceimage');
				cloneImage.setAttribute('id', `deviceimage${newIndex}`);
				cloneImage.setAttribute('id', `cableimage${newIndex}`);
				
				const cloneCopyButton = clone.querySelector(`.deviceButtons #Skopiuj${index}`);
				const cloneDeleteButton = clone.querySelector(`.deviceButtons #Usun${index}`);
				cloneCopyButton.setAttribute('id', `Skopiuj${newIndex}`);
				cloneDeleteButton.setAttribute('id', `Usun${newIndex}`);
				
				const deviceSelect = clone.querySelector('select[name="deviceSelect"]');
				deviceSelect.selectedIndex = deviceIndexToCopy;
				deviceSelect.selectedOptions = cableSelect.options[deviceTypeToCopy];
			
				installationContainer.insertBefore(clone, installationContainer.children[index + 1 + i]);
			}
		}
	});

}

function handleDeleteDevice(e) {
	//get number of element from id
	const index = e.target.id.match(/\d+/)[0];	
	const segmentContainer = document.querySelector(`.segmentContainer${index}`);
		
	if( segmentContainer !== null && segmentContainer.parentNode !== null) {
		segmentContainer.parentNode.removeChild(segmentContainer);
	}
	collectedData.splice(index, 1);
}

