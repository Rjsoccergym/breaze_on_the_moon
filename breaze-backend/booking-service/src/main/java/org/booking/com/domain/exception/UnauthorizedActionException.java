package org.booking.com.domain.exception;

public class UnauthorizedActionException extends DomainException {
    public UnauthorizedActionException(String message) {
        super(message);
    }
}