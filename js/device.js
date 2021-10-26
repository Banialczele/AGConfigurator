const Device = {
	deviceComponent: function(device, index) {
		//device select for list of devices.
		select(null,  `deviceType${index}`,'device', index, `segment${index}`);
	},
}