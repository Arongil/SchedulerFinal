var classId = 0;

class Class {

    constructor(name, subject, section, duration, capacity, weight) {
        this.name = name;
        this.subject = subject;
        this.section = section;
        this.id = classId++;
        this.duration = duration;
        this.capacity = capacity;
        this.weight = weight;
        this.roster = [];
    }

    getRoster() {
        var roster = "";
        for (var i = 0; i < this.roster.length; i++) {
            roster += this.roster[i] + (i < this.roster.length - 1 ? ", " : "");
        }
        return roster;
    }

}

var studentId = 0;

class Student {

    constructor(name, grade, weight, domain = fullTimeDomain) {
        this.name = name;
        this.id = studentId++;
        this.grade = grade;
        this.weight = weight;
        this.domain = domain;
    }

    getClassesAttending() {
        
    }

}
