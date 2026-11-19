package dev.elnata.mcadconnect.client;

import dev.elnata.mcadconnect.io.ConnectPaths;
import net.minecraft.client.gui.GuiGraphics;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;

/**
 * O menu do mCAD Connect, desenhado com os componentes do próprio jogo para não destoar.
 */
public class ConnectScreen extends Screen {
    private final Screen anterior;

    public ConnectScreen(Screen anterior) {
        super(Component.translatable("mcadconnect.title"));
        this.anterior = anterior;
    }

    @Override
    protected void init() {
        int meio = this.width / 2;
        int y = this.height / 2 - 30;

        this.addRenderableWidget(Button.builder(
                Component.translatable("mcadconnect.tab.capture"), b -> {})
            .bounds(meio - 100, y, 200, 20).build());

        this.addRenderableWidget(Button.builder(
                Component.translatable("mcadconnect.tab.paste"), b -> {})
            .bounds(meio - 100, y + 24, 200, 20).build());

        this.addRenderableWidget(Button.builder(
                Component.translatable("mcadconnect.close"), b -> this.onClose())
            .bounds(meio - 100, y + 60, 200, 20).build());
    }

    @Override
    public void render(GuiGraphics g, int mx, int my, float delta) {
        super.render(g, mx, my, delta);
        g.drawCenteredString(this.font, this.title, this.width / 2, this.height / 2 - 60, 0xFFFFFF);
        g.drawCenteredString(this.font,
            Component.translatable("mcadconnect.folder", ConnectPaths.raiz().toString()),
            this.width / 2, this.height / 2 + 36, 0xA0A0A0);
    }

    @Override
    public void onClose() {
        this.minecraft.setScreen(this.anterior);
    }
}
