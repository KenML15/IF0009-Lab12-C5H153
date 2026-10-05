INSERT INTO charla (titulo, expositor, nivel, email_contacto, fecha_inicio, fecha_fin)
VALUES ('Introduccion a la Inteligencia Artificial', 'Dra. Maria Rojas', 'Principiante', 'maria@ai-lab.com', '2026-11-10', '2026-11-10');
INSERT INTO charla (titulo, expositor, nivel, email_contacto, fecha_inicio, fecha_fin)
VALUES ('Microservicios con Spring Cloud', 'Ing. Carlos Brenes', 'Avanzado', 'carlos@spring.io', '2026-11-11', '2026-11-12');
INSERT INTO charla (titulo, expositor, nivel, email_contacto, fecha_inicio, fecha_fin)
VALUES ('Angular 18: Senales y Standalone', 'Licda. Laura Gomez', 'Intermedio', 'laura@angular.dev', '2026-11-13', '2026-11-13');

INSERT INTO charla_etiquetas (charla_id, etiqueta) VALUES (1, 'IA');
INSERT INTO charla_etiquetas (charla_id, etiqueta) VALUES (1, 'Machine Learning');
INSERT INTO charla_etiquetas (charla_id, etiqueta) VALUES (2, 'Spring Boot');
INSERT INTO charla_etiquetas (charla_id, etiqueta) VALUES (2, 'Backend');
INSERT INTO charla_etiquetas (charla_id, etiqueta) VALUES (2, 'Nube');
INSERT INTO charla_etiquetas (charla_id, etiqueta) VALUES (3, 'Angular');
INSERT INTO charla_etiquetas (charla_id, etiqueta) VALUES (3, 'Frontend');

-- Asistentes distribuidos entre las 3 charlas (charla_id = 1, 2, 3)
INSERT INTO asistente (nombre_completo, correo, edad, charla_id) VALUES ('Ana Solano Vargas', 'ana.solano@correo.com', 21, 1);
INSERT INTO asistente (nombre_completo, correo, edad, charla_id) VALUES ('Luis Mora Jimenez', 'luis.mora@correo.com', 25, 1);
INSERT INTO asistente (nombre_completo, correo, edad, charla_id) VALUES ('Sofia Rojas Castro', 'sofia.rojas@correo.com', 19, 2);
INSERT INTO asistente (nombre_completo, correo, edad, charla_id) VALUES ('Diego Araya Quesada', 'diego.araya@correo.com', 30, 2);
INSERT INTO asistente (nombre_completo, correo, edad, charla_id) VALUES ('Valeria Chaves Brenes', 'valeria.chaves@correo.com', 23, 3);
INSERT INTO asistente (nombre_completo, correo, edad, charla_id) VALUES ('Jose Campos Ulate', 'jose.campos@correo.com', 27, 3);