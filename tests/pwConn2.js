/* Envio direto do projeto para a pasta que o mod lê no jogo. */
const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.addInitScript(()=>{window.__env=[];
  window.mcDesktop={versao:'teste',
   connectGravar:(nome,dados)=>{window.__env.push({nome,b64:dados.length});
    return Promise.resolve('C:\\\\Users\\\\teste\\\\Documents\\\\mCAD\\\\Connect\\\\projetos\\\\'+nome)},
   connectListar:()=>Promise.resolve({pasta:'C:\\\\…\\\\capturas',itens:[]}),
   connectLer:()=>Promise.reject(new Error('sem arquivo'))};});
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);

 console.log(await pg.evaluate(async()=>{openP(newProject());P.els=[];welClose&&welClose();
  const w=mkWall(P,[0.5,0.5],[8.5,0.5],P.levels[0].id);w.h=4;P.els.push(w);
  const f=mk(P,'floor',{pts:[[0,0],[9,0],[9,6],[0,6]],closed:true},P.levels[0].id);P.els.push(f);
  B=build(P);dlgMc();
  const temBotao=!!document.querySelector('[data-a="mcsend"]');
  await mcSend();
  const g=window.__env[0];
  return 'Exportar para o Minecraft pelo mCAD Connect:'
   +'\n  botão aparece no diálogo: '+temBotao
   +'\n  arquivo entregue à ponte: '+(g?g.nome:'NENHUM')+' ('+(g?g.b64:0)+' caracteres em base64)'
   +'\n  aviso: '+(document.querySelector('#mcmsg')||{textContent:''}).textContent}));

 console.log(await pg.evaluate(()=>{TIMPT='game';dlgTopoImp();
  const t=document.querySelector('#dlg').textContent;
  return 'aba de importação:'
   +'\n  tem a aba do mod: '+/mCAD Connect/.test(t)
   +'\n  explica quando está vazia: '+/Nenhuma captura ainda/.test(t)}));

 console.log(errs.join('\n')||'sem erros');await b.close()})();
