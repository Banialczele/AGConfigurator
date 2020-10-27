const picture = function(type, imageContainer, containerName, imageId, src = '') {
	const newImage = document.createElement('img');	
	newImage.className = `${type}image`;
	switch( type ) {
		case "psu": {
			newImage.setAttribute('id', `${imageId}`);
			const container = document.querySelector(`.${containerName}`);
			const imageSection = document.createElement('div');
			imageSection.className = imageContainer;
			imageSection.appendChild(newImage);
			container.prepend(imageSection);
			break;
		}
		case "cable" : { 
			newImage.setAttribute('id', `${type}${imageId}`);
			const container = document.querySelector(`#${containerName}`);
			const imageSection = document.createElement('div');
			imageSection.className = imageContainer;
			imageSection.appendChild(newImage);
			container.prepend(imageSection);
			break;
		}
		case "device" : {			
			const container = document.querySelector(`#${containerName}`);
			const checkIfExists = document.querySelector(`.${imageContainer}`);
			if( !checkIfExists ) {
				newImage.setAttribute('id', `${type}${imageId}`);
				const imageSection = document.createElement('div');
				imageSection.className = imageContainer;
				imageSection.appendChild(newImage);
				container.prepend(imageSection);
			} else {
				newImage.setAttribute('id', `${imageId}`);
				newImage.className = imageId;
				newImage.setAttribute('src', src);
				newImage.setAttribute('alt', 'unable to find image');
				checkIfExists.prepend(newImage);
			}

			break;
		}

	}

}
