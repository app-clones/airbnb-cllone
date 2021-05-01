import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    BeforeInsert
} from "typeorm";
import argon2 from "argon2";

@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", { length: 255 })
    email: string;

    @Column("text")
    password: string;

    @Column("boolean", { default: false })
    confirmed: boolean;

    @Column("boolean", { default: false })
    forgotPasswordLocked: boolean;

    @BeforeInsert()
    async hashPassword() {
        this.password = await argon2.hash(this.password);
    }
}
