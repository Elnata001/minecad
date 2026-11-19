# MineCAD

BIM simplificado para projetar arquitetura de Minecraft. Desenha-se em planta com
elementos de verdade — paredes com tipo e camadas, pisos, pilares, vigas, coberturas,
escadas, portas, janelas, alçapões, paredes-cortina, terreno — e o programa discretiza
tudo em blocos do jogo. A mesma conversão alimenta a vista 3D, os cortes, as tabelas
quantitativas e a exportação, então o que aparece na tela é exatamente o que sai no mundo.

**O aplicativo é um arquivo só.** `index.html` não tem dependência de build nem de
servidor: abrir o arquivo no navegador já é o programa inteiro rodando.

👉 **[Abrir o MineCAD](https://elnata001.github.io/minecad/)**

## O que tem dentro

- **Modelagem em planta** com métodos de desenho (linha, retângulo, polígono, círculo,
  arco, curva), tipos de parede por camadas, componentes e grupos reutilizáveis.
- **Topografia** como superfície matemática: TIN por Delaunay a partir de pontos cotados,
  linhas de ruptura e plataformas, com curvas de nível, hipsometria, perfis de corte e
  conversão em blocos para o jogo.
- **Importação de terreno** por levantamento em CSV ou por recorte do mundo do Minecraft
  (`.mca`, `.nbt` do bloco de estrutura, `.schem` do WorldEdit), lido no próprio navegador.
- **Vista 3D** com texturas do seu próprio pacote de recursos, se você tiver o jogo.
- **Tabelas quantitativas** por elemento e por bloco, e exportação para o Minecraft Java
  com estados de bloco explícitos.

## Organização

| caminho | o que é |
|---|---|
| `index.html` | o aplicativo inteiro |
| `tests/` | ~120 suítes Playwright, o arnês e o duplê do Three.js usado offline |
| `tests/run.sh` | roda todas as suítes contra o `index.html` deste repositório |
| `tools/mkworld.js` | gera o mundo sintético (região, estrutura e esquema) usado nos testes de importação |
| `.github/workflows/` | testes a cada push e publicação no Pages |

## Rodar os testes

```bash
npm i -D playwright && npx playwright install chromium
./tests/run.sh
```

As suítes foram escritas contra caminhos absolutos da máquina de desenvolvimento;
`run.sh` recria esses caminhos antes de rodar, para que o que roda aqui seja byte a
byte o que roda lá. Quatro suítes antigas ficam em `tests/skip.txt`: elas apontam para
APIs internas que mudaram e são mantidas só como referência.

## Histórico

O histórico de código começa na v98. As versões anteriores existem apenas como versões
do artefato no claude.ai e não puderam ser recuperadas como código. Veja o `CHANGELOG.md`.
