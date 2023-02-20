//Ez a script kezeli a genetikai számításokat

//rendez genotípusokat abc szerint
function order(genes) {
    let l = genes.split(' ').length;
    for (let i=0; i<l; i++) {
        if (genes.charCodeAt(i*3)>genes.charCodeAt(i*3+1)) {
            genes=genes.slice(0,i*3)+genes[i*3+1]+genes[i*3]+genes.slice(i*3+2,genes.length);
        }
    }
    return genes;
}
//kiszámítja egy kapcsolathoz és permutációhoz tartozó valószínűséget
function chance(child,mother,father) {
    let childl=child.split(' ');
    let motherl=mother.split(' ');
    let fatherl=father.split(' ');
    let male=(child[0]=="XY");
    let chance=1.0;
    for (let i=0; i<childl.length; i++) {
        let counter=0;
        
        if (order(motherl[i][0]+fatherl[i][0])==childl[i]) counter++;
        if (order(motherl[i][0]+fatherl[i][1])==childl[i]) counter++;
        if (order(motherl[i][1]+fatherl[i][0])==childl[i]) counter++;
        if (order(motherl[i][1]+fatherl[i][1])==childl[i]) counter++;
        chance*=(counter/4.0);
    }
    return chance;
}
//előállítja a lehetséges permutációkat a nyers gén defínícióból
function generatePermutations(rawGene) {
    let rawGeneList=rawGene.split(' ');
    //console.log(rawGene);
    let permutationsList=[];
    for (let i=0; i<rawGeneList[0].length; i++) {
        for (let j=0; j<rawGeneList[0].length; j++) {
            if (rawGeneList[0][i]!='Y') permutationsList.push(rawGeneList[0][i]+rawGeneList[0][j]);
        }
    }
    if (rawGeneList.length==1) {
        return permutationsList;
    } else {
        let perms = generatePermutations(rawGene.slice(3,rawGene.length));
        let totalPermsList = [];
        for (let i=0; i<permutationsList.length; i++) {
            for (let j=0; j<perms.length; j++) {
                totalPermsList.push(permutationsList[i]+" "+perms[j]);
            }
        }
        return totalPermsList;
    }
    return permutationsList;
}
//fenotípus-kezelést elősegítő fügvények
function getPhenotype(gene,phenotypeMap) {
    if (gene[0]=='X') gene=gene.slice(3,gene.length);
    for (let i=0; i<phenotypeMap.length; i++) {
        if (gene==phenotypeMap[i][0]) return phenotypeMap[i][1];
    }
    return "Unknown";
}
function getPhenotypeI(phenotype, phenotypeList) {
    for (let i=0; i<phenotypeList.length; i++) {
        if (phenotype==phenotypeList[i]) return i;
    }
    return -1;
}
//a permutációkban az ismétlődések kezelése
function createOrderedPerms(perms) {
	let out=[];
	for (let i=0; i<perms.length; i++) {
		let placeholder=order(perms[i]);
		let found=false;
		for (let j=0; j<out.length; j++) {
			if (out[j]==placeholder) found=true;
		}
		if (!found) {
			out.push(placeholder);
		}
	}
	return out;
}

function calculateTotalTreeChances(relations, phenotypes, phenotypeMap, rawGeneDefinition) {
	//nemenkénti lehetséges permutációk előállítása
    let perms = createOrderedPerms(generatePermutations(rawGeneDefinition));
	let femaleperms = Array.from(perms);
	let maleperms = Array.from(perms);
	for (let i=0; i<maleperms.length; i++) {
		maleperms[i]="XY "+maleperms[i];
	}
	for (let i=0; i<femaleperms.length; i++) {
		femaleperms[i]="XX "+femaleperms[i];
	}
    let genderedPerms = createOrderedPerms(generatePermutations("XY "+rawGeneDefinition));
	//permutációk kezelésének előkészítése
    let counters = [];
    let permutations = [];
    for (let i=0; i<phenotypes.length; i++) {
        counters.push(0);
        if (phenotypes[i][0]=="Unknown") {
            permutations.push(genderedPerms);
        } else {
            if (phenotypes[i][0]=="Male") {
				permutations.push(maleperms);
			} else {
				permutations.push(femaleperms);
			}
        }
    }
	//fenotípusok kezelésének előkészítése
    let phenotypeList = [];
    let phenotypeChance = [];
    for (let i=0; i<phenotypeMap.length; i++) {
        let found=false;
        for (let j=i; j<phenotypeList.length; j++) {
            if (phenotypeList[j]==phenotypeMap[i][1]) {
                found=true;
            }
        }
        if (!found) {
            phenotypeList.push(phenotypeMap[i][1]);
            phenotypeChance.push(0);
        }
    }
    let phenotypeChances = [];
    for (let i=0; i<phenotypes.length; i++) {
        phenotypeChances.push(phenotypeChance.slice());
    }

    let good=true;
	//permutácinkénti végigiterálás
    while (good) {
		//kapcsolatonkénti végigiterálás
		let currentChance=1;
        for (let i=0; i<relations.length; i++) {
            let relation=relations[i].split(' ');
            
            let motherGenotype=order(permutations[parseInt(relation[1])][counters[parseInt(relation[1])]]);
            let fatherGenotype=order(permutations[parseInt(relation[2])][counters[parseInt(relation[2])]]);
            let childGenotype=order(permutations[parseInt(relation[0])][counters[parseInt(relation[0])]]);
            let motherPhenotype=getPhenotype(motherGenotype,phenotypeMap);
            let fatherPhenotype=getPhenotype(fatherGenotype,phenotypeMap);
            let childPhenotype=getPhenotype(childGenotype,phenotypeMap);
            currentChance *= chance(childGenotype,motherGenotype,fatherGenotype);
            if (motherPhenotype!=phenotypes[parseInt(relation[1])][1]&&phenotypes[parseInt(relation[1])][1]!="Unknown") currentChance=0;
            if (fatherPhenotype!=phenotypes[parseInt(relation[2])][1]&&phenotypes[parseInt(relation[2])][1]!="Unknown") currentChance=0;
            if (childPhenotype!=phenotypes[parseInt(relation[0])][1]&&phenotypes[parseInt(relation[0])][1]!="Unknown") currentChance=0;
            if (motherGenotype.split(' ')[0]!="XX"&&phenotypes[parseInt(relation[1])][0]!="Unkown") currentChance=0;
            if (fatherGenotype.split(' ')[0]!="XY"&&phenotypes[parseInt(relation[2])][0]!="Unkown") currentChance=0;
            if (((childGenotype.split(' ')[0]!="XY"&&phenotypes[parseInt(relation[0])][0]=="Male")||(childGenotype.split(' ')[0]!="XX"&&phenotypes[parseInt(relation[0])][0]=="Female"))&&phenotypes[parseInt(relation[0])][0]!="Unkown") currentChance=0;
            console.log(childGenotype+"   "+motherGenotype+"   "+fatherGenotype+"   "+currentChance);
        }
		//valószínűség rögzítése
		for (let i=0; i<phenotypeChances.length; i++) {
			phenotypeChances[i][getPhenotypeI(getPhenotype(order(permutations[i][counters[i]]),phenotypeMap),phenotypeList)]+=currentChance;
			
		}
		//permutáció kezelése
        let parGood=true;
        for (let i=0; i<counters.length; i++) {
            if (counters[i]!=permutations[i].length-1) parGood=false;
        }
        if (parGood) good=false;
        counters[0]++;
        for (let i=1; i<counters.length; i++) {
            if (counters[i-1]==permutations[i-1].length) {
                counters[i-1]=0;
                counters[i]++;
            }
        }
        
    }
    console.log(phenotypeChances);
    return phenotypeChances;
}
//ezek teszbemenetek
let relationsV = ["0 1 2"];
let phenotypesV = [["Unknown", "Unknown"],["Female", "Unknown"],["Male", "Unknown"]];
let phenotypeMapV = [["AA","very ill"], ["AB", "bit ill"], ["BB", "bit ill"]];
let rawGeneDefinitionV = "AB";

calculateTotalTreeChances(relationsV,phenotypesV, phenotypeMapV, rawGeneDefinitionV);
console.log(order("BA DC"));