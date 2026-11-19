package dev.elnata.mcadconnect.mixin;

import net.minecraft.client.gui.screens.inventory.AbstractContainerScreen;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.gen.Accessor;

/**
 * O canto do painel do inventário é protegido, e é dele que sai a posição do nosso botão.
 *
 * <p>Calcular pela largura da tela daria no mesmo quase sempre, mas erraria justamente quando
 * o livro de receitas abre e empurra o painel para o lado.
 */
@Mixin(AbstractContainerScreen.class)
public interface ContainerScreenAccessor {
    @Accessor("leftPos")
    int mcad$leftPos();

    @Accessor("topPos")
    int mcad$topPos();

    @Accessor("imageWidth")
    int mcad$imageWidth();

    @Accessor("imageHeight")
    int mcad$imageHeight();
}
