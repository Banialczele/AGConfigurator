const checkbox = function (param, installationContainerName, segmentName, checkboxContainer) {	
	const input = document.createElement('input');
	const segmentDiv = document.createElement('div');
	const checkboxDiv = document.createElement('div');
	segmentDiv.className = segmentName;
	segmentDiv.setAttribute('id', segmentName );
	checkboxDiv.className = checkboxContainer;
	const div = document.querySelector(`.${installationContainerName}`);
	input.type = 'checkbox';
	input.name = param.type;
	checkboxDiv.appendChild(input);
	segmentDiv.appendChild(checkboxDiv);
	div.appendChild(segmentDiv);
};
