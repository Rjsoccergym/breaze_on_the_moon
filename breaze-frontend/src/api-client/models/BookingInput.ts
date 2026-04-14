/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BookingInput = {
    /**
     * Solo usado por ADMIN para crear reservas en nombre de otro cliente.
     */
    clienteId?: string;
    habitacionId: string;
    fechaInicio: string;
    fechaFin: string;
};

