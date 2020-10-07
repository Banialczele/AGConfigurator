const input = function(param, wireContainer, wireLabel, inputName, inputContainerDiv) {
	const wireDiv = document.querySelector(`${wireContainer}`);
	const inputDiv = document.createElement('div');
	inputDiv.className = inputContainerDiv;
	const label = document.createElement('label');
	label.setAttribute('for', wireLabel);
	const input = document.createElement('input');
	input.type = `number`;
	input.name = inputName;
	input.setAttribute('placeholder', 'Długość [m]');
	input.setAttribute('step', 0.1);
	input.setAttribute('min', "0");
	inputDiv.appendChild(label);
	inputDiv.appendChild(input);
	wireDiv.appendChild(inputDiv);
}
