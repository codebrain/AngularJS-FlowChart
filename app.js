
//
// Define the 'app' module.
//
angular.module('app', ['distributionNetwork', ])

//
// Simple service to create a prompt.
//
.factory('prompt', function () {

	/* Uncomment the following to test that the prompt service is working as expected.
	return function () {
		return "Test!";
	}
	*/

	// Return the browsers prompt function.
	return prompt;
})

//
// Application controller.
//
.controller('AppCtrl', ['$scope', 'prompt', function AppCtrl ($scope, prompt) {

	//
	// Code for the delete key.
	//
	var deleteKeyCode = 46;

	//
	// Code for control key.
	//
	var ctrlKeyCode = 17;

	//
	// Set to true when the ctrl key is down.
	//
	var ctrlDown = false;

	//
	// Code for A key.
	//
	var aKeyCode = 65;

	//
	// Code for esc key.
	//
	var escKeyCode = 27;

	//
	// Selects the next block id.
	//
	var nextBlockID = 10;

	//
	// Setup the data-model for the network.
	//
	var networkDataModel = {

		blocks: [
			{
				name: "Example Block 1",
				id: 0,
				x: 0,
				y: 0,
				width: 350,
				inputConnectors: [
					{
						name: "A",
					},
					{
						name: "B",
					},
					{
						name: "C",
					},
				],
				outputConnectors: [
					{
						name: "A",
					},
					{
						name: "B",
					},
					{
						name: "C",
					},
				],
			},

			{
				name: "Example Block 2",
				id: 1,
				x: 400,
				y: 200,
				inputConnectors: [
					{
						name: "A",
					},
					{
						name: "B",
					},
					{
						name: "C",
					},
				],
				outputConnectors: [
					{
						name: "A",
					},
					{
						name: "B",
					},
					{
						name: "C",
					},
				],
			},

		],

		connections: [
			{
				source: {
					blockID: 0,
					connectorIndex: 1,
				},

				dest: {
					blockID: 1,
					connectorIndex: 2,
				},
			},
			{
				source: {
					blockID: 0,
					connectorIndex: 0,
				},

				dest: {
					blockID: 1,
					connectorIndex: 0,
				},
			},

		]
	};

	//
	// Event handler for key-down on the distributionnetwork.
	//
	$scope.keyDown = function (evt) {

		if (evt.keyCode === ctrlKeyCode) {

			ctrlDown = true;
			evt.stopPropagation();
			evt.preventDefault();
		}
	};

	//
	// Event handler for key-up on the distributionnetwork.
	//
	$scope.keyUp = function (evt) {

		if (evt.keyCode === deleteKeyCode) {
			//
			// Delete key.
			//
			$scope.networkViewModel.deleteSelected();
		}

		if (evt.keyCode == aKeyCode && ctrlDown) {
			// 
			// Ctrl + A
			//
			$scope.networkViewModel.selectAll();
		}

		if (evt.keyCode == escKeyCode) {
			// Escape.
			$scope.networkViewModel.deselectAll();
		}

		if (evt.keyCode === ctrlKeyCode) {
			ctrlDown = false;

			evt.stopPropagation();
			evt.preventDefault();
		}
	};

	//
	// Add a new block to the network.
	//
	$scope.addNewBlock = function () {

		var blockName = prompt("Enter a block name:", "New block");
		if (!blockName) {
			return;
		}

		//
		// Template for a new block.
		//
		var newBlockDataModel = {
			name: blockName,
			id: nextBlockID++,
			x: 0,
			y: 0,
			inputConnectors: [
				{
					name: "X"
				},
				{
					name: "Y"
				},
				{
					name: "Z"
				}
			],
			outputConnectors: [ 
				{
					name: "1"
				},
				{
					name: "2"
				},
				{
					name: "3"
				}
			],
		};

		$scope.networkViewModel.addBlock(newBlockDataModel);
	};

	//
	// Add an input connector to selected blocks.
	//
	$scope.addNewInputConnector = function () {

		var selectedBlocks = $scope.networkViewModel.getSelectedBlocks();
		for (var i = 0; i < selectedBlocks.length; ++i) {
			var block = selectedBlocks[i];
			block.addInputConnector({});
		}
	};

	//
	// Add an output connector to selected blocks.
	//
	$scope.addNewOutputConnector = function () {
		var selectedBlocks = $scope.networkViewModel.getSelectedBlocks();
		for (var i = 0; i < selectedBlocks.length; ++i) {
			var block = selectedBlocks[i];
			block.addOutputConnector({});
		}
	};

	//
	// Delete selected blocks and connections.
	//
	$scope.deleteSelected = function () {

		$scope.networkViewModel.deleteSelected();
	};

	//
	// Create the view-model for the network and attach to the scope.
	//
	$scope.networkViewModel = new distributionnetwork.ChartViewModel(networkDataModel);
}])
;