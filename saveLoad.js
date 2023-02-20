function loadFile(){
    //console.log(JSON.parse('{"id":"n_0","name":"János","gender":1,"pos":[259,262],"t_1":"uk"}'));
    let fInp = document.getElementById("fInput");
    let selectedFiles = fInp.files;
    if(selectedFiles.length > 0){
        let fReader = new FileReader();
        fReader.addEventListener("load",function(){
            loadFromText(fReader.result);
        });
        fReader.readAsText(selectedFiles[0]);
    }
}

function loadFromText(text){
    let jsonData = JSON.parse(text);
    //console.log(jsonData);
    //console.log(text);
    
    //clear
    usedCIds = [];
    usedIds = [];
    usedPIds = [];

    attrData = jsonData["attrData"];

    for(let i=0; i<nodes.length; i+=1){
        nodes[i].remove();
    }
    nodes = [];

    for(let i=0; i<parentRects.length; i+=1){
        parentRects[i].remove();
    }
    parentRects = [];

    //load
    let nDataList = jsonData["nodes"];

    for(let i=0; i<nDataList.length; i+=1){
        let nId = Number(nDataList[i]["id"].slice(2,nDataList[i]["id"].length));
        let nAttrs = [];
        let attrIds = Object.keys(attrData);
        for(let j=0; j<attrIds.length; j+=1){
            if(attrIds[j] in nDataList[i]){
                nAttrs.push([attrIds[j],nDataList[i][attrIds[j]]]);
            }
        }
        let n = Node(nDataList[i]["gender"],nDataList[i]["name"],nId,nAttrs);
        usedIds.push(nId);
        addNode(n);
        n.style.left = String(nDataList[i]["pos"][0])+"px";
        n.style.top = String(nDataList[i]["pos"][1])+"px";
    }


    let pDataList = jsonData["parents"];

    for(let i=0; i<pDataList.length; i+=1){
        let nId = Number(pDataList[i]["id"].slice(2,pDataList[i]["id"].length));
        let p = ParentRect(-1,nId);
        usedPIds.push(nId);
        addParent(p);
        p.style.left = String(pDataList[i]["pos"][0])+"px";
        p.style.top = String(pDataList[i]["pos"][1])+"px";
    }


    let cList = jsonData["connections"];

    for(let i=0; i<cList.length; i+=1){
        usedCIds.push(cList[2]);
    }

    connections = cList;
    parentRectData = jsonData["pRectData"];
    pConnections = jsonData["pConnections"];

    //console.log(nodeData);

    updateCanvas();
    updateAttrForm();
}



function saveFile(text="teszt", name="_"){
    let blob = new Blob([text],{type:"text/plain;charset=utf-8"});
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function setupSave(){
    jsonData = {};
    //create node data
    nDataList = [];
    for(let i=0; i<nodes.length; i+=1){
        let nName = nodes[i].childNodes[2];
        let nData = {
            "id":nodes[i].id,
            "name":nName.value,
            "gender":nodeData[nodes[i].id]["gender"],
            "pos":[nodes[i].offsetLeft,nodes[i].offsetTop]
        };
        let attrIds = Object.keys(attrData);
        for(let j=0; j<attrIds.length; j+=1){
            if(attrIds[j] in nodeData[nodes[i].id]){
                nData[attrIds[j]] = nodeData[nodes[i].id][attrIds[j]];
            }
        }
        nDataList.push(nData);
    }
    //console.log(nDataList);
    //console.log(nodeData);
    jsonData["nodes"] = nDataList;
    
    jsonData["attrData"] = attrData;
    
    parentData = [];
    for(let i=0; i<parentRects.length; i+=1){
        let pData = {
            "id":parentRects[i].id,
            "pos":[parentRects[i].offsetLeft,parentRects[i].offsetTop]
        };
        parentData.push(pData);
    }
    jsonData["parents"] = parentData;

    jsonData["connections"] = connections;
    jsonData["pConnections"] = pConnections;
    jsonData["pRectData"] = parentRectData;
    
    let result = JSON.stringify(jsonData);

    return result;
}