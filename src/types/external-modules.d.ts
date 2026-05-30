declare module 'class-validator' {
  export type ValidationError = any;
  export function validate(object: unknown): Promise<ValidationError[]>;

  export function IsString(): PropertyDecorator;
  export function IsNotEmpty(): PropertyDecorator;
  export function IsOptional(): PropertyDecorator;
  export function IsEmail(): PropertyDecorator;
  export function MinLength(min: number): PropertyDecorator;
  export function Length(min: number, max?: number): PropertyDecorator;
}

declare module 'class-transformer' {
  export function plainToInstance<T, V>(cls: new () => T, plain: V): T;
}

