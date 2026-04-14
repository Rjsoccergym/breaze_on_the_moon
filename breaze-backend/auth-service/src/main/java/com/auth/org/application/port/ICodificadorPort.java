package com.auth.org.application.port;

public interface ICodificadorPort {
    String codificar(String textoPlano);
    boolean comparar(String textoPlano, String textoCodificado);
}