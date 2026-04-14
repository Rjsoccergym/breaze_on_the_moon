/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Room = {
    id?: string;
    numeroIdentificador?: string;
    tipo?: Room.tipo;
    descripcion?: string;
    capacidadMaxima?: number;
    precioNoche?: number;
    estado?: Room.estado;
    createdAt?: string;
    updatedAt?: string;
};
export namespace Room {
    export enum tipo {
        SENCILLA = 'SENCILLA',
        DOBLE = 'DOBLE',
        SUITE = 'SUITE',
    }
    export enum estado {
        DISPONIBLE = 'DISPONIBLE',
        OCUPADA = 'OCUPADA',
        MANTENIMIENTO = 'MANTENIMIENTO',
    }
}

