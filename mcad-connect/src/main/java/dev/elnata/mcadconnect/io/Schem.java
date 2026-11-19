package dev.elnata.mcadconnect.io;

import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.GZIPInputStream;

/**
 * Leitor do esquema do Sponge (.schem), o formato que o mCAD exporta.
 *
 * <p>O NBT é lido aqui à mão, com {@link DataInputStream}, em vez de usar as classes do jogo.
 * São umas cem linhas e, em troca, esta parte do mod não depende de nenhuma API do Minecraft —
 * que é justamente a que mais muda de uma versão para outra.
 */
public final class Schem {
    private Schem() {}

    /** Um esquema lido: dimensões, paleta de estados e um índice da paleta por posição. */
    public record Dados(int largura, int altura, int comprimento, String[] paleta, int[] blocos) {
        public int total() {
            return largura * altura * comprimento;
        }

        /** Índice na paleta do bloco em (x, y, z), na ordem do formato: Y, depois Z, depois X. */
        public int em(int x, int y, int z) {
            return blocos[(y * comprimento + z) * largura + x];
        }
    }

    /* ---- tipos de tag do NBT ---- */
    private static final int FIM = 0, BYTE = 1, SHORT = 2, INT = 3, LONG = 4, FLOAT = 5,
        DOUBLE = 6, BYTES = 7, STRING = 8, LISTA = 9, COMPOSTO = 10, INTS = 11, LONGS = 12;

    public static Dados ler(Path arquivo) throws IOException {
        try (InputStream in = Files.newInputStream(arquivo)) {
            return ler(in);
        }
    }

    public static Dados ler(InputStream bruto) throws IOException {
        /* O .schem é sempre gzip; o .nbt de estrutura do próprio jogo também. */
        try (DataInputStream in = new DataInputStream(new BufferedInputStream(new GZIPInputStream(bruto)))) {
            int tipo = in.readUnsignedByte();
            if (tipo != COMPOSTO) throw new IOException("não parece um arquivo NBT");
            pularNome(in);
            Map<String, Object> raiz = lerComposto(in);

            /* A versão 2 do formato põe tudo na raiz; a 3 embrulha em "Schematic". */
            Object dentro = raiz.get("Schematic");
            Map<String, Object> s = dentro instanceof Map ? comoMapa(dentro) : raiz;

            int w = inteiro(s.get("Width")), a = inteiro(s.get("Height")), c = inteiro(s.get("Length"));
            if (w <= 0 || a <= 0 || c <= 0) throw new IOException("dimensões ausentes no esquema");

            Map<String, Object> blocos = s.get("Blocks") instanceof Map ? comoMapa(s.get("Blocks")) : s;
            Map<String, Object> paletaNbt = comoMapa(blocos.get("Palette"));
            byte[] dados = (byte[]) (blocos.containsKey("Data") ? blocos.get("Data") : blocos.get("BlockData"));
            if (paletaNbt == null || dados == null) throw new IOException("o esquema não tem blocos");

            String[] paleta = new String[paletaNbt.size()];
            for (Map.Entry<String, Object> e : paletaNbt.entrySet()) {
                int i = inteiro(e.getValue());
                if (i >= 0 && i < paleta.length) paleta[i] = e.getKey();
            }

            int[] ids = new int[w * a * c];
            int p = 0;
            for (int i = 0; i < ids.length; i++) {
                /* varint: o formato guarda os índices da paleta comprimidos */
                int v = 0, deslo = 0;
                while (true) {
                    if (p >= dados.length) throw new IOException("o esquema terminou antes da conta de blocos");
                    int b = dados[p++] & 0xFF;
                    v |= (b & 0x7F) << deslo;
                    if ((b & 0x80) == 0) break;
                    deslo += 7;
                }
                ids[i] = v;
            }
            return new Dados(w, a, c, paleta, ids);
        }
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> comoMapa(Object o) {
        return o instanceof Map ? (Map<String, Object>) o : null;
    }

    private static int inteiro(Object o) {
        return o instanceof Number n ? n.intValue() : 0;
    }

    private static void pularNome(DataInputStream in) throws IOException {
        int n = in.readUnsignedShort();
        in.skipBytes(n);
    }

    private static String lerNome(DataInputStream in) throws IOException {
        int n = in.readUnsignedShort();
        byte[] b = new byte[n];
        in.readFully(b);
        return new String(b, StandardCharsets.UTF_8);
    }

    private static Map<String, Object> lerComposto(DataInputStream in) throws IOException {
        Map<String, Object> m = new HashMap<>();
        while (true) {
            int tipo = in.readUnsignedByte();
            if (tipo == FIM) return m;
            String nome = lerNome(in);
            m.put(nome, lerValor(in, tipo));
        }
    }

    private static Object lerValor(DataInputStream in, int tipo) throws IOException {
        switch (tipo) {
            case BYTE: return in.readByte();
            case SHORT: return in.readShort();
            case INT: return in.readInt();
            case LONG: return in.readLong();
            case FLOAT: return in.readFloat();
            case DOUBLE: return in.readDouble();
            case BYTES: {
                byte[] b = new byte[in.readInt()];
                in.readFully(b);
                return b;
            }
            case STRING: return lerNome(in);
            case LISTA: {
                int t = in.readUnsignedByte(), n = in.readInt();
                List<Object> l = new ArrayList<>(Math.max(0, n));
                for (int i = 0; i < n; i++) l.add(lerValor(in, t));
                return l;
            }
            case COMPOSTO: return lerComposto(in);
            case INTS: {
                int[] v = new int[in.readInt()];
                for (int i = 0; i < v.length; i++) v[i] = in.readInt();
                return v;
            }
            case LONGS: {
                long[] v = new long[in.readInt()];
                for (int i = 0; i < v.length; i++) v[i] = in.readLong();
                return v;
            }
            default: throw new IOException("tag NBT desconhecida: " + tipo);
        }
    }
}
