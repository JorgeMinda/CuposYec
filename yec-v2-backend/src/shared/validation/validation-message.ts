import { MaxLength } from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { ValidationOptions } from 'class-validator/types/decorator/ValidationOptions';

export function isStringValidationOptions(validationOptions?: ValidationOptions) {
  return {
    message: 'La propiedad $property debe ser una cadena',
  };
}

export function minLengthValidationOptions(validationOptions?: ValidationOptions) {
  return {
    message: 'La propiedad $property debe ser mayor o igual a $constraint1 caracteres',
  };
}

export function isNotEmptyValidationOptions(validationOptions?: ValidationOptions) {
  return {
    message: 'La propiedad $property no debe estar vacío',
  };
}

export function isEmptyValidationOptions(validationOptions?: ValidationOptions) {
  return {
    message: 'La propiedad $property debe estar vacía',
  };
}

export function maxLengthValidationOptions(validationOptions?: ValidationOptions) {
  return {
    message: 'La propiedad $property debe ser menor o igual a $constraint1 caracteres',
  };
}

export function isEnumValidationOptions(validationOptions?: ValidationOptions) {
  return {
    message: 'La propiedad $property debe ser un valor de enum válido',
  };
}

export function isEmailValidationOptions(validationOptions?: ValidationOptions) {
  return {
    message: 'La propiedad $property debe ser un correo electrónico',
  };
}

export function isBooleanValidationOptions(validationOptions?: ValidationOptions) {
  return {
    message: 'La propiedad $property debe ser un valor booleano',
  };
}

export function isNumberValidationOptions(validationOptions?: ValidationOptions) {
  return {
    message: 'La propiedad $property debe ser un número',
  };
}

export function isDateValidationOptions(validationOptions?: ValidationOptions) {
  return {
    message: 'La propiedad $property debe ser una fecha válida',
  };
}

export function isUrlValidationOptions(validationOptions?: ValidationOptions) {
  return {
    message: 'La propiedad $property debe ser una url válida',
  };
}

export function minValidationOptions(validationOptions?: ValidationOptions) {
  return {
    message: 'La propiedad $property debe contener como valor mímino $constraint1',
  };
}

export function maxValidationOptions(validationOptions?: ValidationOptions) {
  return {
    message: 'La propiedad $property debe contener como valor máximo $constraint1',
  };
}
