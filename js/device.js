const Device = {
	deviceComponent: function(device, index) {
		picture('device', `deviceImageContainer`, `segmentContainer${index}`, `image${index}`);
		select(null, `deviceLabel`, `deviceSelect`, `segmentContainer${index}`, `deviceContainer`, 'device', index);
	},
	deviceButtons: function(element, index) {
		button(element, index);
	}
}

