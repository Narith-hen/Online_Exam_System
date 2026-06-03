import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('results')
export class Result {

    @PrimaryColumn({ name: 'resultId', type: 'char', length: 36 })
    resultId!: string;

    @Column({ name: 'examSessionId', type: 'char', length: 36 })
    examSessionId!: string;

    @Column({ name: 'studentId', type: 'int' })
    studentId!: number;

    @Column({ name: 'percentAge', type: 'decimal', precision: 5, scale: 2 })
    percentAge!: string;

    @Column({ name: 'totalScore', type: 'decimal', precision: 8, scale: 2 })
    totalScore!: string;

    @Column({ name: 'isPassed', type: 'tinyint' })
    isPassed!: boolean;

    @Column({ name: 'grade', type: 'varchar', length: 10 })
    grade!: string;

    @Column({ name: 'createAt', type: 'datetime' })
    createAt!: Date;
}
