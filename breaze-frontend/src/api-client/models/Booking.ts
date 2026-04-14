/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Booking = {
    id?: string;
    clienteId?: string;
    habitacionId?: string;
    fechaInicio?: string;
    fechaFin?: string;
    precioTotal?: number;
    estado?: Booking.estado;
    createdAt?: string;
    updatedAt?: string;
};
export namespace Booking {
    export enum estado {
        RESERVADA = 'RESERVADA',
        CONFIRMADA = 'CONFIRMADA',
        CANCELADA = 'CANCELADA',
    }
}

