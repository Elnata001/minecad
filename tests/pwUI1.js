/* Ajustes de interface da v27.2.1: textura nítida na planta, rótulo nas duas barras de
   ferramentas e nenhum botão preso na tela. */
const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1300,height:800}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>welClose&&welClose());

 console.log(await pg.evaluate(()=>{
  const c=document.createElement('canvas');c.width=c.height=256;const g2=c.getContext('2d');
  const v={m:'oak_planks'};
  g2.imageSmoothingEnabled=true;fillCell(g2,v,0,0,64,'top');
  const perto=g2.imageSmoothingEnabled;
  g2.imageSmoothingEnabled=true;fillCell(g2,v,0,0,4,'top');
  const longe=g2.imageSmoothingEnabled;
  return 'interpolação da textura em planta:'
   +'\n  ampliada (64 px/bloco): '+(perto?'LIGADA — borraria':'desligada, pixel a pixel')
   +'\n  reduzida (4 px/bloco):  '+(longe?'ligada, evita o cintilar':'DESLIGADA — cintilaria')}));

 const rot=async(sel,n)=>{const el=(await pg.$$(sel))[n],bb=await el.boundingBox();
  await pg.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2,{steps:4});await pg.waitForTimeout(260);
  return pg.evaluate(()=>{const t=document.getElementById('tlab');
   return t&&t.classList.contains('on')?(t.textContent+' @ '+(t.style.right&&t.style.right!=='auto'?'esquerda':'direita')):'nenhum'})};
 console.log('rótulo ao passar o cursor:'
  +'\n  barra de modelagem: '+await rot('#tools .tl',0)
  +'\n  barra de edição:    '+await rot('#etools .tl',0));

 await pg.mouse.move(650,500,{steps:4});await pg.waitForTimeout(250);
 console.log(await pg.evaluate(()=>{
  const t=document.getElementById('tlab');
  const presos=document.querySelectorAll('.tl[style*="fixed"]').length;
  return 'com o cursor fora das barras:'
   +'\n  rótulo: '+(t&&t.classList.contains('on')?'AINDA VISÍVEL':'escondido')
   +'\n  botões presos na tela: '+presos+(presos?' (SEGUEM O CURSOR)':' (nenhum)')}));

 console.log(await pg.evaluate(()=>{TIMPT='game';dlgTopoImp();
  return 'abas de importar terreno: '+[...document.querySelectorAll('#dlg .ctabs button')].map(x=>x.textContent).join(' · ')}));

 console.log(errs.join('\n')||'sem erros');await b.close()})();
