const picture = function(type, imageContainer, containerName, imageId) {
	const newImage = document.createElement('img');
	// const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	newImage.className = `${type}image`; 	
	switch( type ) {
		case "psu": {
			newImage.setAttribute('id', `${imageId}`);
			const container = document.querySelector(`.${containerName}`);
			const imageSection = document.createElement('div');
			imageSection.className = imageContainer;
			// svg.appendChild(newImage)
			imageSection.appendChild(newImage);
			container.prepend(imageSection);
			break;
		}
		case "cable" : { 
			newImage.setAttribute('id', `${type}${imageId}`);
			const container = document.querySelector(`#${containerName}`);
			const imageSection = document.createElement('div');
			imageSection.className = imageContainer;
			// svg.appendChild(newImage)
			imageSection.appendChild(newImage);
			container.prepend(imageSection);
			break;
		}
		case "device" : {
			newImage.setAttribute('id', `${type}${imageId}`);
			const container = document.querySelector(`#${containerName}`);
			const imageSection = document.createElement('div');
			imageSection.className = imageContainer;
			// svg.appendChild(newImage)
			imageSection.appendChild(newImage);
			container.prepend(imageSection);
			break;
		}

	}

}
