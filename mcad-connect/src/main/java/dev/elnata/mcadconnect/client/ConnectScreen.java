package dev.elnata.mcadconnect.client;

import dev.elnata.mcadconnect.io.Captura;
import dev.elnata.mcadconnect.io.ConnectPaths;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.components.StringWidget;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;

/**
 * O menu do mCAD Connect.
 *
 * <p>A tela é montada só com componentes do próprio jogo e sem desenho próprio: o visual sai
 * igual ao do resto do Minecraft e o mod não depende do pipeline de renderização, que mudou
 * bastante no 26.x.
 */
public class ConnectScreen extends Screen {
    private static final int[] LADOS = {64, 128, 256};

    private final Screen anterior;
    private int lado = 128;
    private Component recado = Component.empty();
    private StringWidget recadoWidget;
    private Button botaoLado;

    public ConnectScreen(Screen anterior) {
        super(Component.translatable("mcadconnect.title"));
        this.anterior = anterior;
    }

    @Override
    protected void init() {
        int meio = this.width / 2;
        int y = this.height / 4;

        this.addRenderableWidget(new StringWidget(meio - 150, y, 300, 12,
            Component.translatable("mcadconnect.title"), this.font));

        this.botaoLado = this.addRenderableWidget(Button.builder(
                rotuloLado(), b -> {
                    int i = 0;
                    while (i < LADOS.length && LADOS[i] != this.lado) i++;
                    this.lado = LADOS[(i + 1) % LADOS.length];
                    this.botaoLado.setMessage(rotuloLado());
                })
            .bounds(meio - 100, y + 24, 200, 20).build());

        this.addRenderableWidget(Button.builder(
                Component.translatable("mcadconnect.capture"), b -> capturar())
            .bounds(meio - 100, y + 48, 200, 20).build());

        this.addRenderableWidget(new StringWidget(meio - 180, y + 78, 360, 12,
            Component.translatable("mcadconnect.folder", ConnectPaths.raiz().toString()), this.font));

        this.recadoWidget = this.addRenderableWidget(new StringWidget(meio - 180, y + 96, 360, 12,
            this.recado, this.font));

        this.addRenderableWidget(Button.builder(
                Component.translatable("gui.done"), b -> this.onClose())
            .bounds(meio - 100, y + 120, 200, 20).build());
    }

    private Component rotuloLado() {
        return Component.translatable("mcadconnect.size", this.lado, this.lado);
    }

    private void capturar() {
        try {
            Captura.Resultado r = Captura.capturar(this.lado);
            String nome = r.arquivo().getFileName().toString();
            dizer(Component.translatable("mcadconnect.ok", nome, r.colunas(), r.ymin(), r.ymax()));
            if (r.faltando() > 0) {
                dizer(Component.translatable("mcadconnect.partial", r.faltando()));
            }
            McadConnectClient.LOG.info("Captura gravada em {}", r.arquivo());
        } catch (Exception e) {
            dizer(Component.translatable("mcadconnect.erro", String.valueOf(e.getMessage())));
            McadConnectClient.LOG.warn("Falhou a captura", e);
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
