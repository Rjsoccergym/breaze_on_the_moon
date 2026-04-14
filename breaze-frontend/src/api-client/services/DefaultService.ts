/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Room } from '../models/Room';
import type { RoomInput } from '../models/RoomInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Consultar habitaciones
     * Los clientes únicamente pueden consultar las habitaciones disponibles.
     * Un administrador puede consultar todo el inventario
     *
     * @param status Filtro por estado de la habitación.
     * @returns Room Lista de habitaciones obtenida con éxito.
     * @throws ApiError
     */
    public static get(
        status?: 'disponible' | 'ocupada' | 'en mantenimiento',
    ): CancelablePromise<Array<Room>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
            query: {
                'status': status,
            },
            errors: {
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
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
    public static post(
        requestBody: RoomInput,
    ): CancelablePromise<Room> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
                403: `El usuario autenticado no tiene permisos para esta operación.`,
            },
        });
    }
    /**
     * Actualizar información de la habitación
     * Permite modificar los datos base de una habitación. Requiere rol ADMIN.
     * @param id Identificador único de la habitación.
     * @param requestBody
     * @returns any Habitación actualizada exitosamente.
     * @throws ApiError
     */
    public static put(
        id: string,
        requestBody: RoomInput,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
                403: `El usuario autenticado no tiene permisos para esta operación.`,
                404: `Habitación no encontrada.`,
            },
        });
    }
    /**
     * Cambiar estado de la habitación
     * Operación específica para actualizar únicamente la situación actual de la habitación. Requiere rol ADMIN.
     * @param id
     * @param requestBody
     * @returns any Estado actualizado exitosamente.
     * @throws ApiError
     */
    public static patchStatus(
        id: string,
        requestBody: {
            status: 'disponible' | 'ocupada' | 'en mantenimiento';
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/{id}/status',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
                403: `El usuario autenticado no tiene permisos para esta operación.`,
            },
        });
    }
}
