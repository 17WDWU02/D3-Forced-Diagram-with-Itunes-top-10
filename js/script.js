var width = 1200,
	height = 700,
	link,
	node;

var circleWidth = 20;

var url = "data/top10.json";
d3.json(url, function(DataFromJSON){
	var tracks = DataFromJSON.feed.results;
	var nodes = [];
	nodes.push({
		id: 0,
		name:"ITunes Top " + tracks.length,
		type: "Parent"
	})

	for (var i = 0; i < tracks.length; i++) {
		nodes.push({
			id: tracks[i].artistId
			,
			name: tracks[i].artistName,
			type: "artists",
			targets: [0]
		})
		var genres = tracks[i].genres;
		for (var j = 0; j < genres.length; j++) {
			check(genres[j], tracks[i].artistId);
		};

		function check(genre, artistID){
			var currentNode;
			var found = nodes.some(function(singleNode){
				currentNode = singleNode;
				return singleNode.name === genre.name
			});
			if(!found){
				nodes.push({
					id: genre.genreId,
					name: genre.name,
					type: "genre",
					targets:[artistID]
				})
			} else {
				currentNode.targets.push(artistID)
			}
		}



	};
	console.log(nodes);
	console.log("break");

	var links = [];
	for (var i = 0; i < nodes.length; i++) {
		if(nodes[i].targets !== undefined){
			for(var j = 0; j < nodes[i].targets.length; j++){
				links.push({
					source: nodes[i].id,
					target: nodes[i].targets[j]
				})
			}
		}
	};
	var svg = d3.select("#canvas").append("svg")
		.attr("width", width)
		.attr("height", height)
		.style("background-color", "#bdc3c7")

	var simulation = d3.forceSimulation()
		.force("charge", d3.forceManyBody().strength(-2000))
		.force("link", d3.forceLink().id(function(data){
			return data.id
		}))
		.force("center", d3.forceCenter(width/2, height/2))

	runSim();

	function runSim(){
		link = svg.selectAll(".link")
			.data(links, function(data){
				return data.target.id
			})
		link = link.enter()
			.append("line")
			.classed("link", true)

		node = svg.selectAll(".node")
			.data(nodes, function(data){
				return data.id
			})

		node = node.enter()
			.append("g")
			.classed("node", true)

		node.append("circle")
			.attr("r", function(data, i){
				if(i===0){
					return circleWidth*3
				} else if(data.type === "artists"){
					return circleWidth*2
				} else {
					return circleWidth
				}
			})
			.attr("fill", function(data, i){
				if(i===0){
					return "#e74c3c"
				} else if(data.type === "artists"){
					return "#2980b9"
				} else {
					return "#2ecc71"
				}
			});

		node.append("text")
			.attr("dy", 10)
			.text(function(data){
				return data.name
			})

		simulation
			.nodes(nodes)
			.on("tick", ticked)

		simulation.force("link")
			.links(links)
	}

	function ticked(){
		link
			.attr("x1", function(data){return data.source.x; })
			.attr("y1", function(data){return data.source.y; })
			.attr("x2", function(data){return data.target.x; })
			.attr("y2", function(data){return data.target.y; });
		node
			.attr("transform", function(data){
				return "translate("+data.x+","+data.y+")"
			})	
	}


	



});