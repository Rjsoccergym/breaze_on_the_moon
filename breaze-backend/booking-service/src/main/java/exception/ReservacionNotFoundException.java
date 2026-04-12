package exception;

public class ReservacionNotFoundException extends DomainException {
    public ReservacionNotFoundException(String message) {
        super(message);
    }
}
