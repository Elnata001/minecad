package dev.elnata.mcadconnect.io;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

/** O que o mCAD deixou na pasta de troca para ser colado no mundo. */
public final class Projetos {
    private Projetos() {}

    public record Item(Path arquivo, long bytes, long quando) {
        public String nome() {
            return arquivo.getFileName().toString();
        }
    }

    /** Os esquemas disponíveis, do mais recente para o mais antigo. */
    public static List<Item> listar() {
        Path dir = ConnectPaths.pasta(ConnectPaths.PROJETOS);
        List<Item> fora = new ArrayList<>();
        try {
            Files.createDirectories(dir);
        } catch (IOException e) {
            return fora;
        }
        try (Stream<Path> s = Files.list(dir)) {
            s.filter(Files::isRegularFile)
             .filter(p -> {
                 String n = p.getFileName().toString().toLowerCase();
                 return n.endsWith(".schem") || n.endsWith(".nbt");
             })
             .forEach(p -> {
                 try {
                     fora.add(new Item(p, Files.size(p), Files.getLastModifiedTime(p).toMillis()));
                 } catch (IOException ignorado) {
                     /* arquivo sumiu entre listar e medir: só não entra na lista */
                 }
             });
        } catch (IOException e) {
            return fora;
        }
        fora.sort(Comparator.comparingLong(Item::quando).reversed());
        return fora;
    }
}
