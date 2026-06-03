declare module 'class-validator' {
  export type ValidationError = any;
  export function validate(object: unknown): Promise<ValidationError[]>;

  export function IsString(): PropertyDecorator;
  export function IsNotEmpty(): PropertyDecorator;
  export function IsOptional(): PropertyDecorator;
  export function IsEmail(): PropertyDecorator;
  export function IsArray(): PropertyDecorator;
  export function IsInt(): PropertyDecorator;
  export function IsBoolean(): PropertyDecorator;
  export function IsDateString(): PropertyDecorator;
  export function ValidateNested(options?: { each?: boolean }): PropertyDecorator;
  export function IsIn(values: readonly unknown[]): PropertyDecorator;
  export function Min(min: number): PropertyDecorator;
  export function MaxLength(max: number): PropertyDecorator;
  export function ArrayMinSize(min: number): PropertyDecorator;
  export function ArrayMaxSize(max: number): PropertyDecorator;
  export function MinLength(min: number): PropertyDecorator;
  export function Length(min: number, max?: number): PropertyDecorator;
}

declare module 'class-transformer' {
  export function plainToInstance<T, V>(cls: new () => T, plain: V): T;
  export function Type(typeFunction: () => Function): PropertyDecorator;
}

