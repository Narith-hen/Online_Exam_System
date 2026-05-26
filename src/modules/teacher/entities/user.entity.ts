import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('users')   // Make sure table name is correct
export class User {
    @PrimaryGeneratedColumn({ name: 'userId' })
    userId!: number;

    @Column({ name: 'username' })
    username!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ name: 'passwordHash' })
    passwordHash!: string;

    @Column({ name: 'roleId' })
    roleId!: string;        // or string if it's enum

    @Column({ name: 'isActive', default: true })
    isActive!: boolean;

    @Column({ name: 'createAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createAt!: Date;
}