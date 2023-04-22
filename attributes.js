function attrPicker(n="", id=""){
    let pDiv = document.createElement("div");
    let picker = document.createElement("select");
    let pName = document.createElement("p");

    pName.innerText = attrData[n]["name"];
    let unknownOpt = document.createElement("option");
    unknownOpt.value = "uk";
    unknownOpt.innerText = "Ismeretlen";
    picker.appendChild(unknownOpt);
    if(Object.keys(attrData).indexOf(id)!=-1){
        let phen = Object.values(attrData[id]["phenotypes"]);
        let blank = {};
        for(let i=0; i<phen.length; i+=1){
            if(!(phen[i] in blank)){
                let opt = document.createElement("option");
                opt.value = phen[i];
                opt.innerText = phen[i];
                picker.appendChild(opt);
                blank[phen[i]] = 0;
            }
        }
    }
    picker.addEventListener("change",attrSelected);
    pDiv.appendChild(pName);
    pDiv.appendChild(picker);
    pDiv.className = "attr";
    pDiv.id = id;

    return pDiv;
}

function PhenRow(phen="",gen=""){

    let phenDiv = document.createElement("div");
    phenDiv.className = "phenotypes";

    let phenInp = document.createElement("input");
    phenInp.type = "text";
    phenInp.placeholder = "fenotípus";
    phenInp.value = phen;
    
    let genInp = document.createElement("input");
    genInp.type = "text";
    genInp.placeholder = "genotípus";
    genInp.value = gen;

    let phenDel = document.createElement("button");
    phenDel.innerText = "törlés";
    phenDel.setAttribute("class","delButt")
    phenDel.addEventListener("click",removeAttrElement);

    let newLine = document.createElement("br");
    
    phenDiv.appendChild(phenInp);
    phenDiv.appendChild(genInp);
    phenDiv.appendChild(phenDel);
    phenDiv.appendChild(newLine);

    return phenDiv;
}

function AttrDiv(name="",attrD=[]){

    let aDiv = document.createElement("div");

    let nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "tulajdonság neve";
    nameInput.value = name;
    nameInput.className = "attrName";

    let delButton = document.createElement("button");
    delButton.innerText = "törlés";
    delButton.setAttribute("class","delButt")
    delButton.addEventListener("click",removeAttrElement);

    //console.log(attrD);

    aDiv.appendChild(nameInput);
    aDiv.appendChild(delButton);

    for(let i=0; i<attrD.length; i+=1){

        let phenR = PhenRow(attrD[i][1],attrD[i][0]);

        aDiv.appendChild(phenR);
    }

    /*
    let newPhenInp = document.createElement("input");
    newPhenInp.type = "text";
    newPhenInp.placeholder = "új fenotípus";
    newPhenInp.className = "newPhenInp";

    let newGenInp = document.createElement("input");
    newGenInp.type = "text";
    newGenInp.placeholder = "genotípus";
    newGenInp.className = "newGenInp";
    */

    let newPhenAdd = document.createElement("button");
    newPhenAdd.innerText = "+";
    newPhenAdd.addEventListener("click",newPhenRow);
    newPhenAdd.className = "newPhenAdd";
    

    let newLine = document.createElement("br");

    //aDiv.appendChild(newPhenInp);
    //aDiv.appendChild(newGenInp);
    aDiv.appendChild(newPhenAdd);
    aDiv.appendChild(newLine);

    aDiv.className = "attr";

    return aDiv;
}



function updateAttrForm(){
    let attrCheckboxesN = attrForm.childNodes;
    let delCheckboxes = [];
    for(let i=0; i<attrCheckboxesN.length; i+=1){
        if(attrCheckboxesN[i] && attrCheckboxesN[i].nodeType == 1){
            delCheckboxes.push(attrCheckboxesN[i]);
        }
    }
    for(let i=0; i<delCheckboxes.length; i+=1){
        //console.log(delCheckboxes[i]);
        delCheckboxes[i].remove();
    }
    let attrNames = Object.keys(attrData);
    for(let i=0; i<attrNames.length; i+=1){
        let attrCheckbox = document.createElement("input");
        attrCheckbox.type = "checkbox";
        attrCheckbox.id = attrNames[i];
        attrCheckbox.name = attrNames[i];
        attrForm.appendChild(attrCheckbox);
        
        let attrLabel = document.createElement("label");
        attrLabel.for = attrNames[i];
        attrLabel.innerText = attrData[attrNames[i]]["name"];
        attrForm.appendChild(attrLabel);

        let newLine = document.createElement("br");
        attrForm.appendChild(newLine);
    }
    attributeFormChanged();
}

function updateAttrDisplay(){

    //console.log(attrCheckboxes);
    for(let i=0; i<attrCheckboxes.length; i+=1){
        if(attrCheckboxes[i][1]){
            for(let j=0; j<nodes.length; j+=1){
                //console.log(nodeData[nodes[j].id]);
                if(!(attrCheckboxes[i][0] in nodeData[nodes[j].id])){
                    nodeData[nodes[j].id][attrCheckboxes[i][0]] = "uk";
                }
                let attrDiv = null;
                for(let k=0; k<nodes[j].childNodes.length; k+=1){
                    if(nodes[j].childNodes[k].id == attrCheckboxes[i][0]){
                        attrDiv = nodes[j].childNodes[k];
                    }
                }
                if(attrDiv){
                    nodeData[nodes[j].id][attrCheckboxes[i][0]] = attrDiv.childNodes[1].value;
                    //console.log(nodeData);
                }
            }
        }
    }
    //console.log(nodeData);

    for(let i=0; i<attrInput.length; i+=1){
        attrInput[i].remove();
    }
    attrInput = [];

    for(let i=0; i<attrCheckboxes.length; i+=1){
        if(attrCheckboxes[i][1]){
            for(let j=0; j<nodes.length; j+=1){
                //console.log(attrData,attrCheckboxes[i][0]);
                let pDiv = attrPicker(attrCheckboxes[i][0],attrCheckboxes[i][0]);
                nodes[j].appendChild(pDiv);
                attrInput.push(pDiv);
                if(attrCheckboxes[i][0] in nodeData[nodes[j].id]){
                    pDiv.childNodes[1].value = nodeData[nodes[j].id][attrCheckboxes[i][0]];
                }
            }
        }/*else{
            for(let j=0; j<nodes.length; j+=1){
                if(attrCheckboxes[i][0] in nodeData[nodes[j].id]){
                    delete nodeData[nodes[j].id][attrCheckboxes[i][0]];
                }
            }
        }*/
    }
}

function updateAttrOverlay(){
    let attrDivs = attrList.childNodes;
    let delDivs = [];
    for(let i=0; i<attrDivs.length; i+=1){
        if(attrDivs[i] && attrDivs[i].className == "attr"){
            delDivs.push(attrDivs[i]);
        }
    }
    for(let i=0; i<delDivs.length; i+=1){
        delDivs[i].remove();
    }

    let attrNames = Object.keys(attrData);
    for(let i=0; i<attrNames.length; i+=1){
        let attrD = [];
        let attrGen = Object.keys(attrData[attrNames[i]]["phenotypes"]);
        for(let j=0; j<attrGen.length; j+=1){
            let attrDL = [attrGen[j],attrData[attrNames[i]]["phenotypes"][attrGen[j]]];
            attrD.push(attrDL);
        }
        attrList.appendChild(AttrDiv(attrData[attrNames[i]]["name"],attrD));
        //console.log(attrD);
    }
}



function newAttrDiv(){

    let baseAttrName = baseAttr[attrTypeSelect.value]["name"];
    let baseAttrGenPhen = [];
    let baseAttrGen = Object.keys(baseAttr[attrTypeSelect.value]["phenotypes"]);
    for(let i=0; i<baseAttrGen.length; i+=1){
        baseAttrGenPhen.push([baseAttrGen[i],baseAttr[attrTypeSelect.value]["phenotypes"][baseAttrGen[i]]]);
    }

    let aDiv = AttrDiv(baseAttrName,baseAttrGenPhen);
    attrList.appendChild(aDiv);
}

function newPhenRow(event){
    let aDiv = event.target.parentElement;
    //let newPhenInp = null;
    let phen = "fenotípus";
    let gen = "AA";
    //console.log(aDiv.childNodes);
    /*
    for(let i=0; i<aDiv.childNodes.length; i+=1){
        if(aDiv.childNodes[i].className == "newPhenInp"){
            newPhenInp = aDiv.childNodes[i];
            if(aDiv.childNodes[i].value != ""){
                phen = aDiv.childNodes[i].value;
            }
        }
        if(aDiv.childNodes[i].className == "newGenInp"){
            if(aDiv.childNodes[i].value != ""){
                gen = aDiv.childNodes[i].value;
            }
        }
    }
    */
    let phenR = PhenRow(phen,gen);
    //console.log(newPhenInp);
    aDiv.insertBefore(phenR,event.target);
}

function removeAttrElement(event){
    let attrEl = event.target.parentElement;
    attrEl.remove();
}



function openAttributes(){
    updateAttrOverlay();
    attrOverlay.style.display = "block";
    //toolDiv.style.display = "none";
    
}

function closeAttributes(){
    attrOverlay.style.display = "none";
    toolDiv.style.display = "block";
    let attrNames = document.getElementsByClassName("attrName");
    let newAttrData = {};
    for(let i=0; i<attrNames.length; i+=1){
        let attrNP = attrNames[i].parentElement;
        let phenData = {};
        let rawG = "";
        for(let j=0; j<attrNP.childNodes.length; j+=1){
            if(attrNP.childNodes[j].className == "phenotypes"){
                let genotype = attrNP.childNodes[j].childNodes[1].value;
                let phenotype = attrNP.childNodes[j].childNodes[0].value;
                phenData[genotype] = phenotype;
                for(let k=0; k<genotype.length; k+=1){
                    if(!rawG.includes(genotype[k])){
                        rawG += genotype[k];
                    }
                }
            }
        }
        if(attrNames[i].value!=""){
            newAttrData["t_"+String(i)] = {
                "name":attrNames[i].value,
                "phenotypes":phenData,
                "rawGene":rawG
            };
        }else{
            newAttrData["t_"+String(i)] = {
                "name":"t_"+String(i),
                "phenotypes":phenData,
                "rawGene":rawG
            };
        }
    }
    attrData = newAttrData;
    updateAttrForm();
}



function attributeFormChanged(){
    let checkboxes = [];

    for(let i=0; i<attrForm.childNodes.length; i+=1){
        if(attrForm.childNodes[i].tagName == "INPUT"){
            checkboxes.push([attrForm.childNodes[i].name,attrForm.childNodes[i].checked]);
        }
    }

    attrCheckboxes = checkboxes;
    updateAttrDisplay();
}

function attrSelected(event){
    let ind = event.target.selectedIndex;
    let phen = event.target.childNodes[ind].value;
    let attrId = event.target.parentElement.id;
    let nId = event.target.parentElement.parentElement.id;
    if(nId in nodeData){
        nodeData[nId][attrId] = phen;
        
    }
    //console.log(nodeData);
}