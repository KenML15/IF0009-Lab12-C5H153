import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule, FormBuilder, FormArray, Validators,
  AbstractControl, ValidationErrors, ValidatorFn
} from '@angular/forms';
import { CharlaService, Charla, Asistente } from '../../services/charla.service';
import { edadMinimaValidator } from '../../validators/edad.validator';


export const validarRangoFechas: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const inicio = control.get('fechaInicio')?.value;
  const fin = control.get('fechaFin')?.value;
  if (inicio && fin && new Date(fin) < new Date(inicio)) {
    return { fechasInvalidas: true };
  }
  return null;
};

@Component({
  selector: 'app-charla-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './charla-registro.component.html',
  styleUrl: './charla-registro.component.css'
})
export class CharlaRegistroComponent implements OnInit {
  private fb = inject(FormBuilder);
  private charlaService = inject(CharlaService);

  charlas = signal<Charla[]>([]);
  mensajeExito = signal('');



  registroForm = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    expositor: ['', [Validators.required]],
    nivel: ['Principiante', [Validators.required]],
    emailContacto: ['', [Validators.required, Validators.email]],
    fechaInicio: ['', [Validators.required]],
    fechaFin: ['', [Validators.required]],
    etiquetas: this.fb.array([this.fb.control('', Validators.required)])
  }, { validators: validarRangoFechas });

  ngOnInit(): void {
    this.cargarCharlas();
  }

  cargarCharlas() {
    this.charlaService.getCharlas().subscribe({
      next: (data) => this.charlas.set(data),
      error: (err) => console.error('Error al cargar las charlas', err)
    });
  }

  get etiquetasArray() {
    return this.registroForm.get('etiquetas') as FormArray;
  }

  agregarEtiqueta() {
    this.etiquetasArray.push(this.fb.control('', Validators.required));
  }

  removerEtiqueta(index: number) {
    if (this.etiquetasArray.length > 1) {
      this.etiquetasArray.removeAt(index);
    }
  }

  get tituloCtrl() { return this.registroForm.get('titulo'); }
  get expositorCtrl() { return this.registroForm.get('expositor'); }
  get emailCtrl() { return this.registroForm.get('emailContacto'); }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const nuevaCharla = this.registroForm.getRawValue() as Charla;

    this.charlaService.registrarCharla(nuevaCharla).subscribe({
      next: (res) => {
        this.mensajeExito.set('¡Charla registrada exitosamente!');
        this.charlas.update(lista => [...lista, res]);

        this.registroForm.reset({ nivel: 'Principiante' });
        while (this.etiquetasArray.length > 1) {
          this.etiquetasArray.removeAt(1);
        }
      },
      error: (err) => console.error(err)
    });
  }



  charlaSeleccionada = signal<number | null>(null); 
  mensajeInscripcion = signal('');
  errorInscripcion = signal('');


  inscripcionForm = this.fb.group({
    asistente: this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      edad: [null as number | null, [Validators.required, edadMinimaValidator(18)]]
    })
  });

  get asistenteGroup() { return this.inscripcionForm.get('asistente')!; }
  get nombreCtrl() { return this.inscripcionForm.get('asistente.nombre'); }
  get correoCtrl() { return this.inscripcionForm.get('asistente.correo'); }
  get edadCtrl() { return this.inscripcionForm.get('asistente.edad'); }


  toggleInscripcion(charlaId: number) {
    this.charlaSeleccionada.set(this.charlaSeleccionada() === charlaId ? null : charlaId);
    this.inscripcionForm.reset();
    this.mensajeInscripcion.set('');
    this.errorInscripcion.set('');
  }

  onInscribir(charla: Charla): void {
    if (this.inscripcionForm.invalid) {
      this.inscripcionForm.markAllAsTouched();
      return;
    }

    const asistente = this.asistenteGroup.getRawValue() as Asistente;

    this.charlaService.inscribirAsistente(charla.id!, asistente).subscribe({
      next: (nuevo) => {
        this.charlas.update(lista => lista.map(c =>
          c.id === charla.id
            ? { ...c, asistentes: [...(c.asistentes ?? []), nuevo] }
            : c
        ));
        this.mensajeInscripcion.set(`${nuevo.nombre} fue inscrito en "${charla.titulo}".`);
        this.charlaSeleccionada.set(null);
        this.inscripcionForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.errorInscripcion.set('No se pudo inscribir al asistente. Revise los datos.');
      }
    });
  }
}