/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Entidad principal de Habitación.
 */
export type Room = {
    /**
     * Número identificador único.
     */
    id?: string;
    /**
     * Tipo de habitación.
     */
    tipo?: Room.tipo;
    /**
     * Descripción detallada.
     */
    descripcion?: string;
    /**
     * Capacidad máxima de huéspedes.
     */
    capacidadMax?: number;
    /**
     * Precio por noche.
     */
    precionoche?: number;
    /**
     * Situación actual de la habitación.
     */
    estado?: Room.estado;
};
export namespace Room {
    /**
     * Tipo de habitación.
     */
    export enum tipo {
        SENCILLA = 'sencilla',
        DOBLE = 'doble',
        SUITE = 'suite',
    }
    /**
     * Situación actual de la habitación.
     */
    export enum estado {
        DISPONIBLE = 'disponible',
        OCUPADA = 'ocupada',
        EN_MANTENIMIENTO = 'en mantenimiento',
    }
}

