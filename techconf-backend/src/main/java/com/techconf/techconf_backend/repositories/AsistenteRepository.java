package com.techconf.techconf_backend.repositories;

import com.techconf.techconf_backend.models.Asistente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AsistenteRepository extends JpaRepository<Asistente, Long> {
}