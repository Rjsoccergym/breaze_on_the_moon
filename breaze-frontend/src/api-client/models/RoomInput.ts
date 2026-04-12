/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Objeto utilizado para crear o actualizar una habitación.
 */
export type RoomInput = {
    tipo: RoomInput.tipo;
    descripcion: string;
    capacidadMax: number;
    precionoche: number;
};
export namespace RoomInput {
    export enum tipo {
        SENCILLA = 'sencilla',
        DOBLE = 'doble',
        SUITE = 'suite',
    }
}

