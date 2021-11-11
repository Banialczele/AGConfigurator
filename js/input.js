const input = function(cableContainer, cableLabel, inputName, inputContainerDiv, index) {
	const cableDiv = document.querySelector(`${cableContainer}`);
	const inputDiv = document.createElement('div');
	inputDiv.className = inputContainerDiv;
	const label = document.createElement('label');
	label.setAttribute('for', cableLabel);
	const input = document.createElement('input');
	input.type = `number`;
	input.name = inputName;
	input.setAttribute('data-indexOfDevice', `${index}`);
	input.className = 'segmentListCableLength';
	input.setAttribute('min', "0");
	input.setAttribute('step', ".1");
	input.setAttribute(`id`, `${cableLabel}`);

	inputDiv.appendChild(label);
	inputDiv.appendChild(input);
	// input.after(" m");
	cableDiv.appendChild(inputDiv);
}