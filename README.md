AngularJS-DistributionNetwork
===================

A WebUI control for visualizing and editing flow networks.

This isn't designed to be completely general purpose, but it will be a good basis if you need an SVG distributionnetwork and you are willing to work with AngularJS.

Code Project Article
--------------------

http://www.codeproject.com/Articles/709340/Implementing-a-Flownetwork-with-SVG-and-AngularJS


How to use it
-------------

Include the following Javascript in your HTML file:

```html
	<script src="distributionnetwork/svg_class.js" type="text/javascript"></script>
	<script src="distributionnetwork/mouse_capture_service.js" type="text/javascript"></script>
	<script src="distributionnetwork/dragging_service.js" type="text/javascript"></script>
	<script src="distributionnetwork/distributionnetwork_viewmodel.js" type="text/javascript"></script>
	<script src="distributionnetwork/distributionnetwork_directive.js" type="text/javascript"></script>
```

Make a dependency on the the distributionnetwork's AngularJS module from your application (or other module):

```javascript
	angular.module('app', ['distributionNetwork', ])
```

In your application (or other) controller setup a data-model for the initial distributionnetwork (or AJAX the data-model in from a JSON resource):

```javascript
	var networkDataModel = {

		blocks: [
			{
				name: "Example Block 1",
				id: 0,
				x: 0,
				y: 0,
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


		]
	};
```

Also in your controller, wrap the data-model in a view-model and add it to the AngularJS scope:

```javascript
	$scope.networkViewModel = new distributionnetwork.ChartViewModel(networkDataModel);
```

Your code is in direct control of creation of the view-model, so you can interact with it in almost anyway you want.

Finally instantiate the distributionnetwork's AngularJS directive in your HTML:

```html
    <distribution-network
		style="margin: 5px; width: 100%; height: 100%;"
      	network="networkViewModel"
      	>
    </distribution-network>
```

Be sure to bind your view-model as the 'network' attribute!


Have fun and please contribute!
