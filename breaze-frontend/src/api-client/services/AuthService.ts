/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponse } from '../models/AuthResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { MessageResponse } from '../models/MessageResponse';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Iniciar sesión
     * Permite a los usuarios autenticarse y recibir un token JWT con su rol.
     * @param requestBody
     * @returns AuthResponse Autenticación exitosa.
     * @throws ApiError
     */
    public static postApiV1AuthLogin(
        requestBody: LoginRequest,
    ): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Credenciales inválidas.`,
            },
        });
    }
    /**
     * Registrar nuevo cliente
     * Crea una nueva cuenta de cliente.
     * @param requestBody
     * @returns MessageResponse Usuario registrado exitosamente.
     * @throws ApiError
     */
    public static postApiV1AuthRegister(
        requestBody: RegisterRequest,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Registrar administrador
     * Crea un usuario con rol ADMIN. Requiere token de administrador.
     * @param requestBody
     * @returns MessageResponse Administrador registrado exitosamente.
     * @throws ApiError
     */
    public static postApiV1AuthRegisterAdmin(
        requestBody: RegisterRequest,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/register-admin',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Token inválido o ausente (gestionado por el API Gateway).`,
                403: `El usuario autenticado no tiene permisos para esta operación.`,
            },
        });
    }
}
