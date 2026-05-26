export class StudentStartDto {
  fullname: string;
  email: string;

  constructor(data: any) {
    this.fullname = data.fullname;
    this.email    = data.email;
  }

  validate(): void {
    if (!this.fullname) throw new Error('fullname is required');
    if (!this.email)    throw new Error('email is required');
  }
}