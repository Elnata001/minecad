package dev.elnata.mcadconnect.io;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Onde o mod e o mCAD se encontram.
 *
 * <p>A ponte entre os dois é uma pasta, não uma porta de rede: o mod grava ali o que capturou
 * e lê dali o que o mCAD exportou. Isso dispensa servidor local, firewall e permissão, e
 * funciona com o mCAD fechado — a captura espera na pasta até a próxima vez que ele abrir.
 */
public final class ConnectPaths {
    private ConnectPaths() {}

    /** Capturas feitas no jogo, para o mCAD importar como terreno. */
    public static final String CAPTURAS = "capturas";
    /** Projetos exportados pelo mCAD, para colar no mundo. */
    public static final String PROJETOS = "projetos";

    private static Path raizCache;

    /**
     * A pasta {@code Documentos/mCAD/Connect}, a mesma que o aplicativo de desktop usa.
     * Em sistemas sem "Documentos" reconhecível, cai para {@code ~/mCAD/Connect}.
     */
    public static Path raiz() {
        if (raizCache != null) return raizCache;
        Path base = documentos();
        raizCache = base.resolve("mCAD").resolve("Connect");
        return raizCache;
    }

    public static Path pasta(String nome) {
        return raiz().resolve(nome);
    }

    /** Cria a estrutura de pastas se ainda não existir. Devolve false se não deu. */
    public static boolean garantir() {
        try {
            Files.createDirectories(pasta(CAPTURAS));
            Files.createDirectories(pasta(PROJETOS));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private static Path documentos() {
        String lar = System.getProperty("user.home", ".");
        Path home = Paths.get(lar);
        /* O Windows em português chama a pasta de "Documentos"; em inglês, "Documents".
           Procuramos a que existir em vez de supor uma delas. */
        for (String nome : new String[] {"Documents", "Documentos"}) {
            Path p = home.resolve(nome);
            if (Files.isDirectory(p)) return p;
        }
        return home;
    }
}
