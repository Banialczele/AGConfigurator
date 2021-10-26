const Cable = {
	usedIndexes: [],
	cableComponent: function(cable, index) {
		createInstallationSegment(index);
		createSegmentList(index);
		//cable select for list of devices.
		select(null, `cableDiameter${index}`, `cable`, index, `segmentContainer${index}`);
		//cable input for list of devices.
		input(cable, `.cableLength${index}`, `cableInput`, 'cableInput', 'cableContainerInput');
		//picture for bus devices.
		// picture('cable', `cableImageContainer`, `installationBusImage`, `image${index}`, index);
		this.usedIndexes.push(index);
	},	
}
