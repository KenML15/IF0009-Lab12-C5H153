package com.techconf.techconf_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.techconf.techconf_backend.models.Charla;

@Repository
public interface CharlaRepository extends JpaRepository<Charla, Long> {
}