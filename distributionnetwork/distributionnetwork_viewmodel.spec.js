describe('distributionnetwork-viewmodel', function () {

	//
	// Create a mock data model from a simple definition.
	//
	var createMockDataModel = function (blockIds, connections) {

		var blockDataModels = null;

		if (blockIds) {
			blockDataModels = [];

			for (var i = 0; i < blockIds.length; ++i) {
				blockDataModels.push({
					id: blockIds[i],
					x: 0,
					y: 0,
					inputConnectors: [ {}, {}, {} ],
					outputConnectors: [ {}, {}, {} ],
				});
			}
		}

		var connectionDataModels = null;

		if (connections) {
			connectionDataModels = [];

			for (var i = 0; i < connections.length; ++i) {
				connectionDataModels.push({
					source: {
						blockID: connections[i][0][0],
						connectorIndex: connections[i][0][1],
					},
					dest: {
						blockID: connections[i][1][0],
						connectorIndex: connections[i][1][1],
					},
				});
			}
		}

		var dataModel = {};

		if (blockDataModels) {
			dataModel.blocks = blockDataModels;
		}

		if (connectionDataModels) {
			dataModel.connections = connectionDataModels;
		}

 		return dataModel;
	};

	it('compute computeConnectorPos', function () {

		var mockBlock = {
			x: function () { return 10 },
			y: function () { return 15 },
		};

		distributionnetwork.computeConnectorPos(mockBlock, 0, true);
		distributionnetwork.computeConnectorPos(mockBlock, 1, true);
		distributionnetwork.computeConnectorPos(mockBlock, 2, true);
	});

	it('construct ConnectorViewModel', function () {

		var mockDataModel = {
			name: "Fooey",
		};

		new distributionnetwork.ConnectorViewModel(mockDataModel, 0, 10, 0);
		new distributionnetwork.ConnectorViewModel(mockDataModel, 0, 10, 1);
		new distributionnetwork.ConnectorViewModel(mockDataModel, 0, 10, 2);

	});

	it('ConnectorViewModel has reference to parent block', function () {

		var mockDataModel = {
			name: "Fooey",
		};
		var mockParentBlockViewModel = {};

		var testObject = new distributionnetwork.ConnectorViewModel(mockDataModel, 0, 10, mockParentBlockViewModel);

		expect(testObject.parentBlock()).toBe(mockParentBlockViewModel);
	});

		it('construct BlockViewModel with no connectors', function () {

		var mockDataModel = {
			x: 10,
			y: 12,
			name: "Woot",
		};

		new distributionnetwork.BlockViewModel(mockDataModel);
	});

	it('construct BlockViewModel with empty connectors', function () {

		var mockDataModel = {
			x: 10,
			y: 12,
			name: "Woot",
			inputConnectors: [],
			outputConnectors: [],
		};

		new distributionnetwork.BlockViewModel(mockDataModel);
	});

	it('construct BlockViewModel with connectors', function () {

		var mockInputConnector = {
		};		

		var mockOutputConnector = {
		};		

		var mockDataModel = {
			x: 10,
			y: 12,
			name: "Woot",
			inputConnectors: [
				mockInputConnector
			],
			outputConnectors: [
				mockOutputConnector
			],
		};

		new distributionnetwork.BlockViewModel(mockDataModel);
	});

	it('test name of BlockViewModel', function () {

		var mockDataModel = {
			name: "Woot",
		};

		var testObject = new distributionnetwork.BlockViewModel(mockDataModel);

		expect(testObject.name()).toBe(mockDataModel.name);
	});

	it('test name of BlockViewModel defaults to empty string', function () {

		var mockDataModel = {};

		var testObject = new distributionnetwork.BlockViewModel(mockDataModel);

		expect(testObject.name()).toBe("");
	});

	it('test block is deselected by default', function () {

		var mockDataModel = {};

		var testObject = new distributionnetwork.BlockViewModel(mockDataModel);

		expect(testObject.selected()).toBe(false);
	});

	it('test block width is set by default', function () {

		var mockDataModel = {};

		var testObject = new distributionnetwork.BlockViewModel(mockDataModel);

		expect(testObject.width() === distributionnetwork.defaultBlockWidth).toBe(true);
	});

	it('test block width is used', function () {

		var mockDataModel = {"width": 900 };

		var testObject = new distributionnetwork.BlockViewModel(mockDataModel);

		expect(testObject.width()).toBe(900);
	});

	it('test computeConnectorPos uses block width', function () {

		var mockDataModel = {
			x: function () {
				return 10
			},
			y: function () {
				return 15
			},
			"width": 900
		};

		var testObject = distributionnetwork.computeConnectorPos(mockDataModel, 1, false);

		expect(testObject.x).toBe(910);
	});

	it('test computeConnectorPos uses default block width', function () {

		var mockDataModel = {
			x: function () {
				return 10
			},
			y: function () {
				return 15
			},
		};

		var testObject = distributionnetwork.computeConnectorPos(mockDataModel, 1, false);

		expect(testObject.x).toBe(distributionnetwork.defaultBlockWidth + 10);
	});

	it('test block can be selected', function () {

		var mockDataModel = {};

		var testObject = new distributionnetwork.BlockViewModel(mockDataModel);

		testObject.select();

		expect(testObject.selected()).toBe(true);
	});

	it('test block can be deselected', function () {

		var mockDataModel = {};

		var testObject = new distributionnetwork.BlockViewModel(mockDataModel);

		testObject.select();

		testObject.deselect();

		expect(testObject.selected()).toBe(false);
	});

	it('test block can be selection can be toggled', function () {

		var mockDataModel = {};

		var testObject = new distributionnetwork.BlockViewModel(mockDataModel);

		testObject.toggleSelected();

		expect(testObject.selected()).toBe(true);

		testObject.toggleSelected();

		expect(testObject.selected()).toBe(false);
	});

	it('test can add input connector to block', function () {

		var mockDataModel = {};

		var testObject = new distributionnetwork.BlockViewModel(mockDataModel);
		var data1 = {
		};
		var data2 = {
		}
		testObject.addInputConnector(data1);
		testObject.addInputConnector(data2);

		expect(testObject.inputConnectors.length).toBe(2);
		expect(testObject.inputConnectors[0].data).toBe(data1);
		expect(testObject.inputConnectors[1].data).toBe(data2);

		expect(testObject.data.inputConnectors.length).toBe(2);
		expect(testObject.data.inputConnectors[0]).toBe(data1);
		expect(testObject.data.inputConnectors[1]).toBe(data2);
	});

	it('test can add output connector to block', function () {

		var mockDataModel = {};

		var testObject = new distributionnetwork.BlockViewModel(mockDataModel);

		var data1 = {
		};
		var data2 = {
		}
		testObject.addOutputConnector(data1);
		testObject.addOutputConnector(data2);

		expect(testObject.outputConnectors.length).toBe(2);
		expect(testObject.outputConnectors[0].data).toBe(data1);
		expect(testObject.outputConnectors[1].data).toBe(data2);

		expect(testObject.data.outputConnectors.length).toBe(2);
		expect(testObject.data.outputConnectors[0]).toBe(data1);
		expect(testObject.data.outputConnectors[1]).toBe(data2);
	});

	it('construct ChartViewModel with no blocks or connections', function () {

		var mockDataModel = {};

		new distributionnetwork.ChartViewModel(mockDataModel);

	});

	it('construct ChartViewModel with empty blocks and connections', function () {

		var mockDataModel = {
			blocks: [],
			connections: [],
		};

		new distributionnetwork.ChartViewModel(mockDataModel);

	});

	it('construct ConnectionViewModel', function () {

		var mockDataModel = {};
		var mockSourceConnector = {};
		var mockDestConnector = {};

		new distributionnetwork.ConnectionViewModel(mockDataModel, mockSourceConnector, mockDestConnector);
	});

	it('retreive source and dest coordinates', function () {

		var mockDataModel = {
		};

		var mockSourceParentBlock = {
			x: function () { return 5 },
			y: function () { return 10 },
		};

		var mockSourceConnector = {
			parentBlock: function () {
				return mockSourceParentBlock;
			},

			x: function() {
				return 5;
			},

			y: function() {
				return 15;
			},
		};

		var mockDestParentBlock = {
			x: function () { return 50 },
			y: function () { return 30 },
		};

		var mockDestConnector = {
			parentBlock: function () {
				return mockDestParentBlock;
			},

			x: function() {
				return 25;
			},

			y: function() {
				return 35;
			},
		};

		var testObject = new distributionnetwork.ConnectionViewModel(mockDataModel, mockSourceConnector, mockDestConnector);

		testObject.sourceCoord();
		expect(testObject.sourceCoordX()).toBe(10);
		expect(testObject.sourceCoordY()).toBe(25);
		testObject.sourceTangentX();
		testObject.sourceTangentY();
		
		testObject.destCoord();
		expect(testObject.destCoordX()).toBe(75);
		expect(testObject.destCoordY()).toBe(65);
		testObject.destTangentX();
		testObject.destTangentY();
	});

	it('test connection is deselected by default', function () {

		var mockDataModel = {};

		var testObject = new distributionnetwork.ConnectionViewModel(mockDataModel);

		expect(testObject.selected()).toBe(false);
	});

	it('test connection can be selected', function () {

		var mockDataModel = {};

		var testObject = new distributionnetwork.ConnectionViewModel(mockDataModel);

		testObject.select();

		expect(testObject.selected()).toBe(true);
	});

	it('test connection can be deselected', function () {

		var mockDataModel = {};

		var testObject = new distributionnetwork.ConnectionViewModel(mockDataModel);

		testObject.select();

		testObject.deselect();

		expect(testObject.selected()).toBe(false);
	});

	it('test connection can be selection can be toggled', function () {

		var mockDataModel = {};

		var testObject = new distributionnetwork.ConnectionViewModel(mockDataModel);

		testObject.toggleSelected();

		expect(testObject.selected()).toBe(true);

		testObject.toggleSelected();

		expect(testObject.selected()).toBe(false);
	});

	it('construct ChartViewModel with a block', function () {

		var mockDataModel = createMockDataModel([1]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel);
		expect(testObject.blocks.length).toBe(1);
		expect(testObject.blocks[0].data).toBe(mockDataModel.blocks[0]);

	});

	it('data model with existing connection creates a connection view model', function () {

		var mockDataModel = createMockDataModel(
			[ 5, 12 ],
			[
				[[ 5, 0 ], [ 12, 1 ]],
			]
		);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel);

		expect(testObject.connections.length).toBe(1);
		expect(testObject.connections[0].data).toBe(mockDataModel.connections[0]);
		expect(testObject.connections[0].source.data).toBe(mockDataModel.blocks[0].outputConnectors[0]);
		expect(testObject.connections[0].dest.data).toBe(mockDataModel.blocks[1].inputConnectors[1]);
	});

	it('test can add new block', function () {

		var mockDataModel = createMockDataModel();

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel);

		var blockDataModel = {};
		testObject.addBlock(blockDataModel);

		expect(testObject.blocks.length).toBe(1);
		expect(testObject.blocks[0].data).toBe(blockDataModel);

		expect(testObject.data.blocks.length).toBe(1);
		expect(testObject.data.blocks[0]).toBe(blockDataModel);
	});

	it('test can select all', function () {

		var mockDataModel = createMockDataModel([1, 2], [[[1, 0], [2, 1]]]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel);

		var block1 = testObject.blocks[0];
		var block2 = testObject.blocks[1];
		var connection = testObject.connections[0];

		testObject.selectAll();

		expect(block1.selected()).toBe(true);
		expect(block2.selected()).toBe(true);
		expect(connection.selected()).toBe(true);
	});

	it('test can deselect all blocks', function () {

		var mockDataModel = createMockDataModel([1, 2]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel);

		var block1 = testObject.blocks[0];
		var block2 = testObject.blocks[1];

		block1.select();
		block2.select();

		testObject.deselectAll();

		expect(block1.selected()).toBe(false);
		expect(block2.selected()).toBe(false);
	});

	it('test can deselect all connections', function () {

		var mockDataModel = createMockDataModel(
			[ 5, 12 ],
			[
				[[ 5, 0 ], [ 12, 1 ]],
				[[ 5, 0 ], [ 12, 1 ]],
			]
		);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel);

		var connection1 = testObject.connections[0];
		var connection2 = testObject.connections[1];

		connection1.select();
		connection2.select();

		testObject.deselectAll();

		expect(connection1.selected()).toBe(false);
		expect(connection2.selected()).toBe(false);
	});

	it('test mouse down deselects blocks other than the one clicked', function () {

		var mockDataModel = createMockDataModel([ 1, 2, 3 ]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel);

		var block1 = testObject.blocks[0];
		var block2 = testObject.blocks[1];
		var block3 = testObject.blocks[2];

		// Fake out the blocks as selected.
		block1.select();
		block2.select();
		block3.select();

		testObject.handleBlockClicked(block2); // Doesn't matter which block is actually clicked.

		expect(block1.selected()).toBe(false);
		expect(block2.selected()).toBe(true);
		expect(block3.selected()).toBe(false);
	});

	it('test mouse down selects the clicked block', function () {

		var mockDataModel = createMockDataModel([ 1, 2, 3 ]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel);
		
		var block1 = testObject.blocks[0];
		var block2 = testObject.blocks[1];
		var block3 = testObject.blocks[2];

		testObject.handleBlockClicked(block3); // Doesn't matter which block is actually clicked.

		expect(block1.selected()).toBe(false);
		expect(block2.selected()).toBe(false);
		expect(block3.selected()).toBe(true);
	});

	it('test mouse down brings block to front', function () {

		var mockDataModel = createMockDataModel([ 1, 2 ]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel);

		var block1 = testObject.blocks[0];
		var block2 = testObject.blocks[1];

		testObject.handleBlockClicked(block1);

		expect(testObject.blocks[0]).toBe(block2); // Mock block 2 should be bought to front.
		expect(testObject.blocks[1]).toBe(block1);
	});

	it('test control + mouse down toggles block selection', function () {

		var mockDataModel = createMockDataModel([ 1, 2, 3 ]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel);

		var block1 = testObject.blocks[0];
		var block2 = testObject.blocks[1];
		var block3 = testObject.blocks[2];

		block1.select(); // Mark block 1 as already selected.

		testObject.handleBlockClicked(block2, true);

		expect(block1.selected()).toBe(true);  // This block remains selected.
		expect(block2.selected()).toBe(true);  // This block is being toggled.
		expect(block3.selected()).toBe(false); // This block remains unselected.

		testObject.handleBlockClicked(block2, true);

		expect(block1.selected()).toBe(true);  // This block remains selected.
		expect(block2.selected()).toBe(false); // This block is being toggled.
		expect(block3.selected()).toBe(false); // This block remains unselected.

		testObject.handleBlockClicked(block2, true);

		expect(block1.selected()).toBe(true);  // This block remains selected.
		expect(block2.selected()).toBe(true);  // This block is being toggled.
		expect(block3.selected()).toBe(false); // This block remains unselected.
	});

	it('test mouse down deselects connections other than the one clicked', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2, 3 ],
			[
				[[ 1, 0 ], [ 3, 0 ]],
				[[ 2, 1 ], [ 3, 2 ]],
				[[ 1, 2 ], [ 3, 0 ]]
			]
		);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel);

		var connection1 = testObject.connections[0];
		var connection2 = testObject.connections[1];
		var connection3 = testObject.connections[2];

		// Fake out the connections as selected.
		connection1.select();
		connection2.select();
		connection3.select();

		testObject.handleConnectionMouseDown(connection2);

		expect(connection1.selected()).toBe(false);
		expect(connection2.selected()).toBe(true);
		expect(connection3.selected()).toBe(false);
	});

	it('test block mouse down selects the clicked connection', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2, 3 ],
			[
				[[ 1, 0 ], [ 3, 0 ]],
				[[ 2, 1 ], [ 3, 2 ]],
				[[ 1, 2 ], [ 3, 0 ]]
			]
		);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel);
		
		var connection1 = testObject.connections[0];
		var connection2 = testObject.connections[1];
		var connection3 = testObject.connections[2];

		testObject.handleConnectionMouseDown(connection3);

		expect(connection1.selected()).toBe(false);
		expect(connection2.selected()).toBe(false);
		expect(connection3.selected()).toBe(true);
	});	

	it('test control + mouse down toggles connection selection', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2, 3 ],
			[
				[[ 1, 0 ], [ 3, 0 ]],
				[[ 2, 1 ], [ 3, 2 ]],
				[[ 1, 2 ], [ 3, 0 ]]
			]
		);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel);

		var connection1 = testObject.connections[0];
		var connection2 = testObject.connections[1];
		var connection3 = testObject.connections[2];

		connection1.select(); // Mark connection 1 as already selected.

		testObject.handleConnectionMouseDown(connection2, true);

		expect(connection1.selected()).toBe(true);  // This connection remains selected.
		expect(connection2.selected()).toBe(true);  // This connection is being toggle.
		expect(connection3.selected()).toBe(false); // This connection remains unselected.

		testObject.handleConnectionMouseDown(connection2, true);

		expect(connection1.selected()).toBe(true);  // This connection remains selected.
		expect(connection2.selected()).toBe(false); // This connection is being toggle.
		expect(connection3.selected()).toBe(false); // This connection remains unselected.

		testObject.handleConnectionMouseDown(connection2, true);

		expect(connection1.selected()).toBe(true);  // This connection remains selected.
		expect(connection2.selected()).toBe(true);  // This connection is being toggle.
		expect(connection3.selected()).toBe(false); // This connection remains unselected.
	});

 	it('test data-model is wrapped in view-model', function () {

		var mockDataModel = createMockDataModel([ 1, 2 ], [[[1, 0], [2, 0]]]);
		var mockBlock = mockDataModel.blocks[0];
		var mockInputConnector = mockBlock.inputConnectors[0];
		var mockOutputConnector = mockBlock.outputConnectors[0];

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 

		// Chart

		expect(testObject).toBeDefined();
		expect(testObject).toNotBe(mockDataModel);
		expect(testObject.data).toBe(mockDataModel);
		expect(testObject.blocks).toBeDefined();
		expect(testObject.blocks.length).toBe(2);

		// Block

		var block = testObject.blocks[0];

		expect(block).toNotBe(mockBlock);
		expect(block.data).toBe(mockBlock);

		// Connectors

		expect(block.inputConnectors.length).toBe(3);
		expect(block.inputConnectors[0].data).toBe(mockInputConnector);

		expect(block.outputConnectors.length).toBe(3);		
		expect(block.outputConnectors[0].data).toBe(mockOutputConnector);

		// Connection
 	
		expect(testObject.connections.length).toBe(1);
		expect(testObject.connections[0].source).toBe(testObject.blocks[0].outputConnectors[0]);
		expect(testObject.connections[0].dest).toBe(testObject.blocks[1].inputConnectors[0]);
 	});

	it('test can delete 1st selected block', function () {

		var mockDataModel = createMockDataModel([ 1, 2 ]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 

		expect(testObject.blocks.length).toBe(2);

		testObject.blocks[0].select();

		var mockBlock2 = mockDataModel.blocks[1];

		testObject.deleteSelected();

		expect(testObject.blocks.length).toBe(1);
		expect(mockDataModel.blocks.length).toBe(1);
		expect(testObject.blocks[0].data).toBe(mockBlock2);
	});

	it('test can delete 2nd selected blocks', function () {

		var mockDataModel = createMockDataModel([ 1, 2 ]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 

		expect(testObject.blocks.length).toBe(2);

		testObject.blocks[1].select();

		var mockBlock1 = mockDataModel.blocks[0];

		testObject.deleteSelected();

		expect(testObject.blocks.length).toBe(1);
		expect(mockDataModel.blocks.length).toBe(1);
		expect(testObject.blocks[0].data).toBe(mockBlock1);
	});

	it('test can delete multiple selected blocks', function () {

		var mockDataModel = createMockDataModel([ 1, 2, 3, 4 ]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 

		expect(testObject.blocks.length).toBe(4);

		testObject.blocks[1].select();
		testObject.blocks[2].select();

		var mockBlock1 = mockDataModel.blocks[0];
		var mockBlock4 = mockDataModel.blocks[3];

		testObject.deleteSelected();

		expect(testObject.blocks.length).toBe(2);
		expect(mockDataModel.blocks.length).toBe(2);
		expect(testObject.blocks[0].data).toBe(mockBlock1);
		expect(testObject.blocks[1].data).toBe(mockBlock4);
	});
	
	it('deleting a block also deletes its connections', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2, 3 ],
			[
				[[ 1, 0 ], [ 2, 0 ]],
				[[ 2, 0 ], [ 3, 0 ]],
			]
		);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 

		expect(testObject.connections.length).toBe(2);

		// Select the middle block.
		testObject.blocks[1].select();

		testObject.deleteSelected();

		expect(testObject.connections.length).toBe(0);
	});

	it('deleting a block doesnt delete other connections', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2, 3 ],
			[
				[[ 1, 0 ], [ 3, 0 ],]
			]
		);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 

		expect(testObject.connections.length).toBe(1);

		// Select the middle block.
		testObject.blocks[1].select();

		testObject.deleteSelected();

		expect(testObject.connections.length).toBe(1);
	});

	it('test can delete 1st selected connection', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2 ],
			[
				[[ 1, 0 ], [ 2, 0 ]],
				[[ 2, 1 ], [ 1, 2 ]]
			]
		);

		var mockRemainingConnectionDataModel = mockDataModel.connections[1];

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 

		expect(testObject.connections.length).toBe(2);

		testObject.connections[0].select();

		testObject.deleteSelected();

		expect(testObject.connections.length).toBe(1);
		expect(mockDataModel.connections.length).toBe(1);
		expect(testObject.connections[0].data).toBe(mockRemainingConnectionDataModel);
	});

	it('test can delete 2nd selected connection', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2 ],
			[
				[[ 1, 0 ], [ 2, 0 ]],
				[[ 2, 1 ], [ 1, 2 ]]
			]
		);

		var mockRemainingConnectionDataModel = mockDataModel.connections[0];

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 

		expect(testObject.connections.length).toBe(2);

		testObject.connections[1].select();

		testObject.deleteSelected();

		expect(testObject.connections.length).toBe(1);
		expect(mockDataModel.connections.length).toBe(1);
		expect(testObject.connections[0].data).toBe(mockRemainingConnectionDataModel);
	});


	it('test can delete multiple selected connections', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2, 3 ],
			[
				[[ 1, 0 ], [ 2, 0 ]],
				[[ 2, 1 ], [ 1, 2 ]],
				[[ 1, 1 ], [ 3, 0 ]],
				[[ 3, 2 ], [ 2, 1 ]]
			]
		);

		var mockRemainingConnectionDataModel1 = mockDataModel.connections[0];
		var mockRemainingConnectionDataModel2 = mockDataModel.connections[3];

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 

		expect(testObject.connections.length).toBe(4);

		testObject.connections[1].select();
		testObject.connections[2].select();

		testObject.deleteSelected();

		expect(testObject.connections.length).toBe(2);
		expect(mockDataModel.connections.length).toBe(2);
		expect(testObject.connections[0].data).toBe(mockRemainingConnectionDataModel1);
		expect(testObject.connections[1].data).toBe(mockRemainingConnectionDataModel2);
	});

	it('can select blocks via selection rect', function () {

		var mockDataModel = createMockDataModel([ 1, 2, 3 ]);
		mockDataModel.blocks[0].x = 0;
		mockDataModel.blocks[0].y = 0;
		mockDataModel.blocks[1].x = 1020;
		mockDataModel.blocks[1].y = 1020;
		mockDataModel.blocks[2].x = 3000;
		mockDataModel.blocks[2].y = 3000;

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 

		testObject.blocks[0].select(); // Select a blocks, to ensure it is correctly deselected.

		testObject.applySelectionRect({ x: 1000, y: 1000, width: 1000, height: 1000 });

		expect(testObject.blocks[0].selected()).toBe(false);
		expect(testObject.blocks[1].selected()).toBe(true);
		expect(testObject.blocks[2].selected()).toBe(false);
	});

	it('can select connections via selection rect', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2, 3, 4 ],
			[
				[[ 1, 0 ], [ 2, 0 ]],
				[[ 2, 1 ], [ 3, 2 ]],
				[[ 3, 2 ], [ 4, 1 ]]
			]
		);
		mockDataModel.blocks[0].x = 0;
		mockDataModel.blocks[0].y = 0;
		mockDataModel.blocks[1].x = 1020;
		mockDataModel.blocks[1].y = 1020;
		mockDataModel.blocks[2].x = 1500;
		mockDataModel.blocks[2].y = 1500;
		mockDataModel.blocks[3].x = 3000;
		mockDataModel.blocks[3].y = 3000;

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 

		testObject.connections[0].select(); // Select a connection, to ensure it is correctly deselected.

		testObject.applySelectionRect({ x: 1000, y: 1000, width: 1000, height: 1000 });

		expect(testObject.connections[0].selected()).toBe(false);
		expect(testObject.connections[1].selected()).toBe(true);
		expect(testObject.connections[2].selected()).toBe(false);
	});

	it('test update selected blocks location', function () {
		var mockDataModel = createMockDataModel([1]);
		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 

		var block = testObject.blocks[0];
		block.select();

		var xInc = 5;
		var yInc = 15;

		testObject.updateSelectedBlocksLocation(xInc, yInc);

		expect(block.x()).toBe(xInc);
		expect(block.y()).toBe(yInc);
	});

	it('test update selected blocks location, ignores unselected blocks', function () {
		var mockDataModel = createMockDataModel([1]);
		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 

		var block = testObject.blocks[0];

		var xInc = 5;
		var yInc = 15;

		testObject.updateSelectedBlocksLocation(xInc, yInc);

		expect(block.x()).toBe(0);
		expect(block.y()).toBe(0);
	});

	it('test find block throws when there are no blocks', function () {
		var mockDataModel = createMockDataModel();

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		expect(function () { testObject.findBlock(150); }).toThrow();
	});

	it('test find block throws when block is not found', function () {
		var mockDataModel = createMockDataModel([5, 25, 15, 30]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		expect(function () { testObject.findBlock(150); }).toThrow();
	});

	it('test find block retreives correct block', function () {
		var mockDataModel = createMockDataModel([5, 25, 15, 30]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		expect(testObject.findBlock(15)).toBe(testObject.blocks[2]);
	});

	it('test find input connector throws when there are no blocks', function () {
		var mockDataModel = createMockDataModel();

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		expect(function () { testObject.findInputConnector(150, 1); }).toThrow();
	});

	it('test find input connector throws when the block is not found', function () {
		var mockDataModel = createMockDataModel([ 1, 2, 3]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		expect(function () { testObject.findInputConnector(150, 1); }).toThrow();
	});

	it('test find input connector throws when there are no connectors', function () {
		var mockDataModel = createMockDataModel([ 1 ]);

		mockDataModel.blocks[0].inputConnectors = [];

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		expect(function () { testObject.findInputConnector(1, 1); }).toThrow();
	});

	it('test find input connector throws when connector is not found', function () {
		var mockDataModel = createMockDataModel([5]);

		mockDataModel.blocks[0].inputConnectors = [ 
			{} // Only 1 input connector.
		];

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		expect(function () { testObject.findInputConnector(5, 1); }).toThrow();
	});

	it('test find input connector retreives correct connector', function () {
		var mockDataModel = createMockDataModel([5, 25, 15, 30]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		expect(testObject.findInputConnector(15, 1)).toBe(testObject.blocks[2].inputConnectors[1]);
	});

	it('test find output connector throws when there are no blocks', function () {
		var mockDataModel = createMockDataModel();

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		expect(function () { testObject.findOutputConnector(150, 1); }).toThrow();
	});

	it('test find output connector throws when the block is not found', function () {
		var mockDataModel = createMockDataModel([ 1, 2, 3]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		expect(function () { testObject.findOutputConnector(150, 1); }).toThrow();
	});

	it('test find output connector throws when there are no connectors', function () {
		var mockDataModel = createMockDataModel([ 1 ]);

		mockDataModel.blocks[0].outputConnectors = [];

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		expect(function () { testObject.findOutputConnector(1, 1); }).toThrow();
	});

	it('test find output connector throws when connector is not found', function () {
		var mockDataModel = createMockDataModel([5]);

		mockDataModel.blocks[0].outputConnectors = [ 
			{} // Only 1 input connector.
		];

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		expect(function () { testObject.findOutputConnector(5, 1); }).toThrow();
	});

	it('test find output connector retreives correct connector', function () {
		var mockDataModel = createMockDataModel([5, 25, 15, 30]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		expect(testObject.findOutputConnector(15, 1)).toBe(testObject.blocks[2].outputConnectors[1]);
	});


	it('test create new connection', function () {

		var mockDataModel = createMockDataModel([5, 25]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		var startConnector = testObject.blocks[0].outputConnectors[0];
		var endConnector = testObject.blocks[1].inputConnectors[1];

		testObject.createNewConnection(startConnector, endConnector);

		expect(testObject.connections.length).toBe(1);
		var connection = testObject.connections[0];
		expect(connection.source).toBe(startConnector);
		expect(connection.dest).toBe(endConnector);

		expect(testObject.data.connections.length).toBe(1);
		var connectionData = testObject.data.connections[0];
		expect(connection.data).toBe(connectionData);

		expect(connectionData.source.blockID).toBe(5);
		expect(connectionData.source.connectorIndex).toBe(0);
		expect(connectionData.dest.blockID).toBe(25);
		expect(connectionData.dest.connectorIndex).toBe(1);
	});

	it('test create new connection from input to output', function () {

		var mockDataModel = createMockDataModel([5, 25]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel);

		var startConnector = testObject.blocks[1].inputConnectors[1];
		var endConnector = testObject.blocks[0].outputConnectors[0];

		testObject.createNewConnection(startConnector, endConnector);

		expect(testObject.connections.length).toBe(1);
		var connection = testObject.connections[0];
		expect(connection.source).toBe(endConnector);
		expect(connection.dest).toBe(startConnector);

		expect(testObject.data.connections.length).toBe(1);
		var connectionData = testObject.data.connections[0];
		expect(connection.data).toBe(connectionData);

		expect(connectionData.source.blockID).toBe(5);
		expect(connectionData.source.connectorIndex).toBe(0);
		expect(connectionData.dest.blockID).toBe(25);
		expect(connectionData.dest.connectorIndex).toBe(1);
	});

	it('test get selected blocks results in empty array when there are no blocks', function () {

		var mockDataModel = createMockDataModel();

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		var selectedBlocks = testObject.getSelectedBlocks();

		expect(selectedBlocks.length).toBe(0);
	});

	it('test get selected blocks results in empty array when none selected', function () {

		var mockDataModel = createMockDataModel([1, 2, 3, 4]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		var selectedBlocks = testObject.getSelectedBlocks();

		expect(selectedBlocks.length).toBe(0);
	});

	it('test can get selected blocks', function () {

		var mockDataModel = createMockDataModel([1, 2, 3, 4]);

		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		var block1 = testObject.blocks[0];
		var block2 = testObject.blocks[1];
		var block3 = testObject.blocks[2];
		var block4 = testObject.blocks[3];

		block2.select();
		block3.select();

		var selectedBlocks = testObject.getSelectedBlocks();

		expect(selectedBlocks.length).toBe(2);
		expect(selectedBlocks[0]).toBe(block2);
		expect(selectedBlocks[1]).toBe(block3);	
	});

	it('test can get selected connections', function () {

		var mockDataModel = createMockDataModel(
			[ 1, 2, 3 ],
			[
				[[ 1, 0 ], [ 2, 0 ]],
				[[ 2, 1 ], [ 1, 2 ]],
				[[ 1, 1 ], [ 3, 0 ]],
				[[ 3, 2 ], [ 2, 1 ]]
			]
		);
		var testObject = new distributionnetwork.ChartViewModel(mockDataModel); 		

		var connection1 = testObject.connections[0];
		var connection2 = testObject.connections[1];
		var connection3 = testObject.connections[2];
		var connection4 = testObject.connections[3];

		connection2.select();
		connection3.select();

		var selectedConnections = testObject.getSelectedConnections();

		expect(selectedConnections.length).toBe(2);
		expect(selectedConnections[0]).toBe(connection2);
		expect(selectedConnections[1]).toBe(connection3);	
	});
});
