package dev.elnata.mcadconnect.client;

import dev.elnata.mcadconnect.io.Captura;
import dev.elnata.mcadconnect.io.Colar;
import dev.elnata.mcadconnect.io.ConnectPaths;
import dev.elnata.mcadconnect.io.Projetos;
import dev.elnata.mcadconnect.io.Schem;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.components.StringWidget;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.core.BlockPos;
import net.minecraft.network.chat.Component;

import java.util.List;

/**
 * O menu do mCAD Connect: capturar o terreno de um lado, colar o projeto do outro.
 *
 * <p>A tela é montada só com componentes do próprio jogo e sem desenho próprio. O visual sai
 * igual ao do resto do Minecraft e o mod não depende do pipeline de renderização, que mudou
 * bastante no 26.x.
 */
public class ConnectScreen extends Screen {
    private static final int[] LADOS = {64, 128, 256};

    private final Screen anterior;
    private int lado = 128;
    private int projeto = 0;
    private boolean comAr = false;
    private List<Projetos.Item> lista = List.of();

    private Component recado = Component.empty();
    private StringWidget recadoWidget;
    private Button botaoLado, botaoProjeto, botaoAr;

    public ConnectScreen(Screen anterior) {
        super(Component.translatable("mcadconnect.title"));
        this.anterior = anterior;
    }

    @Override
    protected void init() {
        this.lista = Projetos.listar();
        if (this.projeto >= this.lista.size()) this.projeto = 0;

        int meio = this.width / 2;
        int y = 28;

        this.addRenderableWidget(new StringWidget(meio - 160, y, 320, 12,
            Component.translatable("mcadconnect.title"), this.font));

        /* ---- capturar ---- */
        y += 22;
        this.addRenderableWidget(new StringWidget(meio - 160, y, 320, 12,
            Component.translatable("mcadconnect.sec.capture"), this.font));
        y += 16;
        this.botaoLado = this.addRenderableWidget(Button.builder(rotuloLado(), b -> {
            int i = 0;
            while (i < LADOS.length && LADOS[i] != this.lado) i++;
            this.lado = LADOS[(i + 1) % LADOS.length];
            this.botaoLado.setMessage(rotuloLado());
        }).bounds(meio - 155, y, 150, 20).build());
        this.addRenderableWidget(Button.builder(
                Component.translatable("mcadconnect.capture"), b -> capturar())
            .bounds(meio + 5, y, 150, 20).build());

        /* ---- colar ---- */
        y += 34;
        this.addRenderableWidget(new StringWidget(meio - 160, y, 320, 12,
            Component.translatable("mcadconnect.sec.paste"), this.font));
        y += 16;
        this.botaoProjeto = this.addRenderableWidget(Button.builder(rotuloProjeto(), b -> {
            if (this.lista.isEmpty()) return;
            this.projeto = (this.projeto + 1) % this.lista.size();
            this.botaoProjeto.setMessage(rotuloProjeto());
        }).bounds(meio - 155, y, 310, 20).build());
        y += 24;
        this.botaoAr = this.addRenderableWidget(Button.builder(rotuloAr(), b -> {
            this.comAr = !this.comAr;
            this.botaoAr.setMessage(rotuloAr());
        }).bounds(meio - 155, y, 150, 20).build());
        this.addRenderableWidget(Button.builder(
                Component.translatable("mcadconnect.paste"), b -> colar())
            .bounds(meio + 5, y, 150, 20).build());

        /* ---- rodapé ---- */
        y += 30;
        this.recadoWidget = this.addRenderableWidget(new StringWidget(meio - 190, y, 380, 12,
            this.recado, this.font));
        y += 16;
        this.addRenderableWidget(new StringWidget(meio - 190, y, 380, 12,
            Component.translatable("mcadconnect.folder", ConnectPaths.raiz().toString()), this.font));
        y += 22;
        this.addRenderableWidget(Button.builder(
                Component.translatable("gui.done"), b -> this.onClose())
            .bounds(meio - 100, y, 200, 20).build());
    }

    private Component rotuloLado() {
        return Component.translatable("mcadconnect.size", this.lado, this.lado);
    }

    private Component rotuloAr() {
        return Component.translatable(this.comAr ? "mcadconnect.air.on" : "mcadconnect.air.off");
    }

    private Component rotuloProjeto() {
        if (this.lista.isEmpty()) return Component.translatable("mcadconnect.none");
        Projetos.Item it = this.lista.get(this.projeto);
        return Component.translatable("mcadconnect.project",
            it.nome(), this.projeto + 1, this.lista.size());
    }

    private void capturar() {
        try {
            Captura.Resultado r = Captura.capturar(this.lado);
            dizer(Component.translatable("mcadconnect.ok",
                r.arquivo().getFileName().toString(), r.colunas(), r.ymin(), r.ymax()));
            if (r.faltando() > 0) dizer(Component.translatable("mcadconnect.partial", r.faltando()));
            McadConnectClient.LOG.info("Captura gravada em {}", r.arquivo());
        } catch (Exception e) {
            dizer(Component.translatable("mcadconnect.erro", String.valueOf(e.getMessage())));
            McadConnectClient.LOG.warn("Falhou a captura", e);
        }
    }

    private void colar() {
        if (this.lista.isEmpty()) {
            dizer(Component.translatable("mcadconnect.none.hint"));
            return;
        }
        Minecraft mc = Minecraft.getInstance();
        if (mc.player == null) return;
        try {
            Projetos.Item it = this.lista.get(this.projeto);
            Schem.Dados d = Schem.ler(it.arquivo());
            /* O canto do projeto encosta no jogador: é o ponto que ele consegue mirar. */
            BlockPos origem = mc.player.blockPosition();
            Colar.Resultado r = Colar.colar(d, origem, this.comAr);
            dizer(Component.translatable("mcadconnect.pasted",
                r.postos(), d.largura(), d.altura(), d.comprimento(),
                origem.getX(), origem.getY(), origem.getZ()));
            McadConnectClient.LOG.info("Colado {} em {}", it.nome(), origem);
        } catch (Exception e) {
            dizer(Component.translatable("mcadconnect.erro", String.valueOf(e.getMessage())));
            McadConnectClient.LOG.warn("Falhou ao colar", e);
        }
    }

    private void dizer(Component c) {
        this.recado = c;
        if (this.recadoWidget != null) this.recadoWidget.setMessage(c);
    }

    @Override
    public void onClose() {
        Minecraft.getInstance().gui.setScreen(this.anterior);
    }
}
