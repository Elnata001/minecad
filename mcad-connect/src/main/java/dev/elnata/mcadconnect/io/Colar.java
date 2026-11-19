package dev.elnata.mcadconnect.io;

import net.minecraft.client.Minecraft;
import net.minecraft.commands.arguments.blocks.BlockStateParser;
import net.minecraft.core.BlockPos;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.server.MinecraftServer;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.level.block.Blocks;
import net.minecraft.world.level.block.state.BlockState;

import java.util.HashMap;
import java.util.Map;

/**
 * Cola no mundo o que o mCAD exportou.
 *
 * <p>Por ora só em mundo de um jogador: ali o cliente tem o servidor integrado ao lado e pode
 * escrever nos blocos. Num servidor de verdade isso dependeria do mod do outro lado, e o mod
 * avisa em vez de fingir que colou.
 */
public final class Colar {
    private Colar() {}

    public record Resultado(int postos, int ignorados, BlockPos canto) {}

    /**
     * @param origem canto de menor coordenada onde o esquema será colado
     * @param comAr  se falso, as posições de ar do esquema não apagam o que já existe
     */
    public static Resultado colar(Schem.Dados d, BlockPos origem, boolean comAr) {
        Minecraft mc = Minecraft.getInstance();
        MinecraftServer servidor = mc.getSingleplayerServer();
        if (servidor == null) {
            throw new IllegalStateException("só funciona em mundo de um jogador por enquanto");
        }
        if (mc.level == null) throw new IllegalStateException("sem mundo carregado");
        ServerLevel nivel = servidor.getLevel(mc.level.dimension());
        if (nivel == null) throw new IllegalStateException("não encontrei esta dimensão no servidor");

        BlockState[] estados = new BlockState[d.paleta().length];
        Map<String, BlockState> cache = new HashMap<>();
        for (int i = 0; i < estados.length; i++) {
            estados[i] = interpretar(d.paleta()[i], cache);
        }

        int postos = 0, ignorados = 0;
        BlockPos.MutableBlockPos p = new BlockPos.MutableBlockPos();
        /* A escrita tem de acontecer na linha do servidor; executamos tudo lá e esperamos. */
        for (int y = 0; y < d.altura(); y++) {
            for (int z = 0; z < d.comprimento(); z++) {
                for (int x = 0; x < d.largura(); x++) {
                    BlockState e = estados[d.em(x, y, z)];
                    if (e == null) {
                        ignorados++;
                        continue;
                    }
                    if (!comAr && e.isAir()) continue;
                    p.set(origem.getX() + x, origem.getY() + y, origem.getZ() + z);
                    BlockPos fixo = p.immutable();
                    BlockState estado = e;
                    servidor.execute(() -> nivel.setBlock(fixo, estado, 2));
                    postos++;
                }
            }
        }
        return new Resultado(postos, ignorados, origem);
    }

    /**
     * "minecraft:oak_stairs[facing=north,half=bottom]" vira um estado de bloco.
     * Um bloco que esta versão do jogo não conhece devolve null e é contado como ignorado.
     */
    private static BlockState interpretar(String texto, Map<String, BlockState> cache) {
        if (texto == null) return null;
        BlockState pronto = cache.get(texto);
        if (pronto != null) return pronto;
        BlockState e;
        try {
            e = BlockStateParser.parseForBlock(BuiltInRegistries.BLOCK, texto, false).blockState();
        } catch (Exception ex) {
            e = null;
        }
        if (e == null) e = Blocks.AIR.defaultBlockState();
        cache.put(texto, e);
        return e;
    }
}
