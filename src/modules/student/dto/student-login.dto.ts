// dto/student-login.dto.ts
export class StudentLoginDto {
  fullname: string;
  class:    string;
  email:    string;

  constructor(body: any) {
    if (!body.fullname || !body.class || !body.email)
      throw new Error('fullname, class and email are required');
    this.fullname = body.fullname.trim();
    this.class    = body.class.trim();
    this.email    = body.email.trim().toLowerCase();
  }
}