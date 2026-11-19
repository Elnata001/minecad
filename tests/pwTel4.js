/* O caminho de gravação no aplicativo de desktop: com a ponte presente, o schematic e o
   .zip passam pela caixa de diálogo nativa em vez do download do navegador. */
const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 /* simula o invólucro Electron: a ponte existe, window.claude não */
 await pg.addInitScript(()=>{window.__gravados=[];
  window.mcDesktop={versao:'teste',
   salvarBinario:(nome,dados,bin)=>{window.__gravados.push({nome,bin,tam:dados.length});
    return Promise.resolve('C:\\\\Users\\\\teste\\\\'+nome)}};});
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);

 console.log(await pg.evaluate(()=>'ambiente: ponte do aplicativo '+(window.mcDesktop?'presente':'ausente')
  +' · window.claude '+(window.claude?'presente':'ausente')));

 console.log(await pg.evaluate(async()=>{openP(newProject());P.els=[];welClose&&welClose();
  const w=mkWall(P,[0.5,0.5],[6.5,0.5],P.levels[0].id);w.h=3;P.els.push(w);B=build(P);
  dlgMc();await mcExport('mcschem');
  const g=window.__gravados[window.__gravados.length-1];
  return 'Exportar schematic (.zip):'
   +'\n  arquivo: '+(g?g.nome:'NADA GRAVADO')+' · binário: '+(g&&g.bin)+' · '+(g?g.tam:0)+' bytes em base64'
   +'\n  aviso na tela: '+(document.querySelector('#mcmsg')||{textContent:''}).textContent}));

 console.log(await pg.evaluate(async()=>{await mcExport('mccmd');
  const g=window.__gravados[window.__gravados.length-1];
  return 'Exportar comandos (.txt): '+(g?g.nome:'NADA GRAVADO')+' · binário: '+(g&&g.bin)}));

 console.log(await pg.evaluate(async()=>{
  /* tabelas quantitativas: o CSV tinha o mesmo defeito */
  view='table';tbExport('tbcsv');await new Promise(r=>setTimeout(r,120));
  const g=window.__gravados[window.__gravados.length-1];
  return 'Exportar tabela (.csv): '+(g?g.nome:'NADA GRAVADO')+' · binário: '+(g&&g.bin)}));

 console.log(await pg.evaluate(async()=>{
  window.mcDesktop.salvarBinario=()=>Promise.resolve(null);   /* usuário cancela a caixa */
  await mcExport('mcschem');
  return 'cancelar na caixa de diálogo: '+(document.querySelector('#mcmsg')||{textContent:''}).textContent}));

 console.log(errs.join('\n')||'sem erros');await b.close()})();
