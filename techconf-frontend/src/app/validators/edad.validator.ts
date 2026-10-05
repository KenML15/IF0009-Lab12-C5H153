import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function edadMinimaValidator(minima: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (valor === null || valor === '') {
      return null;
    }

    const edad = Number(valor);
    if (isNaN(edad) || edad < minima) {
      return { menorDeEdad: { edadMinima: minima, edadActual: valor } };
    }

    return null;
  };
}