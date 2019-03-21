function getCleanClass(variable) {
    return {
        "name": variable.name,
        "id": variable.id,
        "value": variable.value,
        "duration": variable.duration,
        "section": variable.section,
        "weight": variable.weight
    };
}
function getCleanClasses(schedule, classes) {
    var cleanClasses = [], i;
    for (i = 0; i < classes.length; i++) {
        cleanClasses.push(getCleanClass(schedule.variables[classes[i].id])); 
    }
    return cleanClasses;
}
function getCleanJSON(schedule, teachers, students) {
  // Create clean JSON
  var cleanJSON = {
      "days": days,
      "blocks": blocks,
      "classes": [],
      "teachers": [],
      "students": []
  }, variable;
  cleanJSON.classes = getCleanClasses(schedule, schedule.variables);
  for (i = 0; i < teachers.length; i++) {
    cleanJSON.teachers.push({
        "name": teachers[i].name,
        "classes": getCleanClasses(schedule, teachers[i].classes)
    });
  }
  for (i = 0; i < students.length; i++) {
    cleanJSON.students.push({
        "name": students[i].name,
        "grade": students[i].grade,
        "classes": getCleanClasses(schedule, students[i].classes)
    });
  }
  return JSON.stringify(cleanJSON);
}

function getScheduleFromJSON(json) {
    var s = new CSP(variables, constraints, constraintsByVariable),
        classes = JSON.parse(json).classes;
    classes.forEach( (c, index) => {
        s.variables[index].value = c.value;
    });
    return s;
}



function studentIndexOf(student, varA, varB) {
    var varAIn = false, varBIn = false;
    for (var i = 0; i < student.classes.length; i++) {
        if (student.classes[i].id === varA.id) {
            varAIn = true;
        }
        if (student.classes[i].id === varB.id) {
            varBIn = true;
        }
    }
    return varAIn && varBIn;
}
function peopleInBoth(varA, varB) {
    var people = [];
    for (var i = 0; i < students.length; i++) {
        if (studentIndexOf(students[i], varA, varB)) {
            people.push(students[i]);
        }
    }
    for (var i = 0; i < teachers.length; i++) {
        if (studentIndexOf(teachers[i], varA, varB)) {
            people.push(teachers[i]);
        }
    }
    return people;
}

var domain = [];
for (var i = 1; i <= blocks * days; i++) {
    domain.push(i);
}

var csp;

function initCSP() {
    readClasses();
    readStudentsAndTeachers();

    var vars = [];
    for (var i = 0; i < variables.length; i++) {
        vars.push(new Variable(variables[i].name, domain, variables[i].duration, variables[i].capacity, variables[i].weight));
        vars[i].id = parseInt(i);
    }

    var constraints = [], people, weight, i, j;
    for (i = 0; i < vars.length; i++) {
        for (j = i + 1; j < vars.length; j++) {
            people = peopleInBoth(vars[i], vars[j]);
            if (people.length > 0) {
                weight = vars[i].weight * vars[j].weight;
                for (var person = 0; person < people.length; person++) {
                    weight *= people[person].weight;
                }
                constraints.push(new BinaryConstraint(vars[i].name + " --/-- " + vars[j].name, vars[i], vars[j], differentConstraint, weight));
            }
        }
    }
    for (var i = 0; i < vars.length; i++) {
        constraints.push(new UnaryConstraint(vars[i].name + " Day Constraint", vars[i], dayConstraint, 1));
    }
    constraints = getBothDirections(constraints);

    csp = new CSP(vars, constraints);
    csp.initUnassociatedConstraints();
    AC3(csp);

    /*********/
    csp.maintainArcConsistency = false;
    csp.mostConstrainedVariable = false;
    /*********/
}

/*
var domain = [];
for (var i = 1; i <= blocks * days; i++) {
    domain.push(i);
}

var variables = [new Variable("Calculus", domain, 3), new Variable("English", domain)];
for (var i = 0; i < 60; i++) {
    variables.push(new Variable("Class #" + i, domain, Math.floor(Math.random()*3 + 1) ));
}
var constraints = [];
for (var i = 0; i < variables.length; i++) {
    for (var j = i + 1; j < variables.length; j++) {
        if (Math.random() < 0.5) {
            continue;
        }
        constraints.push(new BinaryConstraint(variables[i].name + " --/-- " + variables[j].name, variables[i], variables[j], differentConstraint(variables[i], variables[j]), 1));
    }
}
for (var i = 0; i < variables.length; i++) {
    constraints.push(new UnaryConstraint(variables[i].name + " Day Constraint", variables[i], dayConstraint(variables[i]), 1));
}
constraints = getBothDirections(constraints);

var csp = new CSP(variables, constraints);
console.log(csp);
// console.log(backtrackingSearch(csp));
*/

/*
var A = new Variable("A", [1, 2]),
    B = new Variable("B", [3]),
    C = new Variable("C", [1, 3]);
var fAB = new BinaryConstraint("A != B", A, B, function() { return A.value == B.value }.bind(this));
var fAC = new BinaryConstraint("A != C", A, C, function() { return A.value == C.value }.bind(this));
var fBC = new BinaryConstraint("B != C", B, C, function() { return B.value == C.value }.bind(this));
var constraints = getBothDirections([fAB, fAC, fBC]);
var csp = new CSP([A, B, C], constraints);
AC3(csp);
console.log(csp);
*/

document.getElementById("classes").innerHTML = "IL5 Studio: 0.9 1 2 3 1000000000\nIL6 Studio: 0.9 1 2 3 1000000000\nMS Math: 0.9 1 3 1 20\nPre-Algebra: 0.9 2 1 2 20\nMath I: 0.9 2 1 2 20\nMath II: 0.9 2 1 2 20\nMath III: 0.9 1 2 2 20\nCalculus: 0.9 1 2 2 20\nMS English: 0.5 3 2 2 20\nUS English: 0.5 2 2 2 20\nGeography: 0.5 3 2 2 20\nUS History: 0.5 2 2 2 20\nInt Science: 0.5 3 2 2 20\nBiology: 0.5 1 2 2 20\nAdv Biology: 0.5 1 2 2 15\nPhysics: 0.5 1 2 2 20\nCS I: 0.9 2 1 1 20\nCS II: 0.9 3 1 1 20\nJava I: 0.9 1 2 2 20\nJava II: 0.9 1 2 2 20\nArt I: 0.95 6 1 1 20\nArt II: 0.95 1 1 1 20\nSpanish I: 0.9 1 2 2 20\nSpanish II: 0.9 1 2 2 20\nSpanish III: 0.9 1 2 2 20\nSpanish IV: 0.9 1 2 2 20\nOW: 0.9 7 1 1 25";
document.getElementById("teachers").innerHTML = "Tristen templastname 0 0\nJohn templastname 0.1 1\nMarcy templastname 0.1 2,3,3,4,4,5,5,6,7\nBrett templastname 0.1 8,8,8,9,9\nDerek templastname 0.1 10,10,10,11,11\nMegan templastname 0.1 12,12,12,13,14\nDenise templastname 0.1 15,16,16,17,17,17,18,19\nSaloni templastname 0.1 20,20,20,20,20,20,21\nRaquel templastname 0.1 22,23,24,25\nDevin templastname 0.1 26,26,26,26,26,26,26";
document.getElementById("students").innerHTML = "Timothy Chien IL5 1 0,10,11,20,14,18,8,5,26\nKabir Goklani IL5 1 0,10,20,4,12,23,8,26,17\nAdrian Panezic IL5 1 0,12,20,3,26,8,10,17\nPeter Watson IL5 1 0,8,3,20,17,12,10,26\nJasper Johnson IL5 1 0,8,20,3,26,12,10,16\nMegan Chien IL5 1 0,8,12,3,10,20,26,17\nSoren Williams IL5 1 0,10,3,20,17,12,8,26\nBharat Saiju IL5 1 0,11,6,14,9,20,26,18\nMary Beeler IL5 1 0,10,20,4,12,8,26,17\nJANE BEELER IL6 1 1,13,9,6,26,11,21,17\nDILAN KUDVA IL6 1 1,13,11,6,9,22,26,17\nLAKER NEWHOUSE IL6 1 1,9,19,22,14,11,26\nMARIA MAHERAS IL6 1 1,13,9,26,11,5,21,17\nISABELLA TANEJA IL6 1 1,13,9,17,11,5,21,26\nNICHOLAS VERZIC IL6 1 1,15,11,19,26,9,7\nCALEB CHOI IL6 1 1,9,19,22,14,11,7,26\nABHINAV VEDATI IL6 1 1,15,9,6,26,11,19\nSOHM DUBEY IL6 1 1,11,19,22,14,9,26,5,20\nANJELI MAYORAZ IL6 1 1,15,9,26,18,11,20,5\nNIKHIL GARGEYA IL6 1 1,15,9,19,26,11,23,20,7\nARJUN CHOPRA IL6 1 1,15,9,6,26,18,11,23,20\nMeghna Chopra IL5 1 0,10,3,20,16,26,12,8\nARUNA GUABA IL6 1 1,11,15,9,20,22,26,5\nANGELICA ZHUANG IL6 1 1,13,11,26,9,5,21,18\nKATARINA FALLON IL6 1 1,15,9,17,11,5,21,26\nSOPHIE FAN IL6 1 1,9,6,14,18,11,26,23\nROBERT BELIVEAU IL6 1 1,13,11,19,26,9,5\nSIMON CAPPER IL6 1 1,13,11,26,9,5,16,20\nTRISTAN PERRY IL6 1 1,9,14,11,20,7,26,17\nVIVEK SUNKAM IL6 1 1,9,19,22,14,11,7,26\nSHIRA SHEPPARD IL6 1 1,15,11,17,9,20,22,26,5\nVIVEK PUNN IL6 1 1,11,14,9,5,16,26,20\nMARGOT HALL IL6 1 1,15,11,17,9,20,22,26,5\nERIC COHAN IL6 1 1,13,9,6,26,11,20\nETHAN CHANG IL6 1 1,13,9,26,11,20,5,16\nAARON KWOK IL6 1 1,15,11,16,26,9,20,5\nMILLER DAYTON IL6 1 1,13,9,16,26,11,20,5\nSarah Fernandes IL5 1 0,10,4,26,12,8,16\nMISHAL JUNAID IL6 1 1,13,11,4,9,26,21,17\nAlisha Junaid IL5 1 0,8,12,3,10,26,20,17\nAmeera Hoodbhoy IL5 1 0,8,3,12,10,26,17,20\nJay Bhan IL5 1 0,10,26,12,8,5,20,17\nParinita Thapliyal IL5 1 0,10,2,12,8,16,26\nMatthias Fallon IL5 1 0,10,12,3,8,26,20\nEdan Cho IL5 1 0,12,17,26,10,8,5\nAryan Prodduturri IL5 1 0,13,9,26,18,5,11,20\nKepler Boyce IL5 1 0,15,9,10,26,19,20,7\nJay Warrier IL5 1 0,8,12,19,4,26,10,20\nMadeline Wang IL5 1 0,12,3,8,26,10,20,17\nPranav Tatavarti IL5 1 0,10,12,4,26,8,17,20\nLeia MacAskill IL5 1 0,8,2,17,26,12,10,20\nLogan MacAskill IL5 1 0,10,3,19,12,26,8,20\nAvril Cierniak IL5 1 0,15,20,26,18,10,8,5\nAmartya Iyer IL5 1 0,26,18,12,10,8,5\nPARTH IYER IL6 1 1,15,11,19,9,26,7\nNeil Devnani IL5 1 0,13,26,9,10,5,20,17\nGurshan Jolly IL5 1 0,8,12,4,26,10,20,17\nStella Petzova IL5 1 0,8,16,12,10,20,26\nHolly Thompson IL5 1 0,10,3,16,20,26,12,8\nLeo Spalter IL5 1 0,8,26,12,10,16\nAvani Sundaresan IL5 1 0,10,16,26,12,20,8\nCharles Kunz IL5 1 0,3,12,8,26,10,17,20\nMeher Halder IL5 1 0,10,20,3,26,12,8,16\nAthena Cho IL5 1 0,8,3,16,26,12,20,10\nSita Vemuri IL5 1 0,12,2,16,26,8,10,20\nSharanya Nemane IL5 1 0,3,20,17,12,8,10,26\nEegan Ram IL5 1 0,10,16,26,8,5,20\nRenn Blanco IL5 1 0,10,2,16,26,12,20,8\nVarin Sikka IL5 1 0,8,2,16,26,12,10,20\nAdarsh Krishnan IL5 1 0,10,12,26,8,5,20,17\nIshansh Kwatra IL5 1 0,8,20,4,12,26,10,17\nSophia DeMedeiros IL5 1 0,2,17,12,8,10,26,20";

initCSP();
