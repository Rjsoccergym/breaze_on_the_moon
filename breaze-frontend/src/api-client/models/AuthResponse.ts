/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AuthResponse = {
    token?: string;
    userId?: string;
    username?: string;
    nombre?: string;
    apellido?: string;
    email?: string;
    rol?: AuthResponse.rol;
    tipoIdentificacion?: AuthResponse.tipoIdentificacion;
    numeroIdentificacion?: string;
    telefono?: string;
    fechaNacimiento?: string;
    mensaje?: string;
};
export namespace AuthResponse {
    export enum rol {
        ADMIN = 'ADMIN',
        CLIENT = 'CLIENT',
    }
    export enum tipoIdentificacion {
        CC = 'CC',
        TI = 'TI',
        NIT = 'NIT',
    }
}

