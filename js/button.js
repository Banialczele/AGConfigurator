const button = function(index) {
	const segmentContainer = document.querySelector(`#segmentContainer${index}`);
	const deviceContainer = segmentContainer.querySelector(`.deviceContainer`);
	let deviceButtonContainer;

	deviceButtonContainer = document.createElement('div');
	deviceButtonContainer.setAttribute('id', `#deviceButtons`);
	deviceButtonContainer.className = `deviceButtons`;

	const copyButton = document.createElement('button');
	copyButton.innerHTML = '<img src="./Icons/copy16.png" alt="Unable to find image"/>';
	copyButton.className = "copyButton";
	const deleteButton = document.createElement('button');
	deleteButton.innerHTML = `<img src="./Icons/remove.png" alt="Unable to find image" />`;
	deleteButton.className = "deleteButton";
	//create input element to get amount of segments to create
	const input = document.createElement('input');

	input.type = 'Number';
	input.setAttribute('id', `quantity${index}`);
	input.className = 'deviceQuantity';
	input.setAttribute('name', `deviceQuantity`);
	input.value = 1;
	input.setAttribute('min', 0);

	copyButton.setAttribute('id', `Skopiuj${index}`);
	deleteButton.setAttribute('id', `Usun${index}`);

	deviceButtonContainer.appendChild(copyButton);
	deviceButtonContainer.appendChild(input);
	deviceButtonContainer.appendChild(deleteButton);
	deviceContainer.appendChild(deviceButtonContainer);
	segmentContainer.appendChild(deviceContainer);
};

function handleCopyNthTimes(e, amountToCopy) {
	console.log(e.target);
	e.preventDefault();  
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

	const num = parseFloat(cableLength) || 0;

	let newIndex = 0;

	const buttonDiv = document.querySelector('.buttonDiv');
	if( buttonDiv ) {
		buttonDiv.parentNode.removeChild(buttonDiv);
	}

	for( let i = 0; i < amountToCopy; ++i ) {
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
		const clone = segmentContainer.cloneNode(true);
			//delete configurationPanel from segment
		const configurationPanel = clone.querySelector('.configurationPanel');
		if( configurationPanel ) {
			configurationPanel.parentNode.removeChild(configurationPanel);
		}
		
		const deviceQuantity = clone.querySelector(`#quantity${index}`);
		deviceQuantity.setAttribute('id', `quantity${newIndex}`);
		deviceQuantity.value = 1;

		const checkboxNewId = clone.querySelector('input[type="checkbox"]');
		checkboxNewId.setAttribute('id', `checkbox${newIndex}`);
		clone.id = `segmentContainer${newIndex}`;
		clone.className = `segmentContainer${newIndex}`;
		clone.classList.add("installationSegment");

		const cableSelect = clone.querySelector('select[name="cableSelect"]');
		cableSelect.selectedIndex = cableIndexToCopy;
		cableSelect.selectedOptions = cableSelect.options[cableTypeToCopy];
		clone.dataset.listener = 'false';
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
}

function handleDeleteDevice(e) {
	const segments = document.querySelectorAll('.installationSegment');
	if( segments.length > 1) {     	
		//get number of element from id
		const index = e.target.id.match(/\d+/)[0];
		const segmentContainer = document.querySelector(`.segmentContainer${index}`);
		
		const findIndexToDelete = Array.from(segments).findIndex(segment => segment === segmentContainer);
		collectedData.splice(findIndexToDelete, 1);
		if( segmentContainer !== null && segmentContainer.parentNode !== null ) {
			const infoPopup = document.querySelector('.popup');
			
			infoPopup.innerText = `Usunięto segment: ${index}`;
						
			segmentContainer.parentNode.removeChild(segmentContainer);
			infoPopup.classList.add('open-active')
			setTimeout( () =>  { infoPopup.classList.remove('open-active') }, 3000); 			
		}
	} else {
			const infoPopup = document.querySelector('.popup');
			infoPopup.innerText = `Nie można usunąć pierwszego segmentu`;
						
			infoPopup.classList.add('open-active')
			setTimeout( () =>  { infoPopup.classList.remove('open-active') }, 3000); 
	}
}

function checkboxButtons(installationContainer) {
	const checkboxesContainer = document.createElement('div');
	checkboxesContainer.className = 'configurationPanel';

	const masterCheckboxWithLabel = document.createElement('div');
	masterCheckboxWithLabel.className = 'masterCheckboxWithLabel';
	
	const checkCheckboxes = document.createElement('input');
	checkCheckboxes.type = 'checkbox';
	checkCheckboxes.setAttribute('id', 'checkCheckboxes');
	checkCheckboxes.setAttribute('name', 'checkCheckboxes');
	const checkCheckboxesLabel = document.createElement('label');

	checkCheckboxesLabel.innerHTML = 'Zaznacz wszystkie';
	checkCheckboxesLabel.setAttribute('for', 'checkCheckboxes');
	checkCheckboxesLabel.setAttribute('id', 'checkCheckboxesLabel');

	const matchSystemCables = document.createElement('input');
	matchSystemCables.setAttribute('id', 'matchCablesToSystem');
	matchSystemCables.type = "button";
	matchSystemCables.value = "Dobierz kabel";

	checkboxesContainer.prepend(matchSystemCables);
	masterCheckboxWithLabel.prepend(checkCheckboxesLabel);     	
	masterCheckboxWithLabel.prepend(checkCheckboxes);

	checkboxesContainer.appendChild(masterCheckboxWithLabel);
	installationContainer.appendChild(checkboxesContainer);
}

