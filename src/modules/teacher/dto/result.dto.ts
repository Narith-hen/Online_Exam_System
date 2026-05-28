// create-result.dto.ts
export interface ResultDto {
    examSessionId: string;
    studentId: string;
    totalScore: number;
    isPassed: boolean;
    gradedAt?: Date; 
}