"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const person_1 = require("./person");
const person_repository_1 = require("./person-repository");
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Initialize a connection pool against the database.
    const connection = yield (0, typeorm_1.createConnection)({
        type: "postgres",
        host: "postgres",
        port: 5432,
        username: "root",
        password: "imroot",
        database: "typeormdemo",
        entities: [person_1.Person],
    });
    const personRepository = connection.getCustomRepository(person_repository_1.PersonRepository);
    // Register a new person in the database by calling the repository.
    const newPerson = new person_1.Person();
    newPerson.fullname = "Jane Doe";
    newPerson.gender = "F";
    newPerson.phone = "5555555555";
    newPerson.age = 29;
    yield personRepository.save(newPerson);
    // Find the person we just saved to the database using the custom query
    // method we wrote in the person repository.
    const existingPerson = yield personRepository.findByName("Jane Doe");
    if (!existingPerson) {
        throw Error("Unable to find Jane Doe.");
    }
    // Change the person's full name.
    yield personRepository.updateName(existingPerson.id, "Jane Johnson");
    // Remove the person from the database.
    //await personRepository.remove(existingPerson);
    // Clean up our connection pool so we can exit.
    yield connection.close();
}))();
