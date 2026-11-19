# mCAD Connect

Mod do Minecraft que liga o jogo ao **mCAD 27**: captura o terreno onde você está para virar
projeto, e cola no mundo o que o mCAD exportou — sem comando nenhum.

- **Minecraft 26.3** · **Fabric** · precisa da **Fabric API**
- Mod de cliente: não exige nada instalado no servidor

## Como usar

Abra o inventário. À direita do painel aparece um botão **mCAD**.

**Capturar terreno.** Escolha a área (64, 128 ou 256 blocos) e clique em *Capturar em volta de
mim*. O mod lê a altura e o bloco de superfície de cada coluna carregada e grava em
`Documentos/mCAD/Connect/capturas`. No mCAD, abra **Terreno → Importar terreno → Do jogo
(mCAD Connect)**: a captura está lá. Escolher e clicar põe o terreno onde o cursor estiver.

Colunas fora do alcance de visão não são lidas — o mod diz quantas ficaram de fora. Se faltar
muita coisa, aumente a distância de renderização ou ande pela área antes de capturar.

**Colar um projeto.** No mCAD, em *Exportar para o Minecraft*, clique em **Enviar para o
Minecraft**: o `.schem` vai direto para `Documentos/mCAD/Connect/projetos`. No jogo, escolha o
projeto no menu e clique em *Colar aqui* — ele é colado a partir de onde você está.
*Manter o que já existe* deixa o ar do projeto passar sem apagar nada; *Limpar o volume* apaga.

Colar só funciona em mundo de um jogador, onde o cliente tem o servidor integrado ao lado.
Num servidor o mod avisa em vez de fingir que colou.

## A pasta de troca

```
Documentos/mCAD/Connect/
├── capturas/     o que o mod gravou, para o mCAD importar
└── projetos/     o que o mCAD exportou, para o mod colar
```

É uma pasta, não uma porta de rede: nada de servidor local, firewall ou permissão, e funciona
com o mCAD fechado — a captura espera ali até a próxima vez que ele abrir.

## Compilar

Precisa de **JDK 25** (o Minecraft 26.x roda em Java 25). O Gradle vem pelo wrapper.

```bash
cd mcad-connect
gradle wrapper        # só na primeira vez, se você não tiver o wrapper
./gradlew build       # o .jar sai em build/libs/
./gradlew runClient   # abre o Minecraft com o mod carregado
```

Quem não quiser instalar nada pega o `.jar` pronto nos artefatos do fluxo
**mod mCAD Connect** no GitHub Actions, ou anexado à release.

### Notas de versão do jogo

O Minecraft 26.x é distribuído **sem ofuscação** — não há linha de `mappings` no `build.gradle`,
e os nomes das classes são os oficiais. Entre o 1.21 e o 26.3 mudaram, entre outros:

| antes | agora |
|---|---|
| `ResourceLocation` | `Identifier` |
| `ResourceKey.location()` | `ResourceKey.identifier()` |
| `Minecraft.setScreen(…)` | `Minecraft.gui.setScreen(…)` |
| `Screens.getButtons(…)` | `Screens.getWidgets(…)` |
| `GuiGraphics` | `GuiGraphicsExtractor`, com desenho em duas fases |

A leitura do `.schem` é feita por um leitor de NBT próprio, em `Schem.java`, e não pelas
classes do jogo: são cem linhas que deixam essa parte imune a essas mudanças.
