/* Terreno importado entra posicionado pelo cursor, como componentes e blocos. */
const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);

 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];welClose&&welClose();
  /* um levantamento em CSV longe da origem, como sai de um arquivo de campo */
  TIMP={sep:',',dec:'.',cx:0,cy:1,cz:2,sc:1,hdr:false,name:'Levantamento',
   rows:[['900','700','12'],['940','700','15'],['940','740','18'],['900','740','11'],['920','720','14']]};
  const n0=P.els.length;tImpGo();
  return 'depois de Criar terreno:'
   +'\n  elementos no projeto: '+n0+' -> '+P.els.length+(P.els.length===n0?' (nada foi inserido ainda — correto)':' (INSERIU DIRETO)')
   +'\n  ferramenta ativa: '+tool+(tool==='tplace'?' (prévia no cursor)':' (ERRADO)')
   +'\n  extensão da prévia: '+TPEND.w+'x'+TPEND.h+' blocos, '+TPEND.el.tp.length+' pontos'}));

 console.log(await pg.evaluate(()=>{
  const t=TPEND.el,bb=topoBB(t);
  return 'a prévia já vem centrada na origem: extensão X '+bb[0]+' a '+bb[2]+', Z '+bb[1]+' a '+bb[3]}));

 console.log(await pg.evaluate(()=>{
  toolClick([30,20],[30,20],{});
  const t=P.els[P.els.length-1],bb=topoBB(t);
  const cx=(bb[0]+bb[2])/2,cz=(bb[1]+bb[3])/2;
  return 'clique em 30/20:'
   +'\n  elementos: '+P.els.length+' · ferramenta: '+tool+' · selecionado: '+(sel===t.id)
   +'\n  centro do terreno: '+cx+'/'+cz+(Math.abs(cx-30)<=1&&Math.abs(cz-20)<=1?' (assentou no cursor)':' (FORA DO CURSOR)')
   +'\n  cota consultada no centro: '+tinZ(tinOf(t),cx,cz)
   +'\n  TPEND limpo: '+(TPEND===null)}));

 console.log(await pg.evaluate(()=>{
  TIMP.name='Segundo';const n0=P.els.length;tImpGo();
  const t0=tool;topoPlaceCancel(false);
  return 'Esc durante o posicionamento: ferramenta '+t0+' -> '+tool+' · elementos '+n0+' -> '+P.els.length
   +(P.els.length===n0?' (nada entrou)':' (ENTROU MESMO ASSIM)')}));

 console.log(errs.join('\n')||'sem erros');await b.close()})();
