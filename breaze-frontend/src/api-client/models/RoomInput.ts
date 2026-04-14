/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RoomInput = {
    numeroIdentificador: string;
    tipo: RoomInput.tipo;
    descripcion: string;
    capacidadMaxima: number;
    precioNoche: number;
};
export namespace RoomInput {
    export enum tipo {
        SENCILLA = 'SENCILLA',
        DOBLE = 'DOBLE',
        SUITE = 'SUITE',
    }
}

