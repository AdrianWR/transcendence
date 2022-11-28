import "reflect-metadata"

import { createConnection } from "typeorm";

import { Person } from "./person";
import { PersonRepository } from "./person-repository";

(async () => {
	  // Initialize a connection pool against the database.
	    const connection = await createConnection({
	    type: "postgres",
	    host: "postgres",
	    port: 5432,
	    username: "root",
	    password: "imroot",
	    database: "typeormdemo",
	    entities: [Person],
  });
const personRepository = connection.getCustomRepository(PersonRepository);

// Register a new person in the database by calling the repository.
const newPerson = new Person();
newPerson.fullname = "Jane Doe";
newPerson.gender = "F";
newPerson.phone = "5555555555";
newPerson.age = 29;
await personRepository.save(newPerson);

// Find the person we just saved to the database using the custom query
// method we wrote in the person repository.
const existingPerson = await personRepository.findByName("Jane Doe");
if (!existingPerson) {
	throw Error("Unable to find Jane Doe.");
}

// Change the person's full name.
await personRepository.updateName(existingPerson.id, "Jane Johnson");

// Remove the person from the database.
//await personRepository.remove(existingPerson);

// Clean up our connection pool so we can exit.
await connection.close();
})();
