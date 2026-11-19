# Histórico

## Manual — novembro de 2026
**O repositório ganhou manual.** `MANUAL.md` traz 23 páginas ilustradas, da primeira parede à
exportação para o jogo, e a mesma coisa como página em `docs/manual/`, publicada junto com o
aplicativo no Pages. As imagens não são montagens: cada uma foi capturada do próprio mCAD com um
projeto real carregado — a Casa de exemplo, com três níveis, cobertura de quatro águas, escada
em L, grupos de blocos e terreno modelado —, inclusive a tabela quantitativa, que é a daquele
projeto. Além do básico da interface, o manual cobre o que não é óbvio: escadas em partes com
patamar, coberturas por contorno e inclinação, tipos, anexar topo, terreno, componentes, grupos
e os atalhos de duas letras.

## mCAD 27 — v27.1.0
**Novo nome e nova identidade.** O programa passa a se chamar **mCAD 27**; MineCAD fica como
nome do projeto. O logo novo entra em todos os lugares: ícone do executável e do instalador,
ícone dos arquivos `.mcad`, marca no cabeçalho, tela inicial e favicon da versão de navegador.
Os títulos visuais mostram só "mCAD"; o Windows trata como "mCAD 27" na barra de título, na
barra de tarefas e no menu Iniciar. A numeração recomeça em 27.1.0 — o atualizador recebeu
`allowDowngrade` para que quem está na v103 consiga fazer a travessia.

**Cara de aplicativo, não de navegador.** O menu nativo do Electron saiu: era ele que trazia
recarregar, zoom e ferramentas de desenvolvedor para a janela. O que havia de útil ali mudou-se
para o menu do próprio programa — Abrir, Salvar, Salvar como, associar o `.mcad` e Sobre —, os
atalhos Ctrl+O e Ctrl+Shift+N passaram a ser tratados pelo programa, e o zoom de navegador ficou
travado em 100%, para Ctrl+roda não desalinhar a interface.

## v103 — jeito de aplicativo
**Ctrl+S grava.** No aplicativo ele sobrescreve o `.mcad` do projeto e só pergunta onde salvar
quando ainda não existe arquivo; Ctrl+Shift+S é o "salvar como". O caminho fica amarrado ao
projeto e volta quando ele é reaberto. Se o arquivo não puder ser gravado, volta a perguntar em
vez de falhar calado. No navegador, onde não há arquivo, o atalho continua abrindo a exportação.

**O arquivo é o documento.** Reabrir um `.mcad` que já é o projeto atual deixou de criar uma
cópia "(importado)" — isso agora só acontece na importação pelo navegador, que é quando o
arquivo de fato vem de fora.

**Clique duplo abre o projeto.** O instalador registrava a extensão, mas faltava o ProgID
apontando para o executável. O programa grava essas chaves em `HKCU` na primeira execução e as
refaz se o caminho mudar; há também um item de menu para refazer a associação à mão.

**Tela inicial.** O programa abre numa tela com os projetos salvos, cada um com uma miniatura
desenhada a partir da própria pegada em planta, mais Novo projeto e Abrir projeto. Volta-se a
ela por Arquivo › Tela inicial ou Ctrl+Shift+N.

## v102 — ponte com o aplicativo desktop
Dentro do Electron o MineCAD passa a conversar com o sistema: o menu nativo abre e salva
`.mcad` por diálogo do Windows, o clique duplo num projeto abre o programa já com ele, e
Desfazer/Refazer respondem pelo menu. No navegador nada disso existe e o bloco fica inerte.

A importação de terreno ganha o caminho curto: o aplicativo lê a pasta `saves` do Minecraft
e a aba *Recorte do mundo* passa a oferecer a lista de mundos instalados e as regiões de
cada um, com a opção de incluir as oito vizinhas — sem procurar arquivo nenhum no disco.

## v101 — importar um recorte do mundo do Minecraft
Novo modo de entrada em *Modelagem → Importar terreno…*, ao lado do levantamento em CSV.
Lê região do mundo (`.mca`, várias de uma vez, com o recorte podendo atravessá-las),
estrutura do bloco de estrutura (`.nbt`) e esquema do WorldEdit (`.schem`/`.schematic`),
tudo no próprio navegador.

Para cada coluna a varredura desce da seção mais alta com blocos até o primeiro que conta
como chão natural, de modo que árvore e construção não virem relevo — o filtro pode ser
desligado, e a lâmina d'água pode ser medida no fundo ou na superfície. O campo de alturas
vira TIN por refinamento sucessivo: a malha nasce grossa e só ganha pontos onde o erro
vertical passa da tolerância pedida. Num recorte de 96×96 com 9.138 colunas de chão,
± 1 bloco resolve com 467 pontos em 120 ms.

O resultado é um terreno comum — perímetro, pontos cotados editáveis, curvas de nível,
plataformas, cortes, quantitativos e exportação. O bloco predominante da superfície vira
um tipo de terreno com as camadas correspondentes.

## v100 — alçapões como elemento
O alçapão deixa de ser bloco cheio e vira elemento próprio, com ferramenta no grupo da
Porta: folha de 3/16 girando numa aresta horizontal, dobradiça nos quatro lados, abertura
para cima ou para baixo, folha aberta ou fechada. Ao ser inserido recorta a célula do piso
e ocupa o lugar dela.

## v99 — sombras ajustáveis, menu enxuto e escada inteira
Intensidade das sombras em planta de 0 a 150%, dentro de *Texturas…*. Menu Visualizar
reduzido a dois itens. Enquadrar projeto passa a ser duplo clique do botão do meio.
Escada vinda do pavimento inferior aparece inteira na planta.

## v98 — sombras projetadas na planta
O bloco mantém o tom da textura e a profundidade passa a vir de sombras projetadas
suaves nas bordas, inclusive dentro dos vãos de porta e janela.
