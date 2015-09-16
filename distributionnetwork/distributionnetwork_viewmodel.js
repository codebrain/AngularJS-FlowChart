
//
// Global accessor.
//
var distributionnetwork = {};

// Module.
(function () {

	//
	// Width of a block.
	//
	distributionnetwork.defaultBlockWidth = 250;

	//
	// Amount of space reserved for displaying the block's name.
	//
	distributionnetwork.blockNameHeight = 40;

	//
	// Height of a connector in a block.
	//
	distributionnetwork.connectorHeight = 35;

	//
	// Compute the Y coordinate of a connector, given its index.
	//
	distributionnetwork.computeConnectorY = function (connectorIndex) {
		return distributionnetwork.blockNameHeight + (connectorIndex * distributionnetwork.connectorHeight);
	}

	//
	// Compute the position of a connector in the graph.
	//
	distributionnetwork.computeConnectorPos = function (block, connectorIndex, inputConnector) {
		return {
			x: block.x() + (inputConnector ? 0 : block.width() ? block.width() : distributionnetwork.defaultBlockWidth),
			y: block.y() + distributionnetwork.computeConnectorY(connectorIndex),
		};
	};

	//
	// View model for a connector.
	//
	distributionnetwork.ConnectorViewModel = function (connectorDataModel, x, y, parentBlock) {

		this.data = connectorDataModel;
		this._parentBlock = parentBlock;
		this._x = x;
		this._y = y;

		//
		// X coordinate of the connector.
		//
		this.x = function () {
			return this._x;
		};

		//
		// Y coordinate of the connector.
		//
		this.y = function () { 
			return this._y;
		};

		//
		// The parent block that the connector is attached to.
		//
		this.parentBlock = function () {
			return this._parentBlock;
		};
	};

	//
	// Create view model for a list of data models.
	//
	var createConnectorsViewModel = function (connectorDataModels, x, parentBlock) {
		var viewModels = [];

		if (connectorDataModels) {
			for (var i = 0; i < connectorDataModels.length; ++i) {
				var connectorViewModel = 
					new distributionnetwork.ConnectorViewModel(connectorDataModels[i], x, distributionnetwork.computeConnectorY(i), parentBlock);
				viewModels.push(connectorViewModel);
			}
		}

		return viewModels;
	};

	//
	// View model for a block.
	//
	distributionnetwork.BlockViewModel = function (blockDataModel) {

		this.data = blockDataModel;

		// set the default width value of the block
		if (!this.data.width || this.data.width < 0) {
			this.data.width = distributionnetwork.defaultBlockWidth;
		}
		this.inputConnectors = createConnectorsViewModel(this.data.inputConnectors, 0, this);
		this.outputConnectors = createConnectorsViewModel(this.data.outputConnectors, this.data.width, this);

		// Set to true when the block is selected.
		this._selected = false;

		//
		// Name of the block.
		//
		this.name = function () {
			return this.data.name || "";
		};

		//
		// X coordinate of the block.
		//
		this.x = function () { 
			return this.data.x;
		};

		//
		// Y coordinate of the block.
		//
		this.y = function () {
			return this.data.y;
		};

		//
		// Width of the block.
		//
		this.width = function () {
			return this.data.width;
		}

		//
		// Height of the block.
		//
		this.height = function () {
			var numConnectors =
				Math.max(
					this.inputConnectors.length, 
					this.outputConnectors.length);
			return distributionnetwork.computeConnectorY(numConnectors);
		}

		//
		// Select the block.
		//
		this.select = function () {
			this._selected = true;
		};

		//
		// Deselect the block.
		//
		this.deselect = function () {
			this._selected = false;
		};

		//
		// Toggle the selection state of the block.
		//
		this.toggleSelected = function () {
			this._selected = !this._selected;
		};

		//
		// Returns true if the block is selected.
		//
		this.selected = function () {
			return this._selected;
		};

		//
		// Internal function to add a connector.
		this._addConnector = function (connectorDataModel, x, connectorsDataModel, connectorsViewModel) {
			var connectorViewModel = 
				new distributionnetwork.ConnectorViewModel(connectorDataModel, x, 
						distributionnetwork.computeConnectorY(connectorsViewModel.length), this);

			connectorsDataModel.push(connectorDataModel);

			// Add to block's view model.
			connectorsViewModel.push(connectorViewModel);
		}

		//
		// Add an input connector to the block.
		//
		this.addInputConnector = function (connectorDataModel) {

			if (!this.data.inputConnectors) {
				this.data.inputConnectors = [];
			}
			this._addConnector(connectorDataModel, 0, this.data.inputConnectors, this.inputConnectors);
		};

		//
		// Add an ouput connector to the block.
		//
		this.addOutputConnector = function (connectorDataModel) {

			if (!this.data.outputConnectors) {
				this.data.outputConnectors = [];
			}
			this._addConnector(connectorDataModel, this.data.width, this.data.outputConnectors, this.outputConnectors);
		};
	};

	// 
	// Wrap the blocks data-model in a view-model.
	//
	var createBlocksViewModel = function (blocksDataModel) {
		var blocksViewModel = [];

		if (blocksDataModel) {
			for (var i = 0; i < blocksDataModel.length; ++i) {
				blocksViewModel.push(new distributionnetwork.BlockViewModel(blocksDataModel[i]));
			}
		}

		return blocksViewModel;
	};

	//
	// View model for a connection.
	//
	distributionnetwork.ConnectionViewModel = function (connectionDataModel, sourceConnector, destConnector) {

		this.data = connectionDataModel;
		this.source = sourceConnector;
		this.dest = destConnector;

		// Set to true when the connection is selected.
		this._selected = false;

		this.sourceCoordX = function () { 
			return this.source.parentBlock().x() + this.source.x();
		};

		this.sourceCoordY = function () { 
			return this.source.parentBlock().y() + this.source.y();
		};

		this.sourceCoord = function () {
			return {
				x: this.sourceCoordX(),
				y: this.sourceCoordY()
			};
		}

		this.sourceTangentX = function () { 
			return distributionnetwork.computeConnectionSourceTangentX(this.sourceCoord(), this.destCoord());
		};

		this.sourceTangentY = function () { 
			return distributionnetwork.computeConnectionSourceTangentY(this.sourceCoord(), this.destCoord());
		};

		this.destCoordX = function () { 
			return this.dest.parentBlock().x() + this.dest.x();
		};

		this.destCoordY = function () { 
			return this.dest.parentBlock().y() + this.dest.y();
		};

		this.destCoord = function () {
			return {
				x: this.destCoordX(),
				y: this.destCoordY()
			};
		}

		this.destTangentX = function () { 
			return distributionnetwork.computeConnectionDestTangentX(this.sourceCoord(), this.destCoord());
		};

		this.destTangentY = function () { 
			return distributionnetwork.computeConnectionDestTangentY(this.sourceCoord(), this.destCoord());
		};

		this.middleX = function(scale) {
			if(typeof(scale)=="undefined")
				scale = 0.5;
			return this.sourceCoordX()*(1-scale)+this.destCoordX()*scale;
		};

		this.middleY = function(scale) {
			if(typeof(scale)=="undefined")
				scale = 0.5;
			return this.sourceCoordY()*(1-scale)+this.destCoordY()*scale;
		};


		//
		// Select the connection.
		//
		this.select = function () {
			this._selected = true;
		};

		//
		// Deselect the connection.
		//
		this.deselect = function () {
			this._selected = false;
		};

		//
		// Toggle the selection state of the connection.
		//
		this.toggleSelected = function () {
			this._selected = !this._selected;
		};

		//
		// Returns true if the connection is selected.
		//
		this.selected = function () {
			return this._selected;
		};
	};

	//
	// Helper function.
	//
	var computeConnectionTangentOffset = function (pt1, pt2) {

		return (pt2.x - pt1.x) / 2;	
	}

	//
	// Compute the tangent for the bezier curve.
	//
	distributionnetwork.computeConnectionSourceTangentX = function (pt1, pt2) {

		return pt1.x + computeConnectionTangentOffset(pt1, pt2);
	};

	//
	// Compute the tangent for the bezier curve.
	//
	distributionnetwork.computeConnectionSourceTangentY = function (pt1, pt2) {

		return pt1.y;
	};

	//
	// Compute the tangent for the bezier curve.
	//
	distributionnetwork.computeConnectionSourceTangent = function(pt1, pt2) {
		return {
			x: distributionnetwork.computeConnectionSourceTangentX(pt1, pt2),
			y: distributionnetwork.computeConnectionSourceTangentY(pt1, pt2),
		};
	};

	//
	// Compute the tangent for the bezier curve.
	//
	distributionnetwork.computeConnectionDestTangentX = function (pt1, pt2) {

		return pt2.x - computeConnectionTangentOffset(pt1, pt2);
	};

	//
	// Compute the tangent for the bezier curve.
	//
	distributionnetwork.computeConnectionDestTangentY = function (pt1, pt2) {

		return pt2.y;
	};

	//
	// Compute the tangent for the bezier curve.
	//
	distributionnetwork.computeConnectionDestTangent = function(pt1, pt2) {
		return {
			x: distributionnetwork.computeConnectionDestTangentX(pt1, pt2),
			y: distributionnetwork.computeConnectionDestTangentY(pt1, pt2),
		};
	};

	//
	// View model for the network.
	//
	distributionnetwork.ChartViewModel = function (networkDataModel) {

		//
		// Find a specific block within the network.
		//
		this.findBlock = function (blockID) {

			for (var i = 0; i < this.blocks.length; ++i) {
				var block = this.blocks[i];
				if (block.data.id == blockID) {
					return block;
				}
			}

			throw new Error("Failed to find block " + blockID);
		};

		//
		// Find a specific input connector within the network.
		//
		this.findInputConnector = function (blockID, connectorIndex) {

			var block = this.findBlock(blockID);

			if (!block.inputConnectors || block.inputConnectors.length <= connectorIndex) {
				throw new Error("Block " + blockID + " has invalid input connectors.");
			}

			return block.inputConnectors[connectorIndex];
		};

		//
		// Find a specific output connector within the network.
		//
		this.findOutputConnector = function (blockID, connectorIndex) {

			var block = this.findBlock(blockID);

			if (!block.outputConnectors || block.outputConnectors.length <= connectorIndex) {
				throw new Error("Block " + blockID + " has invalid output connectors.");
			}

			return block.outputConnectors[connectorIndex];
		};

		//
		// Create a view model for connection from the data model.
		//
		this._createConnectionViewModel = function(connectionDataModel) {

			var sourceConnector = this.findOutputConnector(connectionDataModel.source.blockID, connectionDataModel.source.connectorIndex);
			var destConnector = this.findInputConnector(connectionDataModel.dest.blockID, connectionDataModel.dest.connectorIndex);			
			return new distributionnetwork.ConnectionViewModel(connectionDataModel, sourceConnector, destConnector);
		}

		// 
		// Wrap the connections data-model in a view-model.
		//
		this._createConnectionsViewModel = function (connectionsDataModel) {

			var connectionsViewModel = [];

			if (connectionsDataModel) {
				for (var i = 0; i < connectionsDataModel.length; ++i) {
					connectionsViewModel.push(this._createConnectionViewModel(connectionsDataModel[i]));
				}
			}

			return connectionsViewModel;
		};

		// Reference to the underlying data.
		this.data = networkDataModel;

		// Create a view-model for blocks.
		this.blocks = createBlocksViewModel(this.data.blocks);

		// Create a view-model for connections.
		this.connections = this._createConnectionsViewModel(this.data.connections);

		//
		// Create a view model for a new connection.
		//
		this.createNewConnection = function (startConnector, endConnector) {

			var connectionsDataModel = this.data.connections;
			if (!connectionsDataModel) {
				connectionsDataModel = this.data.connections = [];
			}

			var connectionsViewModel = this.connections;
			if (!connectionsViewModel) {
				connectionsViewModel = this.connections = [];
			}

			var startBlock = startConnector.parentBlock();
			var startConnectorIndex = startBlock.outputConnectors.indexOf(startConnector);
			var startConnectorType = 'output';
			if (startConnectorIndex == -1) {
				startConnectorIndex = startBlock.inputConnectors.indexOf(startConnector);
				startConnectorType = 'input';
				if (startConnectorIndex == -1) {
					throw new Error("Failed to find source connector within either inputConnectors or outputConnectors of source block.");
				}
			}

			var endBlock = endConnector.parentBlock();
			var endConnectorIndex = endBlock.inputConnectors.indexOf(endConnector);
			var endConnectorType = 'input';
			if (endConnectorIndex == -1) {
				endConnectorIndex = endBlock.outputConnectors.indexOf(endConnector);
				endConnectorType = 'output';
				if (endConnectorIndex == -1) {
					throw new Error("Failed to find dest connector within inputConnectors or outputConnectors of dest block.");
				}
			}

			if (startConnectorType == endConnectorType) {
				throw new Error("Failed to create connection. Only output to input connections are allowed.")
			}

			if (startBlock == endBlock) {
				throw new Error("Failed to create connection. Cannot link a block with itself.")
			}

			var startBlock = {
				blockID: startBlock.data.id,
				connectorIndex: startConnectorIndex,
			}

			var endBlock = {
				blockID: endBlock.data.id,
				connectorIndex: endConnectorIndex,
			}

			var connectionDataModel = {
				source: startConnectorType == 'output' ? startBlock : endBlock,
				dest: startConnectorType == 'output' ? endBlock : startBlock,
			};
			connectionsDataModel.push(connectionDataModel);

			var outputConnector = startConnectorType == 'output' ? startConnector : endConnector;
			var inputConnector = startConnectorType == 'output' ? endConnector : startConnector;

			var connectionViewModel = new distributionnetwork.ConnectionViewModel(connectionDataModel, outputConnector, inputConnector);
			connectionsViewModel.push(connectionViewModel);
		};

		//
		// Add a block to the view model.
		//
		this.addBlock = function (blockDataModel) {
			if (!this.data.blocks) {
				this.data.blocks = [];
			}

			// 
			// Update the data model.
			//
			this.data.blocks.push(blockDataModel);

			// 
			// Update the view model.
			//
			this.blocks.push(new distributionnetwork.BlockViewModel(blockDataModel));		
		}

		//
		// Select all blocks and connections in the network.
		//
		this.selectAll = function () {

			var blocks = this.blocks;
			for (var i = 0; i < blocks.length; ++i) {
				var block = blocks[i];
				block.select();
			}

			var connections = this.connections;
			for (var i = 0; i < connections.length; ++i) {
				var connection = connections[i];
				connection.select();
			}			
		}

		//
		// Deselect all blocks and connections in the network.
		//
		this.deselectAll = function () {

			var blocks = this.blocks;
			for (var i = 0; i < blocks.length; ++i) {
				var block = blocks[i];
				block.deselect();
			}

			var connections = this.connections;
			for (var i = 0; i < connections.length; ++i) {
				var connection = connections[i];
				connection.deselect();
			}
		};

		//
		// Update the location of the block and its connectors.
		//
		this.updateSelectedBlocksLocation = function (deltaX, deltaY) {

			var selectedBlocks = this.getSelectedBlocks();

			for (var i = 0; i < selectedBlocks.length; ++i) {
				var block = selectedBlocks[i];
				block.data.x += deltaX;
				block.data.y += deltaY;
			}
		};

		//
		// Handle mouse click on a particular block.
		//
		this.handleBlockClicked = function (block, ctrlKey) {

			if (ctrlKey) {
				block.toggleSelected();
			}
			else {
				this.deselectAll();
				block.select();
			}

			// Move block to the end of the list so it is rendered after all the other.
			// This is the way Z-order is done in SVG.

			var blockIndex = this.blocks.indexOf(block);
			if (blockIndex == -1) {
				throw new Error("Failed to find block in view model!");
			}
			this.blocks.splice(blockIndex, 1);
			this.blocks.push(block);			
		};

		//
		// Handle mouse down on a connection.
		//
		this.handleConnectionMouseDown = function (connection, ctrlKey) {

			if (ctrlKey) {
				connection.toggleSelected();
			}
			else {
				this.deselectAll();
				connection.select();
			}
		};

		//
		// Delete all blocks and connections that are selected.
		//
		this.deleteSelected = function () {

			var newBlockViewModels = [];
			var newBlockDataModels = [];

			var deletedBlockIds = [];

			//
			// Sort blocks into:
			//		blocks to keep and 
			//		blocks to delete.
			//

			for (var blockIndex = 0; blockIndex < this.blocks.length; ++blockIndex) {

				var block = this.blocks[blockIndex];
				if (!block.selected()) {
					// Only retain non-selected blocks.
					newBlockViewModels.push(block);
					newBlockDataModels.push(block.data);
				}
				else {
					// Keep track of blocks that were deleted, so their connections can also
					// be deleted.
					deletedBlockIds.push(block.data.id);
				}
			}

			var newConnectionViewModels = [];
			var newConnectionDataModels = [];

			//
			// Remove connections that are selected.
			// Also remove connections for blocks that have been deleted.
			//
			for (var connectionIndex = 0; connectionIndex < this.connections.length; ++connectionIndex) {

				var connection = this.connections[connectionIndex];				
				if (!connection.selected() &&
					deletedBlockIds.indexOf(connection.data.source.blockID) === -1 &&
					deletedBlockIds.indexOf(connection.data.dest.blockID) === -1)
				{
					//
					// The blocks this connection is attached to, where not deleted,
					// so keep the connection.
					//
					newConnectionViewModels.push(connection);
					newConnectionDataModels.push(connection.data);
				}
			}

			//
			// Update blocks and connections.
			//
			this.blocks = newBlockViewModels;
			this.data.blocks = newBlockDataModels;
			this.connections = newConnectionViewModels;
			this.data.connections = newConnectionDataModels;
		};

		//
		// Select blocks and connections that fall within the selection rect.
		//
		this.applySelectionRect = function (selectionRect) {

			this.deselectAll();

			for (var i = 0; i < this.blocks.length; ++i) {
				var block = this.blocks[i];
				if (block.x() >= selectionRect.x && 
					block.y() >= selectionRect.y && 
					block.x() + block.width() <= selectionRect.x + selectionRect.width &&
					block.y() + block.height() <= selectionRect.y + selectionRect.height)
				{
					// Select blocks that are within the selection rect.
					block.select();
				}
			}

			for (var i = 0; i < this.connections.length; ++i) {
				var connection = this.connections[i];
				if (connection.source.parentBlock().selected() &&
					connection.dest.parentBlock().selected())
				{
					// Select the connection if both its parent blocks are selected.
					connection.select();
				}
			}

		};

		//
		// Get the array of blocks that are currently selected.
		//
		this.getSelectedBlocks = function () {
			var selectedBlocks = [];

			for (var i = 0; i < this.blocks.length; ++i) {
				var block = this.blocks[i];
				if (block.selected()) {
					selectedBlocks.push(block);
				}
			}

			return selectedBlocks;
		};

		//
		// Get the array of connections that are currently selected.
		//
		this.getSelectedConnections = function () {
			var selectedConnections = [];

			for (var i = 0; i < this.connections.length; ++i) {
				var connection = this.connections[i];
				if (connection.selected()) {
					selectedConnections.push(connection);
				}
			}

			return selectedConnections;
		};
		

	};

})();
