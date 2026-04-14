/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Room } from '../models/Room';
import type { RoomInput } from '../models/RoomInput';
import type { RoomStatusInput } from '../models/RoomStatusInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoomsService {
    /**
     * Consultar habitaciones
     * Los clientes únicamente pueden consultar habitaciones disponibles.
     * Un administrador puede consultar el inventario completo.
     *
     * @param status Filtro opcional por estado.
     * @returns Room Lista de habitaciones obtenida con éxito.
     * @throws ApiError
     */
    public static getApiV1Room(
        status?: 'DISPONIBLE' | 'OCUPADA' | 'MANTENIMIENTO',
    ): CancelablePromise<Array<Room>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/room',
            query: {
                'status': status,
            },
            errors: {
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
                403: `El usuario autenticado no tiene permisos para esta operación.`,
            },
        });
    }
    /**
     * Registrar una nueva habitación
     * Permite registrar una nueva habitación en el sistema. Requiere rol ADMIN.
     * @param requestBody
     * @returns Room Habitación registrada exitosamente.
     * @throws ApiError
     */
    public static postApiV1Room(
        requestBody: RoomInput,
    ): CancelablePromise<Room> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/room',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Datos de entrada inválidos.`,
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
                403: `El usuario autenticado no tiene permisos para esta operación.`,
                409: `Ya existe una habitación con el mismo número identificador.`,
            },
        });
    }
    /**
     * Obtener habitación por ID
     * Un cliente solo puede consultar habitaciones disponibles.
     * Un administrador puede consultar cualquier habitación.
     *
     * @param id
     * @returns Room Habitación encontrada.
     * @throws ApiError
     */
    public static getApiV1Room1(
        id: string,
    ): CancelablePromise<Room> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/room/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
                403: `El usuario autenticado no tiene permisos para esta operación.`,
                404: `Habitación no encontrada.`,
            },
        });
    }
    /**
     * Actualizar habitación
     * Permite modificar los datos base de una habitación. Requiere rol ADMIN.
     * @param id
     * @param requestBody
     * @returns Room Habitación actualizada exitosamente.
     * @throws ApiError
     */
    public static putApiV1Room(
        id: string,
        requestBody: RoomInput,
    ): CancelablePromise<Room> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/room/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Datos de entrada inválidos.`,
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
                403: `El usuario autenticado no tiene permisos para esta operación.`,
                404: `Habitación no encontrada.`,
            },
        });
    }
    /**
     * Cambiar estado de la habitación
     * Actualiza únicamente el estado actual de la habitación. Requiere rol ADMIN o llamada interna autorizada.
     * @param id
     * @param requestBody
     * @returns any Estado actualizado exitosamente.
     * @throws ApiError
     */
    public static patchApiV1RoomStatus(
        id: string,
        requestBody: RoomStatusInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/room/{id}/status',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Estado inválido.`,
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
                403: `El usuario autenticado no tiene permisos para esta operación.`,
                404: `Habitación no encontrada.`,
            },
        });
    }
}
