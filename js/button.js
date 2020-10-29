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
	const index = parseInt(e.target.id.match(/\d+/)[0]);

	//select segment to copy
	const segmentContainer = document.querySelector(`.segmentContainer${index}`);
	const segments = document.querySelectorAll('.installationSegment');
	const indexWhereToCopyDiv = Array.from(segments).findIndex(segment => segment === segmentContainer);

	//data to insert
	const cableTypeToCopy = (segmentContainer.querySelector(`.cableSelect`)).value;
	const cableIndexToCopy = (segmentContainer.querySelector(`.cableSelect`)).selectedIndex;
	const deviceTypeToCopy = (segmentContainer.querySelector(`.deviceSelect`)).value;
	const deviceIndexToCopy = (segmentContainer.querySelector(`.deviceSelect`)).selectedIndex;
	const cableLength = (segmentContainer.querySelector(`.cableContainerInput input`)).value;

	//select parentNode of container to insert data at specific index
	const installationContainer = segmentContainer.parentNode;
	//button container to insert input to
	const buttonContainer = segmentContainer.querySelector(`.deviceButtons`);
	const checkIfInputExists = buttonContainer.querySelector(`#quantity`);
	if(checkIfInputExists){
		buttonContainer.removeChild(checkIfInputExists);
	}
	//create input element to get amount of segments to create
	const input = document.createElement('input');
	const num = parseInt(cableLength) || 0;

	input.type = 'Number';
	input.setAttribute('id', `quantity`);
	input.setAttribute('min', 0);
	let newIndex = 0;
	buttonContainer.appendChild(input);

	input.addEventListener('keypress', (e) => {
		if( e.key === 'Enter' ) {
			//delete check/uncheck checkboxes buttons
			const buttonDiv = document.querySelector('.buttonDiv');
			if( buttonDiv ) {
				buttonDiv.parentNode.removeChild(buttonDiv);
			}

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

				const cloneDeviceImage = clone.querySelector('.deviceimage');
				const cloneCableImage = clone.querySelector('.cableimage');
				cloneDeviceImage.setAttribute('id', `deviceimage${newIndex}`);
				cloneCableImage.setAttribute('id', `cableimage${newIndex}`);

				const cloneCopyButton = clone.querySelector(`.deviceButtons #Skopiuj${index}`);
				const cloneDeleteButton = clone.querySelector(`.deviceButtons #Usun${index}`);
				cloneCopyButton.setAttribute('id', `Skopiuj${newIndex}`);
				cloneDeleteButton.setAttribute('id', `Usun${newIndex}`);

				const deviceSelect = clone.querySelector('select[name="deviceSelect"]');
				deviceSelect.selectedIndex = deviceIndexToCopy;
				deviceSelect.selectedOptions = cableSelect.options[deviceTypeToCopy];
				let updateIndexToCopyCloneTo = indexWhereToCopyDiv + 1 + i;  
				installationContainer.insertBefore(clone, installationContainer.children[updateIndexToCopyCloneTo]);
			}
				checkboxButtons(installationContainer);
		}
	});
	

}

function handleDeleteDevice(e) {
	const segments = document.querySelectorAll('.installationSegment');
	if( segments.length > 1) {
		const lastSegmentIndex = segments.length - 1;
		const oneBeforeLast = segments.length - 2;
		
		//get number of element from id
		const index = e.target.id.match(/\d+/)[0];
		const segmentContainer = document.querySelector(`.segmentContainer${index}`);

		//change position of buttonDiv to oneBeforeLast segment IF last segment has been deleted.
		if( segments.length >= 2 && lastSegmentIndex === parseInt(index) ) {
			const lastSegment = document.querySelector(`.segmentContainer${lastSegmentIndex}`);
			const buttonContainer = lastSegment.querySelector('.buttonDiv');
			if( buttonContainer ) {
				buttonContainer.parentNode.removeChild(buttonContainer);
				const oneBeforeLastSegment = document.querySelector(`.segmentContainer${oneBeforeLast}`);
				const oneBeforeLastContainer = oneBeforeLastSegment.querySelector(`.checkboxAndcableContainer`);
				oneBeforeLastContainer.appendChild(buttonContainer);
			}
		}

		const findIndexToDelete = Array.from(segments).findIndex(segment => segment === segmentContainer);

		if( segmentContainer !== null && segmentContainer.parentNode !== null ) {
			segmentContainer.parentNode.removeChild(segmentContainer);
		}
		collectedData.splice(findIndexToDelete, 1);
	}
}


function checkboxButtons(installationContainer) {
	const segmentContainer = installationContainer.lastChild;
	const buttonContainer = segmentContainer.querySelector('.checkboxAndcableContainer');
	const buttonDiv = document.createElement('div');
	buttonDiv.className = 'buttonDiv';
	//creating selectAll and unselectAll buttons for every segment
	const selectAllCheckboxesButton = document.createElement('input');
	selectAllCheckboxesButton.setAttribute('id', 'selectAllCheckboxes');
	selectAllCheckboxesButton.type = 'button';
	selectAllCheckboxesButton.value = 'Zaznacz wszystkie';

	const unCheckAllCheckboxesButton = document.createElement('input');
	unCheckAllCheckboxesButton.setAttribute('id', 'unCheckAllCheckboxesButton');
	unCheckAllCheckboxesButton.type = 'button';
	unCheckAllCheckboxesButton.value = 'Odznacz wszystkie';

	buttonDiv.prepend(unCheckAllCheckboxesButton);
	buttonDiv.prepend(selectAllCheckboxesButton);
	buttonContainer.appendChild(buttonDiv);
}

