# Histórico

## mCAD 27 — v27.3.1
**A porta na fachada e no corte usa a textura da metade certa.** Cada célula da vista era pintada
com a textura lateral do bloco, sem dizer qual face estava à mostra. A porta tem textura própria
para a metade de cima e espelha o desenho conforme a dobradiça — e ver a porta por trás espelha de
novo. Sem isso as duas metades saíam iguais, com a cara da metade de baixo, e a porta parecia
cortada ao meio. Era a mesma falha que a vista 3D já tinha corrigido, e a regra agora é a mesma
nas duas.

**Painel de vidro, cerca e muro deixaram de ser pintados duas vezes.** As formas vazadas eram
montadas com os braços partindo do meio da célula, por cima do poste. Em material opaco a
sobreposição não aparecia; no vidro, a faixa do meio levava duas demãos e saía mais escura — a
listra que parecia um painel fora do lugar. Os braços passam a começar na borda do poste. Com os
retângulos sem sobreposição, a conta de quanto a célula está coberta ficou exata: o painel ligado
dos dois lados cobre a célula inteira de novo, e nada atrás dele aparece por engano.

**Alçapão com a forma certa na vista.** Fechado, é a lâmina de 3/16 no topo ou na base; aberto,
fica de pé no lado da dobradiça. Antes era desenhado como um cubo inteiro.

**O aplicativo avisa quando há versão nova.** O atualizador baixava e trocava a versão em
silêncio, e quem estava com o programa aberto só descobria no reinício seguinte. Agora o estado da
atualização chega à janela: enquanto baixa, um aviso discreto no canto; quando termina, o aviso
oferece **Instalar e reiniciar**, e a hora de fazer isso fica com o usuário, que pode salvar o que
está aberto antes. Em **Ajuda › Procurar atualizações…** dá para conferir na hora, com resposta
também quando já se está na versão mais recente.

## mCAD 27 — v27.3.0
**A fachada e o corte viraram prancheta de modelagem.** As vistas ortográficas só serviam para
olhar: nelas o clique não fazia nada. Agora respondem como a planta e o 3D. Clicar seleciona e
arrastar seleciona uma área; o botão direito abre o menu de contexto e desloca a vista; Del exclui;
a barra de propriedades do elemento aparece ali, ancorada nele. A inserção cai no plano do que está
sendo visto: numa célula vazia, na profundidade do vizinho mais próximo; sobre um bloco, encostada
nele — e, no corte, no plano de corte quando não há vizinho. Porta e componente entram na parede
clicada, que é o caso em que modelar pela fachada é mais direto do que pela planta.

**A ferramenta que precisa da planta diz isso, e leva até ela.** Parede, piso, cobertura, cerca,
viga, janela, escada, parede-cortina e as anotações têm por traçado um caminho visto de cima, e na
fachada falta justamente o eixo da profundidade. Em vez de recusar calado, um aviso sobre a vista
explica o motivo e lista as plantas do projeto como botões: escolher uma troca de vista com a
ferramenta já ativa, sem passar pelo navegador de projeto.

**O buraco abaixo da cobertura.** Cada célula da fachada guardava só o bloco mais à frente. Quando
esse bloco era escada, laje, cerca ou porta — formas que não preenchem a célula inteira —, o vazio
dela aparecia na cor do fundo, e o desenho ficava com um bloco faltando logo abaixo de cada degrau
do telhado. A célula passa a guardar uma pilha em ordem de profundidade e a desenhar do fundo para
a frente, parando no primeiro bloco que fecha a célula: pelo vazio da escada vê-se a empena atrás,
como no jogo.

## mCAD 27 — v27.2.1
**Textura nítida na planta.** As texturas têm 16 píxeis de lado e, ampliadas para 120 píxeis
por bloco, o navegador as interpolava: o bloco virava borrão. A vista 3D já pedia nitidez ao
desenhar; a planta não. Agora pede — e continua interpolando quando a vista está afastada, onde
o pixel a pixel faria o desenho cintilar.

**Rótulo nas duas barras de ferramentas.** As ferramentas de edição mostram o nome ao passar o
cursor, como as de modelagem já faziam; na barra da direita o rótulo abre para a esquerda.

**Botão não fica mais preso ao rolar.** Havia um mecanismo que passava o botão sob o cursor
para posição fixa, para ele crescer por cima dos vizinhos — mas a regra de estilo que o fazia
crescer não existe mais. Sobrava o efeito colateral: preso na tela, o botão ficava parado
enquanto a lista rolava por baixo, como se seguisse o cursor. O mecanismo saiu.

**A aba de importação agora se chama só mCAD Connect.**

**mCAD Connect 0.1.2, depois do primeiro teste no jogo.** O botão **mCAD** só existia no
inventário da sobrevivência: o do criativo é outra tela e não herda daquela, de modo que o modo
onde se constrói era o único sem o botão. As duas telas passam a recebê-lo, e ele recua para a
esquerda do painel se não houver espaço à direita. E o menu saía em inglês para quem joga em
português de Portugal — o Minecraft não cai de `pt_pt` para `pt_br` —, o que agora tem arquivo de
idioma próprio. O aviso da aba mCAD Connect, no mCAD, também descrevia um fluxo que não existe
("marque os dois cantos da área"); o mod captura em volta do jogador, no tamanho escolhido.

## mCAD 27 — v27.2.0
**O mCAD Connect, o mod que liga o jogo ao programa.** Mod de cliente para o Minecraft 26.3,
em Fabric, com um botão **mCAD** à direita do painel do inventário e um menu montado com os
componentes do próprio jogo. De um lado ele captura o terreno onde o jogador está — a altura e
o bloco de superfície de cada coluna carregada, em área de 64, 128 ou 256 blocos — e grava numa
pasta de troca. Do outro, cola no mundo o `.schem` que o mCAD exportou, sem varinha, sem seleção
e sem comando: escolher o projeto e clicar basta.

**A ponte é uma pasta, não uma porta de rede.** `Documentos/mCAD/Connect`, com `capturas` de um
lado e `projetos` do outro. Não há servidor local, firewall nem permissão a conceder, e a coisa
funciona com o mCAD fechado: a captura espera ali até a próxima vez que ele abrir.

**No mCAD, os dois sentidos ganharam caminho direto.** A janela de importar terreno tem uma aba
nova, *Do jogo (mCAD Connect)*, que lista as capturas e entrega a escolhida ao mesmo caminho do
recorte do mundo — prévia no cursor inclusive. E a exportação para o Minecraft ganhou **Enviar
para o Minecraft**, que grava o `.schem` direto na pasta que o mod lê, em vez de pedir onde
salvar.

Colar vale por enquanto em mundo de um jogador, onde o cliente tem o servidor integrado ao
lado; num servidor o mod avisa em vez de fingir que colou.

## mCAD 27 — v27.1.1
**O terreno virou um elemento de verdade.** Os pontos cotados, as curvas de nível e as
plataformas sempre pertenceram a um elemento de terreno, mas mover ou girar o elemento
levava só o contorno: a superfície continuava amarrada às cotas antigas, e o terreno passava
a ler pontos que estavam em outro lugar. Agora a transformação vale para os dados de entrada
também — move-se o terreno e a topografia vai junto, sem deixar superfície para trás. Pelo
mesmo motivo, um ponto cotado, uma plataforma ou uma curva de nível desenhados fora de
qualquer terreno deixaram de cair no primeiro terreno do projeto: o ponto solto cria um
terreno próprio e os outros dois avisam qual terreno selecionar.

**Terreno importado entra onde você clicar.** Criar terreno, tanto no levantamento em CSV
quanto no recorte do mundo, não larga mais a superfície nas coordenadas de origem do arquivo
— quase sempre longe do projeto. A importação passa a funcionar como componentes, grupos e
blocos: uma prévia com o contorno e os pontos cotados acompanha o cursor, o clique assenta o
terreno centrado ali, e Esc cancela. Para quem quer o recorte exatamente onde ele estava no
mundo, a barra traz um botão com as coordenadas de origem.

**Área de modelagem maior.** O zoom da planta ia só até 3 pixels por bloco, o que deixava
um recorte grande sem caber na tela nem com Enquadrar projeto; o piso caiu para 0,25 e a
grade passa a mudar de passo — 1 bloco de perto, 16 ao afastar, 64 bem longe. A grade da
vista 3D era fixa em 64×64 blocos e ficava para trás de qualquer terreno importado: agora
acompanha a extensão do modelo, com o espaçamento crescendo junto, e fica centrada no que
existe em vez de na origem.

**Exportar voltou a funcionar fora do claude.ai.** O schematic em `.zip`, os comandos, o
PNG e o PDF da folha e o CSV e o XLSX das tabelas só tinham um caminho de gravação: a
capacidade de download do claude.ai. No aplicativo de desktop e na versão do Pages não havia
nada — daí o "Download indisponível neste ambiente". Agora há um caminho só, que escolhe
conforme o lugar: no aplicativo abre a caixa de diálogo nativa do Windows e grava onde você
escolher, no claude.ai segue pela capacidade de download e no navegador comum baixa pelo
próprio link. O `.zip` passou a ser escrito pelo próprio programa, sem biblioteca externa,
então o schematic sai também sem internet.

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
