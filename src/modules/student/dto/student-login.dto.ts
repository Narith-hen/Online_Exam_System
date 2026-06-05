export class StudentLoginDto {
  fullname: string;
  class:    string;
  email:    string;

  constructor(body: any) {
    if (!body.fullname || !body.fullname.trim())
      throw new Error('fullname is required');
    if (!body.class || !body.class.trim())
      throw new Error('class is required');
    if (!body.email || !body.email.trim())
      throw new Error('email is required');

    const fullname = body.fullname.trim();
    if (fullname.length < 2)
      throw new Error('fullname must be at least 2 characters');
    if (fullname.length > 100)
      throw new Error('fullname must not exceed 100 characters');
    if (/[0-9_.!?]/.test(fullname))
      throw new Error('fullname must not contain numbers, underscores, dots, !, or ?');
    if (!/^[a-zA-Z\s]+$/.test(fullname))
      throw new Error('fullname must contain only letters and spaces');

    const studentClass = body.class.trim();
    if (studentClass.length < 1)
      throw new Error('class is required');
    if (studentClass.length > 50)
      throw new Error('class must not exceed 50 characters');

    const email = body.email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email))
      throw new Error('email is invalid — use format like example@gmail.com');

    const [localPart, domain] = email.split('@');
    if (!domain || !domain.includes('.'))
      throw new Error('email domain is invalid — use format like example@gmail.com');
    if (domain.split('.').pop()!.length < 2)
      throw new Error('email domain extension is too short — use .com, .net, etc');
    if (localPart.length < 1)
      throw new Error('email local part is invalid');
    if (email.includes('..'))
      throw new Error('email must not contain consecutive dots');

    this.fullname = fullname;
    this.class    = studentClass;
    this.email    = email;
  }
}