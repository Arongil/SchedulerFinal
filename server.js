var express = require("express");
var app = express();

app.use(express.static("C:\\Users\\Laker\\Desktop\\Scheduler FINAL"));

app.listen("1234");
console.log("Working on 1234");
