"use strict";

var models = require(__dirname + "/models");

Object.keys(models).forEach(function(modelName) {
  var model = models[modelName];
  console.log("Default eager for " + modelName + " is " + model.defaultEager);
});

console.log("\nFetching all people...");

models.Person
  .query()
  .then(function (people) {
    console.log("");

    people.forEach(function(person){
      console.log(person.name + " has a level of addicition for pets of " + person.petAddicted());
    });

    process.exit(0);
  })
  .catch(function(err) {
    console.error(err);
    process.exit(1);
  });
