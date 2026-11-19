package dev.elnata.mcadconnect.io;

import net.minecraft.client.Minecraft;
import net.minecraft.client.multiplayer.ClientLevel;
import net.minecraft.client.player.LocalPlayer;
import net.minecraft.core.BlockPos;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.level.levelgen.Heightmap;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Lê um pedaço do mundo carregado e grava no formato que o mCAD entende como terreno.
 *
 * <p>Guardamos uma coluna por posição — a altura da superfície e o bloco que está nela —, e não
 * o volume inteiro: o terreno do mCAD é uma superfície, e um recorte de 256×256 em colunas cabe
 * em poucos megabytes, enquanto em blocos seriam dezenas de milhões.
 */
public final class Captura {
    private Captura() {}

    /** O que sobrou de uma captura, para a tela contar ao jogador. */
    public record Resultado(Path arquivo, int largura, int profundidade, int colunas, int faltando,
                            int ymin, int ymax) {}

    /** Coluna sem chunk carregado: vira {@code null} no arquivo e o mCAD a ignora. */
    private static final int VAZIO = Integer.MIN_VALUE;

    /**
     * Captura um quadrado de {@code lado} blocos centrado no jogador.
     *
     * @throws IllegalStateException se não há mundo ou jogador
     * @throws IOException se a pasta de troca não aceitar o arquivo
     */
    public static Resultado capturar(int lado) throws IOException {
        Minecraft mc = Minecraft.getInstance();
        ClientLevel nivel = mc.level;
        LocalPlayer jogador = mc.player;
        if (nivel == null || jogador == null) throw new IllegalStateException("sem mundo carregado");

        BlockPos centro = jogador.blockPosition();
        int w = lado, h = lado;
        int x0 = centro.getX() - w / 2, z0 = centro.getZ() - h / 2;

        int[] alt = new int[w * h];
        int[] blo = new int[w * h];
        List<String> paleta = new ArrayList<>();
        Map<String, Integer> indice = new HashMap<>();

        BlockPos.MutableBlockPos m = new BlockPos.MutableBlockPos();
        int colunas = 0, faltando = 0, ymin = Integer.MAX_VALUE, ymax = Integer.MIN_VALUE;

        for (int j = 0; j < h; j++) {
            for (int i = 0; i < w; i++) {
                int x = x0 + i, z = z0 + j, k = j * w + i;
                m.set(x, nivel.getMinY(), z);
                if (!nivel.hasChunkAt(m)) {       /* fora do alcance de visão do jogador */
                    alt[k] = VAZIO;
                    faltando++;
                    continue;
                }
                BlockPos topo = nivel.getHeightmapPos(Heightmap.Types.WORLD_SURFACE, m);
                int y = topo.getY() - 1;          /* o mapa de alturas devolve o ar acima do chão */
                m.set(x, y, z);
                BlockState estado = nivel.getBlockState(m);
                if (estado.isAir()) {
                    alt[k] = VAZIO;
                    faltando++;
                    continue;
                }
                alt[k] = y;
                colunas++;
                if (y < ymin) ymin = y;
                if (y > ymax) ymax = y;
                blo[k] = indiceDe(estado, paleta, indice);
            }
        }
        if (colunas == 0) throw new IllegalStateException("nenhuma coluna com chão: afaste-se e tente de novo");

        String mundo = nomeDoMundo(mc);
        String quando = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss").format(ZonedDateTime.now());
        Path destino = ConnectPaths.pasta(ConnectPaths.CAPTURAS)
            .resolve(limpar(mundo) + "-" + quando + ".mcadcap");
        Files.createDirectories(destino.getParent());
        Files.writeString(destino,
            json(mundo, nivel, x0, z0, w, h, alt, blo, paleta),
            StandardCharsets.UTF_8);

        return new Resultado(destino, w, h, colunas, faltando, ymin, ymax);
    }

    private static int indiceDe(BlockState estado, List<String> paleta, Map<String, Integer> indice) {
        /* O mCAD trabalha com o nome curto do bloco: "grass_block", não "minecraft:grass_block". */
        String id = BuiltInRegistries.BLOCK.getKey(estado.getBlock()).getPath();
        Integer i = indice.get(id);
        if (i != null) return i;
        indice.put(id, paleta.size());
        paleta.add(id);
        return paleta.size() - 1;
    }

    private static String nomeDoMundo(Minecraft mc) {
        if (mc.getSingleplayerServer() != null) {
            return mc.getSingleplayerServer().getWorldData().getLevelName();
        }
        if (mc.getCurrentServer() != null) return mc.getCurrentServer().name;
        return "mundo";
    }

    /** Só o que vira nome de arquivo sem susto em qualquer sistema. */
    private static String limpar(String s) {
        String r = s.replaceAll("[^A-Za-z0-9 _-]", "").trim().replace(' ', '_');
        return r.isEmpty() ? "mundo" : r;
    }

    private static String json(String mundo, ClientLevel nivel, int x0, int z0, int w, int h,
                               int[] alt, int[] blo, List<String> paleta) {
        StringBuilder b = new StringBuilder(w * h * 6 + 512);
        b.append("{\"formato\":\"mcad-connect/captura\",\"v\":1");
        b.append(",\"mundo\":").append(texto(mundo));
        b.append(",\"dimensao\":").append(texto(nivel.dimension().identifier().toString()));
        b.append(",\"quando\":").append(texto(DateTimeFormatter.ISO_INSTANT.format(java.time.Instant.now())));
        b.append(",\"x0\":").append(x0).append(",\"z0\":").append(z0);
        b.append(",\"w\":").append(w).append(",\"h\":").append(h);
        b.append(",\"pal\":[");
        for (int i = 0; i < paleta.size(); i++) {
            if (i > 0) b.append(',');
            b.append(texto(paleta.get(i)));
        }
        b.append("],\"alt\":[");
        for (int i = 0; i < alt.length; i++) {
            if (i > 0) b.append(',');
            if (alt[i] == VAZIO) b.append("null"); else b.append(alt[i]);
        }
        b.append("],\"blo\":[");
        for (int i = 0; i < blo.length; i++) {
            if (i > 0) b.append(',');
            b.append(blo[i]);
        }
        b.append("]}");
        return b.toString();
    }

    private static String texto(String s) {
        StringBuilder b = new StringBuilder(s.length() + 2).append('"');
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"' -> b.append("\\\"");
                case '\\' -> b.append("\\\\");
                case '\n' -> b.append("\\n");
                case '\r' -> b.append("\\r");
                case '\t' -> b.append("\\t");
                default -> {
                    if (c < 0x20) b.append(String.format("\\u%04x", (int) c));
                    else b.append(c);
                }
            }
        }
        return b.append('"').toString();
    }
}
