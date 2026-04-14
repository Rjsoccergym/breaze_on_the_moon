/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterRequest = {
    username: string;
    password: string;
    nombre: string;
    apellido: string;
    email: string;
    tipoIdentificacion?: RegisterRequest.tipoIdentificacion;
    numeroIdentificacion?: string;
    telefono?: string;
    fechaNacimiento?: string;
};
export namespace RegisterRequest {
    export enum tipoIdentificacion {
        CC = 'CC',
        TI = 'TI',
        NIT = 'NIT',
    }
}

