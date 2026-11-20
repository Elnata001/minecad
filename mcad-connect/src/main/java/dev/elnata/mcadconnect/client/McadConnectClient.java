package dev.elnata.mcadconnect.client;

import dev.elnata.mcadconnect.io.ConnectPaths;
import dev.elnata.mcadconnect.mixin.ContainerScreenAccessor;
import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.screen.v1.ScreenEvents;
import net.fabricmc.fabric.api.client.screen.v1.Screens;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.client.gui.screens.inventory.AbstractContainerScreen;
import net.minecraft.client.gui.screens.inventory.CreativeModeInventoryScreen;
import net.minecraft.client.gui.screens.inventory.InventoryScreen;
import net.minecraft.network.chat.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.Set;

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

    /** Para avisar no log uma vez por tela, e não a cada vez que o inventário abre. */
    private static final Set<String> JA_AVISADO = new HashSet<>();

    @Override
    public void onInitializeClient() {
        if (ConnectPaths.garantir()) {
            LOG.info("Pasta de troca com o mCAD: {}", ConnectPaths.raiz());
        } else {
            LOG.warn("Não foi possível criar {} — o mod segue, mas sem pasta de troca.", ConnectPaths.raiz());
        }

        /* O botão encosta à direita do painel do inventário. São duas telas diferentes: a de
           sobrevivência e a do criativo, que não herdam uma da outra. */
        ScreenEvents.AFTER_INIT.register((cliente, tela, larg, alt) -> {
            if (!inventario(tela)) return;
            ContainerScreenAccessor a = (ContainerScreenAccessor) tela;

            int x = a.mcad$leftPos() + a.mcad$imageWidth() + FOLGA;
            /* Sem espaço à direita (tela estreita ou painel largo), o botão vai para a esquerda
               do painel em vez de sair pela borda. */
            if (x + BOTAO_L > larg) x = a.mcad$leftPos() - BOTAO_L - FOLGA;
            int y = Math.max(FOLGA, a.mcad$topPos());

            Screens.getWidgets(tela).add(Button.builder(
                    Component.translatable("mcadconnect.button.open"),
                    b -> Minecraft.getInstance().gui.setScreen(new ConnectScreen(tela)))
                .bounds(x, y, BOTAO_L, BOTAO_A)
                .build());

            if (JA_AVISADO.add(tela.getClass().getName())) {
                LOG.info("Botão posto em {} ({}, {})", tela.getClass().getSimpleName(), x, y);
            }
        });
    }

    /** O inventário do jogador, nas duas telas em que ele aparece — e em nenhum baú. */
    private static boolean inventario(Screen tela) {
        if (!(tela instanceof AbstractContainerScreen<?>)) return false;
        return tela instanceof InventoryScreen || tela instanceof CreativeModeInventoryScreen;
    }
}
