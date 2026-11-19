package dev.elnata.mcadconnect.client;

import dev.elnata.mcadconnect.io.ConnectPaths;
import dev.elnata.mcadconnect.mixin.ContainerScreenAccessor;
import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.screen.v1.ScreenEvents;
import net.fabricmc.fabric.api.client.screen.v1.Screens;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.screens.inventory.InventoryScreen;
import net.minecraft.network.chat.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * mCAD Connect — a ponte entre o Minecraft e o mCAD 27.
 *
 * <p>O mod é só do cliente: lê o mundo carregado para capturar o terreno e devolve ao mundo o
 * que o mCAD exportou. Nada disso mexe no protocolo nem exige mod no servidor.
 */
public class McadConnectClient implements ClientModInitializer {
    public static final String ID = "mcadconnect";
    public static final Logger LOG = LoggerFactory.getLogger("mCAD Connect");

    private static final int BOTAO_L = 42;
    private static final int BOTAO_A = 20;
    private static final int FOLGA = 4;

    @Override
    public void onInitializeClient() {
        if (ConnectPaths.garantir()) {
            LOG.info("Pasta de troca com o mCAD: {}", ConnectPaths.raiz());
        } else {
            LOG.warn("Não foi possível criar {} — o mod segue, mas sem pasta de troca.", ConnectPaths.raiz());
        }

        /* O botão encosta à direita do painel do inventário. */
        ScreenEvents.AFTER_INIT.register((cliente, tela, larg, alt) -> {
            if (!(tela instanceof InventoryScreen inv)) return;
            ContainerScreenAccessor a = (ContainerScreenAccessor) inv;
            int x = a.mcad$leftPos() + a.mcad$imageWidth() + FOLGA;
            int y = a.mcad$topPos();
            Screens.getWidgets(tela).add(Button.builder(
                    Component.translatable("mcadconnect.button.open"),
                    b -> Minecraft.getInstance().gui.setScreen(new ConnectScreen(inv)))
                .bounds(x, y, BOTAO_L, BOTAO_A)
                .build());
        });
    }
}
