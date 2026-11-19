package dev.elnata.mcadconnect.client;

import dev.elnata.mcadconnect.io.ConnectPaths;
import dev.elnata.mcadconnect.mixin.ContainerScreenAccessor;
import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.screen.v1.ScreenEvents;
import net.fabricmc.fabric.api.client.screen.v1.Screens;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.screens.inventory.InventoryScreen;
import net.minecraft.network.chat.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * mCAD Connect — a ponte entre o jogo e o mCAD 27.
 *
 * <p>O mod é só do cliente: ele lê o mundo carregado para capturar o terreno e devolve o que o
 * mCAD exportou. Nada disso exige servidor dedicado nem alterar o protocolo.
 */
public class McadConnectClient implements ClientModInitializer {
    public static final String ID = "mcadconnect";
    public static final Logger LOG = LoggerFactory.getLogger("mCAD Connect");

    /** Largura do botão ao lado do inventário. Cabe "mCAD" com folga. */
    private static final int BOTAO_L = 42;
    private static final int BOTAO_A = 20;
    private static final int FOLGA = 4;

    @Override
    public void onInitializeClient() {
        if (!ConnectPaths.garantir()) {
            LOG.warn("Não foi possível criar {} — o mod segue, mas sem pasta de troca.", ConnectPaths.raiz());
        } else {
            LOG.info("Pasta de troca com o mCAD: {}", ConnectPaths.raiz());
        }

        /* O botão entra na tela do inventário, encostado à direita do painel. */
        ScreenEvents.AFTER_INIT.register((cliente, tela, larg, alt) -> {
            if (!(tela instanceof InventoryScreen inv)) return;
            ContainerScreenAccessor a = (ContainerScreenAccessor) inv;
            int x = a.mcad$leftPos() + a.mcad$imageWidth() + FOLGA;
            int y = a.mcad$topPos();
            Button b = Button.builder(
                    Component.translatable("mcadconnect.button.open"),
                    botao -> cliente.setScreen(new ConnectScreen(inv)))
                .bounds(x, y, BOTAO_L, BOTAO_A)
                .build();
            Screens.getButtons(tela).add(b);
        });
    }
}
