const Cable = {
	usedIndexes: [],
	cableComponent: function(cable, index) {
		checkbox(cable, 'installationContainer', `segmentContainer${index}`, `checkboxAndWireContainer`);
		select(null, 'wireLabel', 'wireSelect', `segmentContainer${index} .checkboxAndWireContainer`, `wireContainer`, `cable`);
		input(cable, `.segmentContainer${index} .wireContainer`, `wireInput`, 'wireInput', 'wireContainerInput');
		picture('cable', `cableImageContainer`, `segmentContainer${index}`, `image${index}`);
		this.usedIndexes.push(index);
	},

}


