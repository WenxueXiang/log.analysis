var isLoaded = false;
var load = {
	isEmpty: function(str) {
		if(str == undefined || str == null || str == '') {
			return true;
		}
		return false;
	},
	loadBuild: function(flowid) {
		if(isLoaded) {
			//return;
		}
		CONST_DURATION = 10;
		if(isEmpty(flowid)){
			return;
		}
		var flowObj = interact.getFlow(flowid);
		WHOLE_PROJECT_ID = flowObj.projectId;
		console.log("flowObj", flowObj);
		if(!this.isEmpty(flowObj)) {
			if(this.isEmpty(flowObj.jsonContent)) {
				return;
			}
			var flowContext;
			try
			{
				flowContext = JSON.parse(flowObj.jsonContent); 
				
				//******************************清除现有的内容
				dataSetList = [];
				result.nodes = [];
				result.outlets = [];
				result.links = [];
				result.data = [];
				result.inLets = [];
				
				var tempnodes = g.nodes();
				each(tempnodes,function(){
					var temp_g_child_Instance = childsvg.find(this);
					if(temp_g_child_Instance){
						temp_g_child_Instance.removeNode(this+"_InData_0");
						temp_g_child_Instance.removeNode(this+"_InData_1");
						temp_g_child_Instance.removeNode(this+"_InData_2");
						temp_g_child_Instance.removeNode(this+"_InData_3");
						
						temp_g_child_Instance.removeNode(this+"_property");
						
						temp_g_child_Instance.removeNode(this+"_OutData_0");
						temp_g_child_Instance.removeNode(this+"_OutData_1");
						temp_g_child_Instance.removeNode(this+"_OutData_2");
						temp_g_child_Instance.removeNode(this+"_OutData_3");
					}
					g.removeNode(this);
					return true;
				});
				
				$("#rightupcssbody").html("");
				d3.select("#divrightup").style({
					"display": "none"
				});
			
				//******************************清除现有的内容
			}
			catch(err)
			{
				msgShow('Info', 'please check flow context, it cannot be parsed.', 'Info');
			}
			console.log(flowObj);
//			var flowContext = flowObj;


			var nodes = flowContext.nodes;
			var links = flowContext.links;
			var datas = flowContext.data;
			isLoaded = true;
			console.log("datas", datas);
			this.buildDatas(datas);
			console.log("datas", result.data);
			this.buildNodes(nodes);
			this.buildLink(links);
			this.buildManPosition(nodes);
		}
	},
	buildDatas: function(obj) {
		each(obj, function(i, o) {
			if(this["id"]) {
				this.name = this.name.replace("_" + this.id, "");
				addLeftDiv(this["id"],{
					id: this["id"],
					name: this["name"],
					location: this["location"],
					dataFormat: this["dataFormat"],
					recordType: this["recordType"],
					instance: this["instance"]					
				});
			} else {
				this["id"] = this["name"];
				addLeftDiv(this.id, {
					id: this["id"],
					name: this["name"],
					location: this["location"],
					dataFormat: this["dataFormat"],
					recordType: this["recordType"],
					instance: this["instance"]
				});
			}
			return true;
		});
	},
	buildNodes: function(obj) {
		each(obj, function() {
			if(this["@class"].toString().localeCompare("start") == 0) {
				if(!this["id"]) {
					this["id"] = this["name"];
				}
				app.start(this["id"].toString());
			} else if(this["@class"].toString().localeCompare("end") == 0) {
				if(!this["id"]) {
					this["id"] = this["name"];
				}
				app.end(this["id"].toString());
			} else if(this["@class"].toString().localeCompare("action") == 0) {
				if(!this["id"]) {
					this["id"] = this["name"];
				} else {
					this["name"] = this["name"].toString().replace("_" + this["id"], "");
				}
				var o = {
					cla: this["cmd.class"],
					label: this["name"]
				};
				app.action(o, this["id"].toString(), this);
				each(this.inLets, function(i, o) {
					if(this.dataName.indexOf("dataset_") > -1) {
						this.dataName = this.dataName.substring(this.dataName.indexOf("dataset_"));
					}
					result.nodes[result.nodes.length - 1].inLets[i].dataName = this.dataName;
					result.nodes[result.nodes.length - 1].inLets[i].name = this.name;
					result.nodes[result.nodes.length - 1].inLets[i].show = true;
					return true;
				});
				each(this.outlets, function(i, o) {
					if(this.dataName.indexOf("dataset_") > -1) {
						this.dataName = this.dataName.substring(this.dataName.indexOf("dataset_"));
					}
					try{
						result.nodes[result.nodes.length - 1].outlets[i].dataName = this.dataName;
						result.nodes[result.nodes.length - 1].outlets[i].name = this.name;
						result.nodes[result.nodes.length - 1].outlets[i].show = true;
					}catch(e){
						console.info(e.message);
					}
					return true;
				});
			}

			return true;
		});
	},
	buildLink: function(obj) {
		each(obj, function() {
			var tempfrom = this.fromNodeName;
			var tempto = this.toNodeName;
			if(tempfrom.indexOf("g_")>-1){
				tempfrom= tempfrom.substring(tempfrom.indexOf("g_"));
				tempfrom = "g_" + tempfrom.replace(/g_/g, '');
			}
			if(tempto.indexOf("g_")>-1){
				tempto = tempto.substring(tempto.indexOf("g_"));
				tempto = "g_" + tempto.replace(/g_/g, '');
			}
			g.setEdge(tempfrom, tempto);
//			result.links.push(obj);
			result.links.push({
				fromNodeName:tempfrom,
				toNodeName:tempto,
				linkType:"success"
			});
			return true;
		});
	},
	buildManPosition: function(remoteNodes) {
		console.log("result",result);
		_build._build();
		each(result.nodes, function(resultIndex,resultObj) {
			var g_child_instance = childsvg.find(this["id"]);
			_build._build(this["id"], g_child_instance);

			if(this["@class"].toString().localeCompare("action") == 0 && this.inLets) {
				each(this.inLets, function(i, o) {
					if(o.show) {
						var gId = o["id"].substring(0, o["id"].indexOf("_InData_"));
						_draw._drawInputData(gId);
					}
					return true;
				});
			}

			if(this["@class"].toString().localeCompare("action") == 0 && this.outlets) {
				each(this.outlets, function(i, o) {
					if(o.show) {
						var gId = o["id"].substring(0, o["id"].indexOf("_OutData_"));
						_draw._drawOutputData(gId);
					}
					return true;
				});
			}

			each(remoteNodes, function(i, o) {
				if(resultObj.id.localeCompare(o.id) == 0) {
					$.each(o, function(k, v) {
						if(typeof v == 'string') {
							if(v.length > 0) {
								resultObj[k] = v;
							}
						}
					});
					return false;
				}
				return true;
			});

			return true;
		});
		_draw._drawNodeDataRelation();
	}
}