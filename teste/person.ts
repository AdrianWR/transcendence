
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// The property "name" sets the table name. This is usually implied from the
// class name, however this can be overridden if needed.
@Entity({ name: "people" })
export class Person {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	fullname!: string;

	@Column()
	gender!: string;

	@Column()
	phone!: string;

	@Column()
	age!: number;

	@Column({ name: "created_at" })
	createdAt?: Date;
}
