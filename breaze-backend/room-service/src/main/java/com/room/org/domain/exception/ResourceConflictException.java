package com.room.org.domain.exception;

public class ResourceConflictException extends DomainException {
    public ResourceConflictException(String message) {
        super(message);
    }
}