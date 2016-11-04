# Default eager loading for Objection.js

This project aims to showcase an extension to [Objection][1] which provides a way to define **default eager loading** rules per model.

## Example

```
Person.defaultEager = "[pets, father, mother]";

// Person.defaultEagerFilters = ...
// Person.defaultEagerMaxDepth = ...

Person
  .query()
  .then(function(people) {
    people.forEach(function(person) {
      // Here, the relations 'pets', 'father' and 'mother' are
      // already fetched from db thanks to default eager loading.
      console.log(person + " has " + person.pets.length + " pets.");
    });
  });
```


## Installation

```
npm install
knex migrate:latest
knex seed:run
```

## Run

```
npm start
```

[1]: http://vincit.github.io/objection.js/
