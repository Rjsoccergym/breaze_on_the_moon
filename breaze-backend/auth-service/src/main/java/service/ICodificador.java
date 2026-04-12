package service;

public interface ICodificador {
    String codificar(String textoPlano);
    boolean comparar(String textoPlano, String textoCodificado);
}