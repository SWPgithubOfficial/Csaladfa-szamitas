function getUnusedName(){
    let id = 1;
    while(usedNames.includes(id)){
        id+=1;
    }
    usedNames.push(id);
    return id;
}

function getUnusedId(){
    let id = 0;
    while(usedIds.includes(id)){
        id+=1;
    }
    usedIds.push(id);
    return id;
}

function getUnusedParentId(){
    i=0;
    while(usedPIds.includes(i)){
        i+=1;
    }
    usedPIds.push(i);
    return i;
}

function getUnusedConnectionId(){
    i=0;
    while(usedCIds.includes(i)){
        i+=1;
    }
    usedCIds.push(i);
    return i;
}



function Node(gender=2,customName="",id=-1,attrL=[]){
    //gender 0-female, 1-male, 2-unknown

    let n = document.createElement("div");

    let grabber = document.createElement("div");
    let name = document.createElement("input");
    let circle = document.createElement("div");
    let parents = document.createElement("div");

    let nId = 0;
    if(id==-1){
        nId = getUnusedId();
    }else{
        nId = id;
    }
    n.id = "n_"+String(nId);
    let nName = "";

    if(customName == ""){
        name.value = "Node "+String(nId);
        nName = "Node "+String(nId);
    }else{
        name.value = customName;
        nName = customName;
    }
    n.className="node";
    parents.className = "parent";
    grabber.className = "grabber";
    circle.className = "circle";

    //parents.innerText = "+";

    if(gender==0){
        circle.style.left = "-15px";
        circle.style.backgroundColor = "#D6296E";
        grabber.style.backgroundColor = "#D6296E";
    }else if(gender==1){
        circle.style.left = "185px";
        circle.style.backgroundColor = "#0094FF";
        grabber.style.backgroundColor = "#0094FF";
    }

    circle.style.marginTop = "-40px";
    circle.style.marginBottom = "20px";

    parents.onmouseup = parentMouseUp;
    parents.onmousedown = parentMouseDown;

    n.appendChild(grabber);
    n.appendChild(parents);
    n.appendChild(name);

    if(gender!=2){
        circle.onmouseup = circleMouseUp;
        circle.onmousedown = circleMouseDown;
        n.appendChild(circle);
    }

    n.style.top = "0px";
    n.style.left = "0px";

    grabber.onmousedown = grabDiv;
    nodes.push(n);

    nodeData["n_"+String(nId)] = {
        "gender":gender,
        "name":nName
    };

    //console.log(attrL);
    for(let i=0; i<attrL.length; i+=1){
        nodeData["n_"+String(nId)][attrL[i][0]] = attrL[i][1];
        
    }

    return n;
}

function ParentRect(cId=-1,pId=-1){
    let p = document.createElement("div");
    p.className = "loneParent";
    let id = ""
    if(pId==-1){
        id = "p_"+String(getUnusedParentId());
    }else{
        id = "p_"+String(pId);
    }
    p.id = id;
    if(cId!=-1){
        parentRectData[cId] = id;
    }
    p.style.top = "0px";
    p.style.left = "0px";
    p.onmousedown = parentMouseDown;
    p.onmouseup = parentMouseUp;
    parentRects.push(p);
    return p;
}



//clicked on node
function grabDiv(event){
    if(selectedTool==0){
        event.preventDefault();
        startPosX = event.clientX;
        startPosY = event.clientY;
        currentDrag = event.target.parentElement;
        document.onmouseup = dropDiv;
        document.onmousemove = moveDiv;
    }else{
        deleteNode(event.target.parentElement.id);
    }
}

//node released
function dropDiv(){
    document.onmouseup = null;
    document.onmousemove = null;
    currentDrag = null;
}

//move node
function moveDiv(event){
    event.preventDefault();

    let newPosX = startPosX-event.clientX;
    let newPosY = startPosY-event.clientY;

    startPosX = event.clientX;
    startPosY = event.clientY;

    if(currentDrag){
        currentDrag.style.top = Math.max(currentDrag.offsetTop - newPosY,0) + "px";
        currentDrag.style.left = Math.max(currentDrag.offsetLeft - newPosX,0) + "px";
    }

    updateCanvas();
}



function addNode(n){
    document.body.appendChild(n);
}

function addParent(p){
    document.body.appendChild(p);
}



function updateCanvas(event = null){

    let maxX = 0.0;
    let maxY = 0.0;

    for(let i=0; i<nodes.length; i+=1){
        let curX = nodes[i].offsetLeft+nodes[i].offsetWidth;
        let curY = nodes[i].offsetTop+nodes[i].offsetHeight;
        if(curX > maxX){
            maxX = curX;
        }
        if(curY > maxY){
            maxY = curY;
        }
    }

    if(event){
        if(event.clientX > maxX){
            maxX = event.clientX;
        }
        if(event.clientY > maxY){
            maxY = event.clientY;
        }
    }

    canvas.width = maxX;
    canvas.height = maxY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(cStartN){
        
        let cStartX = cStartN.parentElement.offsetLeft+cStartN.offsetLeft+cStartN.offsetWidth/2;
        let cStartY = cStartN.parentElement.offsetTop+cStartN.offsetTop+cStartN.offsetHeight/2;

        ctx.beginPath();
        ctx.moveTo(cStartX,cStartY);
        ctx.lineTo(event.clientX+window.scrollX,event.clientY+window.scrollY);
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        
    }else if(pStartN){
        
        let pStartX = pStartN.parentElement.offsetLeft+pStartN.offsetLeft+pStartN.offsetWidth/2;
        let pStartY = pStartN.parentElement.offsetTop+pStartN.offsetTop+pStartN.offsetHeight/2;

        ctx.beginPath();
        ctx.moveTo(pStartX,pStartY);
        ctx.lineTo(event.clientX+window.scrollX,event.clientY+window.scrollY);
        ctx.strokeStyle = "#009900";
        ctx.stroke();
    }


    for(let i=0; i<connections.length; i+=1){
        let startN = document.getElementById(connections[i][0]);
        let endN = document.getElementById(connections[i][1]);

        let startX = startN.offsetLeft+startN.childNodes[3].offsetLeft+startN.childNodes[3].offsetWidth/2;
        let startY = startN.offsetTop+startN.childNodes[3].offsetTop+startN.childNodes[3].offsetHeight/2;

        let endX = endN.offsetLeft+endN.childNodes[3].offsetLeft+endN.childNodes[3].offsetWidth/2;
        let endY = endN.offsetTop+endN.childNodes[3].offsetTop+endN.childNodes[3].offsetHeight/2;

        ctx.beginPath();
        ctx.moveTo(startX,startY);
        ctx.lineTo(endX,endY);
        ctx.strokeStyle = "#000000";
        ctx.stroke();

        let pId = parentRectData[connections[i][2]];
        //console.log(connections[i][2],parentRectData);
        let pRect = document.getElementById(pId);
        pRect.style.left = startX+(endX-startX)/2-pRect.offsetWidth/2+"px";
        pRect.style.top = startY+(endY-startY)/2-pRect.offsetHeight/2+"px";
    }

    //console.log(pConnections);
    for(let i=0; i<pConnections.length; i+=1){
        let startN = document.getElementById(pConnections[i][0]);
        let endN = document.getElementById(pConnections[i][1]);

        let startX = startN.offsetLeft+startN.offsetWidth/2;
        let startY = startN.offsetTop+startN.offsetHeight/2;

        let endX = endN.offsetLeft+endN.childNodes[1].offsetLeft+endN.childNodes[1].offsetWidth/2;
        let endY = endN.offsetTop+endN.childNodes[1].offsetTop+endN.childNodes[1].offsetHeight/2;

        //console.log(i);
        //console.log(startN,endN);
        
        ctx.beginPath();
        ctx.moveTo(startX,startY);
        ctx.lineTo(endX,endY);
        ctx.strokeStyle = "#00FF00";
        ctx.stroke();
    }

    //ctx.stroke();

}

function connectionUpdate(event = null){
    updateCanvas(event);
}



function circleCancel(event){
    cStartN = null;
    connectionUpdate();
    document.onmouseup = null;
    document.onmousemove = null;
}

function circleMouseUp(event){
    if(cStartN){
        let startGender = nodeData[cStartN.parentElement.id]["gender"];
        let endGender = nodeData[event.target.parentElement.id]["gender"];
        if(startGender!=endGender){
            document.onmouseup = null;
            document.onmousemove = null;

            let startId = cStartN.parentElement.id;
            let endId = event.target.parentElement.id;

            let found = false;

            for(let i=0; i<connections.length; i+=1){
                if(connections[i].includes(startId)&&connections[i].includes(endId)){
                    found = true;
                }
            }

            if(!found){
                cId = getUnusedConnectionId();
                connections.push([startId,endId,cId]);

                let pRect = ParentRect(cId);
                addParent(pRect);
            }

            cStartN = null;

            connectionUpdate();
            //console.log(connections);
        }else{
            cStartN = null;
            connectionUpdate();
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

function circleMouseDown(event){
    if(selectedTool == 0){
        event.preventDefault();
        document.onmouseup = circleCancel;
        document.onmousemove = connectionUpdate;
        cStartN = event.target;
    }
}



function parentCancel(event){
    /*
    console.log(event);
    console.log(document.elementsFromPoint(event.x,event.y));
    let elements = document.elementsFromPoint(event.x,event.y);
    for(let i=0; i<elements.length; i+=1){
        if(elements[i].className == "grabber"){
            if(elements[i] != pStartN){
                return
            }
        }
    }
    */
    pStartN = null;
    connectionUpdate();
    document.onmouseup = null;
    document.onmousemove = null;
}

function parentMouseUp(event){
    if(pStartN){
        if(event.target != pStartN && (pStartN.parentElement == document.body || event.target.parentElement == document.body) && (pStartN.parentElement != document.body || event.target.parentElement != document.body)){
            document.onmouseup = null;
            document.onmousemove = null;
            
            let parentId = "";
            let nodeId = "";
            
            if(pStartN.parentElement == document.body){
                parentId = pStartN.id;
                nodeId = event.target.parentElement.id;
            }else{
                parentId = event.target.id;
                nodeId = pStartN.parentElement.id;
            }

            let newPConnections = [];

            for(let i=0; i<pConnections.length; i+=1){
                if(!pConnections[i].includes(nodeId)){
                    newPConnections.push(pConnections[i]);
                }
            }

            pConnections = newPConnections;
            pConnections.push([parentId,nodeId]);

            pStartN = null;

            
            connectionUpdate();
            
        }else{
            pStartN = null;
            connectionUpdate();
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

function parentMouseDown(event){
    if(selectedTool==0){
        event.preventDefault();
        document.onmouseup = parentCancel;
        document.onmousemove = connectionUpdate;
        pStartN = event.target;
    }else{
        if(Object.values(parentRectData).includes(event.target.id)){
            let cId = 0;
            let parentDataKeys = Object.keys(parentRectData);
            for(let i=0; i<parentDataKeys.length; i+=1){
                if(parentRectData[parentDataKeys[i]]==event.target.id){
                    cId = parentDataKeys[i];
                    break;
                }
            }
            deleteConnection(cId);
        }
    }
}



function deleteConnection(cId){
    //console.log(cId);
    let newConnections = [];
    let newPConnections = [];
    let delParents = [];
    for(let i=0; i<connections.length; i+=1){
        if(connections[i][2]==cId){
            delParents.push(parentRectData[connections[i][2]]);
            usedCIds.splice(usedCIds.indexOf(connections[i][2]),1);
            delete parentRectData[connections[i][2]];
        }else{
            newConnections.push(connections[i]);
        }
    }
    connections = newConnections;

    for(let i=0; i<pConnections.length; i+=1){
        if(!delParents.includes(pConnections[i][0])){
            //console.log(delParents[j],pConnections[i]);
            newPConnections.push(pConnections[i]);
        }
    }

    for(let i=0; i<delParents.length; i+=1){
        let p = document.getElementById(delParents[i]);
        let parentIdN = Number(delParents[i].slice(2,delParents[i].length));
        //console.log(parentIdN,delParents[i]);
        usedPIds.splice(usedPIds.indexOf(parentIdN),1);
        parentRects.splice(parentRects.indexOf(p),1);
        p.remove();
    }

    connections = newConnections;
    pConnections = newPConnections;
    updateCanvas();
}

function deleteNode(id){
    //console.log(id);
    let n = document.getElementById(id);
    let newConnections = [];
    let delParents = [];
    let newPConnections = [];
    for(let i=0; i<connections.length; i+=1){
        if(!connections[i].includes(id)){
            newConnections.push(connections[i]);
        }else{
            delParents.push(parentRectData[connections[i][2]]);
            usedCIds.splice(usedCIds.indexOf(connections[i][2]),1);
            delete parentRectData[connections[i][2]];
        }
    }

    for(let i=0; i<pConnections.length; i+=1){
        if(!delParents.includes(pConnections[i][0]) && pConnections[i][1]!=id){
            //console.log(delParents[j],pConnections[i]);
            newPConnections.push(pConnections[i]);
        }
    }

    for(let i=0; i<delParents.length; i+=1){
        let p = document.getElementById(delParents[i]);
        let parentIdN = Number(delParents[i].slice(2,delParents[i].length));
        //console.log(parentIdN,delParents[i]);
        usedPIds.splice(usedPIds.indexOf(parentIdN),1);
        parentRects.splice(parentRects.indexOf(p),1);
        p.remove();
    }

    //console.log(newPConnections,id,delParents);

    connections = newConnections;
    pConnections = newPConnections;
    //console.log(pConnections);

    delete nodeData[id];


    let nId = Number(id.slice(2,id.length));
    usedIds.splice(usedIds.indexOf(nId),1);
    nodes.splice(nodes.indexOf(n),1);
    n.remove();
    updateCanvas();
}