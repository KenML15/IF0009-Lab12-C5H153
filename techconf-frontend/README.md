# IF0009 - Laboratorio 12: TechConf Full-Stack

**Estudiante:** [Su nombre completo]
**Carné:** C5H153
**Curso:** IF0009 - Desarrollo de Software IV
**Profesor:** Mag. Jonathan Granados C.
**Semestre:** II-2026

Sistema de registro de charlas para una conferencia tecnológica (TechConf), extendido con
inscripción de asistentes mediante una relación 1:N en Spring Boot y formularios reactivos
anidados en Angular.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Back-End | Java 25, Spring Boot 4.1.1, Spring Data JPA, Bean Validation, H2 (en memoria) |
| Front-End | Angular (standalone, Reactive Forms, Signals) |
| Control de versiones | Git + GitHub |

## Estructura del repositorio

IF0009-Lab12-C5H153/
├── techconf-backend/ API REST con Spring Boot + H2
├── techconf-frontend/ Aplicación Angular
├── docs/
│ └── error_recursion.png
└── README.md


## Cómo ejecutar

**Back-End** (puerto 8080):
```bash
cd techconf-backend
./mvnw spring-boot:run
```
- Consola H2: http://localhost:8080/h2-console
  (JDBC URL `jdbc:h2:mem:techconfdb`, usuario `sa`, contraseña `password`)

**Front-End** (puerto 4200):
```bash
cd techconf-frontend
npm install
ng serve
```
- Aplicación: http://localhost:4200

## Endpoints REST

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/charlas` | Lista todas las charlas con sus etiquetas y asistentes |
| POST | `/api/charlas` | Registra una nueva charla |
| POST | `/api/charlas/{id}/asistentes` | Inscribe un asistente en la charla indicada (400 si es inválido, 404 si la charla no existe) |

## Funcionalidades implementadas

### Back-End
- **Entidad `Asistente`** (`id`, `nombre` → columna `nombre_completo`, `correo`, `edad`) con
  validaciones `@NotBlank`, `@Size(min = 3)`, `@Email` y `@Min(18)`.
- **Relación bidireccional**: `Charla` `@OneToMany(mappedBy = "charla")` ↔ `Asistente`
  `@ManyToOne @JoinColumn(name = "charla_id")`.
- **`data.sql`**: 3 charlas, 7 etiquetas y 6 asistentes distribuidos entre las charlas.
- **Validación en backend** con `@Valid` en el endpoint de inscripción.

### Front-End
- Formulario de charlas con `FormArray` de etiquetas dinámicas y validador cruzado de fechas.
- Botón **"Inscribir Asistente"** en cada tarjeta que despliega un formulario reactivo
  **anidado** (`FormGroup asistente` dentro de `FormGroup inscripcionForm`).
- Validaciones: nombre (requerido, mínimo 3), correo (requerido, formato email),
  edad (requerida + **validador personalizado** `edadMinimaValidator(18)` en
  `src/app/validators/edad.validator.ts`).
- Al inscribir, se hace POST al API y la tarjeta se actualiza mostrando al nuevo asistente.

## Parte 2: Análisis y depuración del error de recursión infinita

### Contexto
La relación entre `Charla` y `Asistente` es bidireccional:
- `Charla` tiene `@OneToMany(mappedBy = "charla") List<Asistente> asistentes`
- `Asistente` tiene `@ManyToOne @JoinColumn(name = "charla_id") Charla charla`

### Cómo se provocó el error
1. Se comentó la anotación `@JsonIgnore` del atributo `charla` en `Asistente.java`.
2. Se reinició Spring Boot y se consultó `GET http://localhost:8080/api/charlas`.

### Error obtenido
Jackson entró en un ciclo infinito al serializar:
`Charla → asistentes → Asistente → charla → asistentes → Asistente → ...`

El servidor respondió con error 500 y la consola mostró la excepción de serialización
(recursión / profundidad máxima de anidamiento excedida).

![Error de recursión](docs/error_recursion.png)

### Procedimiento de solución
1. Se identificó en el stack trace que el ciclo ocurría entre `Charla.asistentes` y `Asistente.charla`.
2. Se decidió cortar el ciclo en el lado `@ManyToOne` (`Asistente.charla`), porque el
   requerimiento pide que al consultar una charla **sí** se devuelva su lista de asistentes.
3. Se restauró la anotación `@JsonIgnore` sobre `Asistente.charla`.
4. Se reinició la aplicación y se verificó que `GET /api/charlas` devuelve cada charla con
   su arreglo `asistentes`, y que cada asistente ya no incluye el campo `charla`.

### Directivas de Jackson utilizadas
- **`@JsonIgnore`** (`com.fasterxml.jackson.annotation.JsonIgnore`): excluye el atributo
  `charla` de la serialización JSON de `Asistente`, rompiendo el ciclo.

Alternativas evaluadas:
- `@JsonManagedReference` (en `Charla.asistentes`) + `@JsonBackReference` (en `Asistente.charla`).
- `@JsonIgnoreProperties("asistentes")` sobre `Asistente.charla`.

Se eligió `@JsonIgnore` por ser la opción más simple y la que solicita el enunciado.