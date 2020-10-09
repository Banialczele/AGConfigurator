const Cable = {
	usedIndexes: [],
	cableComponent: function(cable, index) {
		checkbox(cable, 'installationContainer', `segmentContainer${index}`, `checkboxAndcableContainer`, index);
		select(null, 'cableLabel', 'cableSelect', `segmentContainer${index} .checkboxAndcableContainer`, `cableContainer`, `cable`);
		input(cable, `.segmentContainer${index} .cableContainer`, `cableInput`, 'cableInput', 'cableContainerInput');
		picture('cable', `cableImageContainer`, `segmentContainer${index}`, `image${index}`);
		this.usedIndexes.push(index);
	},

}


