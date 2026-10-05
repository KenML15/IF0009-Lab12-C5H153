package com.techconf.techconf_backend.controllers;

import com.techconf.techconf_backend.models.Charla;
import com.techconf.techconf_backend.repositories.CharlaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.techconf.techconf_backend.models.Asistente;
import com.techconf.techconf_backend.repositories.AsistenteRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/charlas")
@CrossOrigin(origins = "http://localhost:4200")
public class CharlaController {

    @Autowired
    private AsistenteRepository asistenteRepository;

    @Autowired
    private CharlaRepository repository;

    @GetMapping
    public List<Charla> obtenerTodas() {
        return repository.findAll();
    }

    @PostMapping
    public Charla registrarCharla(@RequestBody Charla nuevaCharla) {
        return repository.save(nuevaCharla);
    }

    @PostMapping("/{id}/asistentes")
    public ResponseEntity<Asistente> inscribirAsistente(
            @PathVariable("id") Long id,
            @Valid @RequestBody Asistente asistente) {

        Charla charla = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Charla no encontrada"));

        asistente.setCharla(charla);

        Asistente guardado = asistenteRepository.save(asistente);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }
}