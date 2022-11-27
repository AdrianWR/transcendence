"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonRepository = void 0;
const typeorm_1 = require("typeorm");
const person_1 = require("./person");
let PersonRepository = class PersonRepository extends typeorm_1.Repository {
    findByName(fullname) {
        return this.createQueryBuilder("people")
            .where("people.fullname = :fullname", { fullname })
            .getOne();
    }
    updateName(id, fullname) {
        return this.createQueryBuilder("people")
            .update()
            .set({ fullname: fullname })
            .where("people.id = :id", { id })
            .execute();
    }
};
PersonRepository = __decorate([
    (0, typeorm_1.EntityRepository)(person_1.Person)
], PersonRepository);
exports.PersonRepository = PersonRepository;
