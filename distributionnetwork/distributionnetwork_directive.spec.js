
describe('distributionnetwork-directive', function () {

	var testObject;
	var mockScope;
	var mockDragging;
	var mockSvgElement;

	//
	// Bring in the distributionNetwork module before each test.
	//
	beforeEach(module('distributionNetwork'));

	//
	// Helper function to create the controller for each test.
	//
	var createController = function ($rootScope, $controller) {

 		mockScope = $rootScope.$new();
 		mockDragging = createMockDragging();
		mockSvgElement = {
			get: function () {
				return createMockSvgElement();
			}
		};

      	testObject = $controller('DistributionNetworkController', {
      		$scope: mockScope,
      		dragging: mockDragging,
      		$element: mockSvgElement,
      	});
	};

	//
	// Setup the controller before each test.
	//
	beforeEach(inject(function ($rootScope, $controller) {

		createController($rootScope, $controller);
	}));

	// 
	// Create a mock DOM element.
	//
	var createMockElement = function(attr, parent, scope) {
		return {
			attr: function() {
				return attr;
			},

			parent: function () {
				return parent;
			},		

			scope: function () {
				return scope || {};
			},

		};
	}

	//
	// Create a mock block data model.
	//
	var createMockBlock = function (inputConnectors, outputConnectors) {
		return {
			x: function () { return 0 },
			y: function () { return 0 },
			inputConnectors: inputConnectors || [],
			outputConnectors: outputConnectors || [],
			select: jasmine.createSpy(),
			selected: function () { return false; },
		};
	};

	//
	// Create a mock network.
	//
	var createMockChart = function (mockBlocks, mockConnections) {
		return {
			blocks: mockBlocks,
			connections: mockConnections,

			handleBlockClicked: jasmine.createSpy(),
			handleConnectionMouseDown: jasmine.createSpy(),
			updateSelectedBlocksLocation: jasmine.createSpy(),
			deselectAll: jasmine.createSpy(),
			createNewConnection: jasmine.createSpy(),
			applySelectionRect: jasmine.createSpy(),
		};
	};

	//
	// Create a mock dragging service.
	//
	var createMockDragging = function () {

		var mockDragging = {
			startDrag: function (evt, config) {
				mockDragging.evt = evt;
				mockDragging.config = config;
			},
		};

		return mockDragging;
	};

	//
	// Create a mock version of the SVG element.
	//
	var createMockSvgElement = function () {
		return {
			getScreenCTM: function () {
				return {
					inverse: function () {
						return this;
					},
				};
			},

			createSVGPoint: function () {
				return { 
					x: 0, 
					y: 0 ,
					matrixTransform: function () {
						return this;
					},
				};
			}



		};
	};

	it('searchUp returns null when at root 1', function () {

		expect(testObject.searchUp(null, "some-class")).toBe(null);
	});


	it('searchUp returns null when at root 2', function () {

		expect(testObject.searchUp([], "some-class")).toBe(null);
	});

	it('searchUp returns element when it has requested class', function () {

		var whichClass = "some-class";
		var mockElement = createMockElement(whichClass);

		expect(testObject.searchUp(mockElement, whichClass)).toBe(mockElement);
	});

	it('searchUp returns parent when it has requested class', function () {

		var whichClass = "some-class";
		var mockParent = createMockElement(whichClass);
		var mockElement = createMockElement('', mockParent);

		expect(testObject.searchUp(mockElement, whichClass)).toBe(mockParent);
	});

	it('hitTest returns result of elementFromPoint', function () {

		var mockElement = {};

		// Mock out the document.
		testObject.document = {
			elementFromPoint: function () {
				return mockElement;
			},
		};

		expect(testObject.hitTest(12, 30)).toBe(mockElement);
	});

	it('checkForHit returns null when the hit element has no parent with requested class', function () {

		var mockElement = createMockElement(null, null);

		testObject.jQuery = function (input) {
			return input;
		};

		expect(testObject.checkForHit(mockElement, "some-class")).toBe(null);
	});

	it('checkForHit returns the result of searchUp when found', function () {

		var mockConnectorScope = {};

		var whichClass = "some-class";
		var mockElement = createMockElement(whichClass, null, mockConnectorScope);

		testObject.jQuery = function (input) {
			return input;
		};

		expect(testObject.checkForHit(mockElement, whichClass)).toBe(mockConnectorScope);
	});	

	it('checkForHit returns null when searchUp fails', function () {

		var mockElement = createMockElement(null, null, null);

		testObject.jQuery = function (input) {
			return input;
		};

		expect(testObject.checkForHit(mockElement, "some-class")).toBe(null);
	});	

	it('test block dragging is started on block mouse down', function () {

		mockDragging.startDrag = jasmine.createSpy();

		var mockEvt = {};
		var mockBlock = createMockBlock();

		mockScope.blockMouseDown(mockEvt, mockBlock);

		expect(mockDragging.startDrag).toHaveBeenCalled();

	});

	it('test block click handling is forwarded to view model', function () {

		mockScope.network = createMockChart([mockBlock]);

		var mockEvt = {
			ctrlKey: false,
		};
		var mockBlock = createMockBlock();

		mockScope.blockMouseDown(mockEvt, mockBlock);

		mockDragging.config.clicked();

		expect(mockScope.network.handleBlockClicked).toHaveBeenCalledWith(mockBlock, false);
	});

	it('test control + block click handling is forwarded to view model', function () {

		var mockBlock = createMockBlock();

		mockScope.network = createMockChart([mockBlock]);

		var mockEvt = {
			ctrlKey: true,
		};

		mockScope.blockMouseDown(mockEvt, mockBlock);

		mockDragging.config.clicked();

		expect(mockScope.network.handleBlockClicked).toHaveBeenCalledWith(mockBlock, true);
	});

	it('test block dragging updates selected blocks location', function () {

		var mockEvt = {
			view: {
				scrollX: 0,
				scrollY: 0,
			},
		};

		mockScope.network = createMockChart([createMockBlock()]);

		mockScope.blockMouseDown(mockEvt, mockScope.network.blocks[0]);

		var xIncrement = 5;
		var yIncrement = 15;

		mockDragging.config.dragStarted(0, 0);
		mockDragging.config.dragging(xIncrement, yIncrement);

		expect(mockScope.network.updateSelectedBlocksLocation).toHaveBeenCalledWith(xIncrement, yIncrement);
	});

	it('test block dragging doesnt modify selection when block is already selected', function () {

		var mockBlock1 = createMockBlock();
		var mockBlock2 = createMockBlock();

		mockScope.network = createMockChart([mockBlock1, mockBlock2]);

		mockBlock2.selected = function () { return true; }

		var mockEvt = {
			view: {
				scrollX: 0,
				scrollY: 0,
			},
		};

		mockScope.blockMouseDown(mockEvt, mockBlock2);

		mockDragging.config.dragStarted(0, 0);

		expect(mockScope.network.deselectAll).not.toHaveBeenCalled();
	});

	it('test block dragging selects block, when the block is not already selected', function () {

		var mockBlock1 = createMockBlock();
		var mockBlock2 = createMockBlock();

		mockScope.network = createMockChart([mockBlock1, mockBlock2]);

		var mockEvt = {
			view: {
				scrollX: 0,
				scrollY: 0,
			},
		};

		mockScope.blockMouseDown(mockEvt, mockBlock2);

		mockDragging.config.dragStarted(0, 0);

		expect(mockScope.network.deselectAll).toHaveBeenCalled();
		expect(mockBlock2.select).toHaveBeenCalled();
	});

	it('test connection click handling is forwarded to view model', function () {

		var mockBlock = createMockBlock();

		var mockEvt = {
			stopPropagation: jasmine.createSpy(),
			preventDefault: jasmine.createSpy(),
			ctrlKey: false,
		};
		var mockConnection = {};

		mockScope.network = createMockChart([mockBlock]);

		mockScope.connectionMouseDown(mockEvt, mockConnection);

		expect(mockScope.network.handleConnectionMouseDown).toHaveBeenCalledWith(mockConnection, false);
		expect(mockEvt.stopPropagation).toHaveBeenCalled();
		expect(mockEvt.preventDefault).toHaveBeenCalled();
	});

	it('test control + connection click handling is forwarded to view model', function () {

		var mockBlock = createMockBlock();

		var mockEvt = {
			stopPropagation: jasmine.createSpy(),
			preventDefault: jasmine.createSpy(),
			ctrlKey: true,
		};
		var mockConnection = {};

		mockScope.network = createMockChart([mockBlock]);

		mockScope.connectionMouseDown(mockEvt, mockConnection);

		expect(mockScope.network.handleConnectionMouseDown).toHaveBeenCalledWith(mockConnection, true);
	});

	it('test selection is cleared when background is clicked', function () {

		var mockEvt = {};

		mockScope.network = createMockChart([createMockBlock()]);

		mockScope.network.blocks[0].selected = true;

		mockScope.mouseDown(mockEvt);

		expect(mockScope.network.deselectAll).toHaveBeenCalled();
	});	

	it('test background mouse down commences selection dragging', function () {

		var mockBlock = createMockBlock();
		var mockEvt = {
			view: {
				scrollX: 0,
				scrollY: 0,
			},
		};

		mockScope.network = createMockChart([mockBlock]);

		mockScope.mouseDown(mockEvt);

		mockDragging.config.dragStarted(0, 0);

		expect(mockScope.dragSelecting).toBe(true);
	});

	it('test can end selection dragging', function () {

		var mockBlock = createMockBlock();
		var mockEvt = {
			view: {
				scrollX: 0,
				scrollY: 0,
			},
		};

		mockScope.network = createMockChart([mockBlock]);

		mockScope.mouseDown(mockEvt);

 		mockDragging.config.dragStarted(0, 0, mockEvt);
 		mockDragging.config.dragging(0, 0, mockEvt);
 		mockDragging.config.dragEnded();

		expect(mockScope.dragSelecting).toBe(false);		
 	});

	it('test selection dragging ends by selecting blocks', function () {

		var mockBlock = createMockBlock();
		var mockEvt = {
			view: {
				scrollX: 0,
				scrollY: 0,
			},
		};

		mockScope.network = createMockChart([mockBlock]);

		mockScope.mouseDown(mockEvt);

 		mockDragging.config.dragStarted(0, 0, mockEvt);
 		mockDragging.config.dragging(0, 0, mockEvt);

 		var selectionRect = { 
 			x: 1,
 			y: 2,
 			width: 3,
 			height: 4,
 		};

 		mockScope.dragSelectionRect = selectionRect;

 		mockDragging.config.dragEnded();

		expect(mockScope.network.applySelectionRect).toHaveBeenCalledWith(selectionRect);
 	});

	it('test mouse down commences connection dragging', function () {

		var mockBlock = createMockBlock();
		var mockEvt = {
			view: {
				scrollX: 0,
				scrollY: 0,
			},
		};

		mockScope.network = createMockChart([mockBlock]);

		mockScope.connectorMouseDown(mockEvt, mockScope.network.blocks[0], mockScope.network.blocks[0].inputConnectors[0], 0, false);

		mockDragging.config.dragStarted(0, 0);

		expect(mockScope.draggingConnection).toBe(true);		
	});

	it('test can end connection dragging', function () {

		var mockBlock = createMockBlock();
		var mockEvt = {
			view: {
				scrollX: 0,
				scrollY: 0,
			},
		};

		mockScope.network = createMockChart([mockBlock]);

		mockScope.connectorMouseDown(mockEvt, mockScope.network.blocks[0], mockScope.network.blocks[0].inputConnectors[0], 0, false);

 		mockDragging.config.dragStarted(0, 0, mockEvt);
 		mockDragging.config.dragging(0, 0, mockEvt);
 		mockDragging.config.dragEnded();

		expect(mockScope.draggingConnection).toBe(false);		
 	});

	it('test can make a connection by dragging', function () {

		var mockBlock = createMockBlock();
		var mockDraggingConnector = {};
		var mockDragOverConnector = {};
		var mockEvt = {
            view: {
                scrollX: 0,
                scrollY: 0,
            },
        };

		mockScope.network = createMockChart([mockBlock]);

		mockScope.connectorMouseDown(mockEvt, mockScope.network.blocks[0], mockDraggingConnector, 0, false);

 		mockDragging.config.dragStarted(0, 0, mockEvt);
 		mockDragging.config.dragging(0, 0, mockEvt);

 		// Fake out the mouse over connector.
 		mockScope.mouseOverConnector = mockDragOverConnector;

 		mockDragging.config.dragEnded();

 		expect(mockScope.network.createNewConnection).toHaveBeenCalledWith(mockDraggingConnector, mockDragOverConnector);
 	});

	it('test connection creation by dragging is cancelled when dragged over invalid connector', function () {

		var mockBlock = createMockBlock();
		var mockDraggingConnector = {};
		var mockEvt = {
			view: {
				scrollX: 0,
				scrollY: 0,
			},
		};

		mockScope.network = createMockChart([mockBlock]);

		mockScope.connectorMouseDown(mockEvt, mockScope.network.blocks[0], mockDraggingConnector, 0, false);

 		mockDragging.config.dragStarted(0, 0, mockEvt);
 		mockDragging.config.dragging(0, 0, mockEvt);

 		// Fake out the invalid connector.
 		mockScope.mouseOverConnector = null;

 		mockDragging.config.dragEnded();

 		expect(mockScope.network.createNewConnection).not.toHaveBeenCalled();
 	});

 	it('mouse move over connection caches the connection', function () {

 		var mockElement = {};
 		var mockConnection = {};
 		var mockConnectionScope = {
 			connection: mockConnection
 		};
 		var mockEvent = {};

 		//
 		// Fake out the function that check if a connection has been hit.
 		//
 		testObject.checkForHit = function (element, whichClass) {
 			if (whichClass === testObject.connectionClass) {
 				return mockConnectionScope;
 			}

 			return null;
 		};

 		testObject.hitTest = function () {
 			return mockElement;
 		};

 		mockScope.mouseMove(mockEvent);

 		expect(mockScope.mouseOverConnection).toBe(mockConnection);
 	});

 	it('test mouse over connection clears mouse over connector and block', function () {

		var mockElement = {};
 		var mockConnection = {};
 		var mockConnectionScope = {
 			connection: mockConnection
 		};
 		var mockEvent = {};

 		//
 		// Fake out the function that check if a connection has been hit.
 		//
 		testObject.checkForHit = function (element, whichClass) {
 			if (whichClass === testObject.connectionClass) {
 				return mockConnectionScope;
 			}

 			return null;
 		};

 		testObject.hitTest = function () {
 			return mockElement;
 		};


 		mockScope.mouseOverConnector = {};
 		mockScope.mouseOverBlock = {};

 		mockScope.mouseMove(mockEvent);

 		expect(mockScope.mouseOverConnector).toBe(null);
 		expect(mockScope.mouseOverBlock).toBe(null);
 	});

 	it('test mouseMove handles mouse over connector', function () {

		var mockElement = {};
 		var mockConnector = {};
 		var mockConnectorScope = {
 			connector: mockConnector
 		};
 		var mockEvent = {};

 		//
 		// Fake out the function that check if a connector has been hit.
 		//
 		testObject.checkForHit = function (element, whichClass) {
 			if (whichClass === testObject.connectorClass) {
 				return mockConnectorScope;
 			}

 			return null;
 		};

 		testObject.hitTest = function () {
 			return mockElement;
 		};

 		mockScope.mouseMove(mockEvent);

 		expect(mockScope.mouseOverConnector).toBe(mockConnector);
 	});

 	it('test mouseMove handles mouse over block', function () {

		var mockElement = {};
 		var mockBlock = {};
 		var mockBlockScope = {
 			block: mockBlock
 		};
 		var mockEvent = {};

 		//
 		// Fake out the function that check if a connector has been hit.
 		//
 		testObject.checkForHit = function (element, whichClass) {
 			if (whichClass === testObject.blockClass) {
 				return mockBlockScope;
 			}

 			return null;
 		};

 		testObject.hitTest = function () {
 			return mockElement;
 		};

 		mockScope.mouseMove(mockEvent);

 		expect(mockScope.mouseOverBlock).toBe(mockBlock);
 	});
});