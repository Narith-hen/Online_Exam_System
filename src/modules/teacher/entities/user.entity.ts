import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('users')   // Make sure table name is correct
export class User {
    @PrimaryColumn({ name: 'userId', type: 'char', length: 36 })
    userId!: string;

    @Column({ name: 'username' })
    username!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ name: 'passwordHash' })
    passwordHash!: string;

    @Column({ name: 'roleId' })
    roleId!: string;     

    @Column({ name: 'isActive', default: true })
    isActive!: boolean;

    @Column({ name: 'createAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createAt!: Date;
}
