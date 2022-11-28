import { EntityRepository, Repository } from "typeorm";
import { Person } from "./person";

@EntityRepository(Person)
export class PersonRepository extends Repository<Person> {
	findByName(fullname: string) {
		return this.createQueryBuilder("people")
			.where("people.fullname = :fullname", { fullname })
			.getOne();
	}

	updateName(id: number, fullname: string) {
		return this.createQueryBuilder("people")
			.update()
			.set({ fullname: fullname })
			.where("people.id = :id", { id })
			.execute();
		}
}
