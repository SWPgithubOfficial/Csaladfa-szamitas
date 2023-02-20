function selectDelTool(){
    selectedTool = 1;
    document.getElementById("deletePic").setAttribute("src","media/deleteSelected2.png");
    document.getElementById("movePic").setAttribute("src","media/move.png");
}

function selectMoveTool(){
    selectedTool = 0;
    document.getElementById("deletePic").setAttribute("src","media/delete2.png");
    document.getElementById("movePic").setAttribute("src","media/moveSelected.png");
}

function changeVisibility(id){
    let inner = document.getElementById(id+"Inner");
    let header = document.getElementById(id);
    if(inner.style.display=="block"){
        inner.style.display="none";
        header.style.right=15+"px";
    }else{
        inner.style.display="block";
        header.style.right=49+"px";
        if(id=="tulajdonsagok"){
            header.style.right=209+"px"
        }
    }
}


function spawnNode(gender=2){
    let n = Node(gender);
    addNode(n);
    n.style.top = String(window.scrollY)+"px";
    n.style.left = String(window.scrollX)+"px";
    updateAttrDisplay()
}



//run on start of page
function ready(){

    canvas = document.getElementById("bg");
    ctx = canvas.getContext("2d");
    
    attrForm = document.getElementById("attrForm");
    attrOverlay = document.getElementById("overlay");
    attrList = document.getElementById("attrList");

    toolDiv = document.getElementById("tools");

    updateAttrForm();
    attributeFormChanged();
    

    let testNode = Node(1);
    addNode(testNode);
    /*testNode = Node(0,"Mária");
    addNode(testNode);
    testNode = Node(2,"Gyerek");
    addNode(testNode);
    testNode = Node(0,"Ildikó");
    addNode(testNode);*/
    //deleteNode("n_"+String(usedIds[0]));
    //console.log(nodes);
}



function calculate(){
    //console.log(attrCheckboxes);
    for(let i=0; i<attrCheckboxes.length; i+=1){
        if(attrCheckboxes[i][1]){
            calculateAttr(attrCheckboxes[i][0]);
        }
    }
    
}

function calculateAttr(attrId){


    let avId = 0;
    let idRef = {};
    let relationsMap = [];
    for(let i=0; i<connections.length; i+=1){
        
        let pId = parentRectData[connections[i][2]];
        let hasChild = false;
        for(let j=0; j<pConnections.length; j+=1){
            if(pConnections[j][0]==pId){
                if(!hasChild){
                    if(!(connections[i][0] in idRef)){
                        idRef[connections[i][0]] = avId;
                        avId+=1;
                    }
                    if(!(connections[i][1] in idRef)){
                        idRef[connections[i][1]] = avId;
                        avId+=1;
                    }
                    hasChild = true;
                }
                let relationStr = "";
                
                if(!(pConnections[j][1] in idRef)){
                    idRef[pConnections[j][1]] = avId;
                    avId+=1;
                }

                relationStr+=String(idRef[pConnections[j][1]])+" ";
                if(nodeData[connections[i][0]]["gender"]==0){
                    relationStr+=String(idRef[connections[i][0]])+" ";
                    relationStr+=String(idRef[connections[i][1]]);
                }else{
                    relationStr+=String(idRef[connections[i][1]])+" ";
                    relationStr+=String(idRef[connections[i][0]]);
                }
                relationsMap.push(relationStr);
            }
        }
        
    }
    
    //console.log(idRef);

    let selectedNodeData = [];
    let nodeIds = Object.keys(idRef);
    for(let i=0; i<avId; i+=1){
        let nId = "";
        for(let j=0; j<nodeIds.length; j+=1){
            if(idRef[nodeIds[j]]==i){
                nId = nodeIds[j];
                nodeIds.splice(j,1);
                break;
            }
        }
        if(nId != ""){
            let nData = [];
            if(nodeData[nId]["gender"]==0){
                nData.push("Female");
            }else if(nodeData[nId]["gender"]==1){
                nData.push("Male");
            }else{
                nData.push("Unknown");
            }

            if(attrId in nodeData[nId]){
                if(nodeData[nId][attrId] == "uk"){
                    nData.push("Unknown");
                }else{
                    nData.push(nodeData[nId][attrId]);
                }
            }else{
                nData.push("Unknown");
            }
            
            selectedNodeData.push(nData);
        }else{
            selectedNodeData.push(["Unknown","Unknown"]);
        }
    }

    /*
    let blankId = avId;
    selectedNodeData.push(["Female","Unknown"]);
    selectedNodeData.push(["Male","Unknown"]);
    avId+=2;

    let nIds = Object.keys(nodeData);
    for(let i=0; i<nIds.length; i+=1){
        if(!(nIds[i] in idRef)){
            let nData = [];
            idRef[nIds[i]] = avId;
            if(nodeData[nIds[i]]["gender"]==0){
                nData.push("Female");
            }else if(nodeData[nIds[i]]["gender"]==1){
                nData.push("Male");
            }else{
                nData.push("Unknown");
            }

            if(attrId in nodeData[nIds[i]]){
                if(nodeData[nIds[i]][attrId] == "uk"){
                    nData.push("Unknown");
                }else{
                    nData.push(nodeData[nIds[i]][attrId]);
                }
            }else{
                nData.push("Unknown");
            }

            selectedNodeData.push(nData);
            let relationStr = String(avId)+" "+String(blankId)+" "+String(blankId+1);
            relationsMap.push(relationStr);
            avId+=1;
        }
    }
    */
    //console.log(nodeData);
    //console.log(relationsMap);
    //console.log(selectedNodeData);

    let selectedAttrData = [["AA","very ill"], ["AB", "bit ill"], ["BB", "not ill"]];
    let rawGenes = "AB";

    if(attrId in attrData){
        if(attrData[attrId]["rawGene"] != ""){
            rawGenes = attrData[attrId]["rawGene"];
        }
        let genes = Object.keys(attrData[attrId]["phenotypes"]);
        if(genes.length > 0){
            let newSelectedAttrData = [];
            for(let i=0; i<genes.length; i+=1){
                let geneData = [genes[i],attrData[attrId]["phenotypes"][genes[i]]];
                newSelectedAttrData.push(geneData);
            }
            selectedAttrData = newSelectedAttrData;
        }
    }

    let result = calculateTotalTreeChances(relationsMap,selectedNodeData,selectedAttrData,rawGenes);

    let resPercent = []

    for(let i=0; i<result.length; i+=1){
        let resSum = 0;
        for(let j=0; j<result[i].length; j+=1){
            resSum += result[i][j];
        }
        let resP = [];
        for(let j=0; j<result[i].length; j+=1){
            resP.push(Math.round((result[i][j]/resSum*100).toFixed(2)*100)/100);
            //console.log((result[i][j]/resSum).toFixed(4));
            
        }
        resPercent.push(resP);
    }

    nodeIds = Object.keys(idRef);
    for(let i=0; i<nodeIds.length; i+=1){
        //console.log(idRef[nodeIds[i]]);
        if(idRef[nodeIds[i]] < resPercent.length){
            let nodeChildren = document.getElementById(nodeIds[i]).childNodes;
            for(let j=0; j<nodeChildren.length; j+=1){
                if(nodeChildren[j].id==attrId){
                    let resNodes = nodeChildren[j].childNodes;
                    for(let k=0; k<resNodes.length; k+=1){
                        if(resNodes[k].className=="resultText"){
                            resNodes[k].remove();
                        }
                    }
                    let resStr = "";
                    for(let k=0; k<resPercent[idRef[nodeIds[i]]].length; k+=1){
                        resStr += selectedAttrData[k][1];
                        resStr += ": ";
                        resStr += String(resPercent[idRef[nodeIds[i]]][k]);
                        resStr += "%\n";
                    }
                    let resultText = document.createElement("p");
                    resultText.className = "resultText";
                    resultText.innerText = resStr;
                    nodeChildren[j].appendChild(resultText);
                }
            }
        }
    }
}