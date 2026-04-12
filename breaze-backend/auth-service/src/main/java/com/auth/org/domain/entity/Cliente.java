package com.auth.org.domain.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("CLIENTE")
public class Cliente extends Persona {

}
