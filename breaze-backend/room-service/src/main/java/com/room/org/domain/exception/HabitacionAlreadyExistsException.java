package com.room.org.domain.exception;

public class HabitacionAlreadyExistsException extends ResourceConflictException {
    public HabitacionAlreadyExistsException(String message) {
        super(message);
    }
}