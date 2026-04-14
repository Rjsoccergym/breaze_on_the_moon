/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Booking } from '../models/Booking';
import type { BookingInput } from '../models/BookingInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BookingsService {
    /**
     * Listar reservas por estado
     * Obtiene todas las reservas filtradas por estado. Requiere rol ADMIN.
     * @param estado
     * @returns Booking Lista de reservas.
     * @throws ApiError
     */
    public static getApiV1Booking(
        estado: 'CREADA' | 'CONFIRMADA' | 'CANCELADA',
    ): CancelablePromise<Array<Booking>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/booking',
            query: {
                'estado': estado,
            },
            errors: {
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
                403: `El usuario autenticado no tiene permisos para esta operación.`,
            },
        });
    }
    /**
     * Crear una nueva reserva
     * Crea una reserva para la habitación indicada. Disponible para cualquier usuario autenticado.
     * @param requestBody
     * @returns Booking Reserva creada exitosamente.
     * @throws ApiError
     */
    public static postApiV1Booking(
        requestBody: BookingInput,
    ): CancelablePromise<Booking> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/booking',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Datos de entrada inválidos, fechas incorrectas o habitación no disponible.`,
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
            },
        });
    }
    /**
     * Confirmar una reserva
     * Marca la reserva como CONFIRMADA y bloquea la habitación como OCUPADA. Requiere rol ADMIN.
     * @param id
     * @returns any Reserva confirmada.
     * @throws ApiError
     */
    public static patchApiV1BookingConfirmar(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/booking/{id}/confirmar',
            path: {
                'id': id,
            },
            errors: {
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
                403: `El usuario autenticado no tiene permisos para esta operación.`,
                404: `Reserva no encontrada.`,
            },
        });
    }
    /**
     * Ver historial de reservas de un cliente
     * Devuelve las reservas del cliente indicado.
     * Un cliente solo puede consultar su propio historial.
     * Un administrador puede consultar cualquier historial.
     *
     * @param clienteId
     * @returns Booking Historial de reservas.
     * @throws ApiError
     */
    public static getApiV1BookingCliente(
        clienteId: string,
    ): CancelablePromise<Array<Booking>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/booking/cliente/{clienteId}',
            path: {
                'clienteId': clienteId,
            },
            errors: {
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
                403: `El usuario autenticado no tiene permisos para esta operación.`,
            },
        });
    }
    /**
     * Cancelar una reserva
     * Cancela la reserva y libera la habitación.
     * Un cliente solo puede cancelar sus propias reservas.
     * Un administrador puede cancelar cualquier reserva.
     *
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteApiV1Booking(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/booking/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
                403: `El usuario autenticado no tiene permisos para esta operación.`,
                404: `Reserva no encontrada.`,
            },
        });
    }
}
