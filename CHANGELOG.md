# Histórico

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
