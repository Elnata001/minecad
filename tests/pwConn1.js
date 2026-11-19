/* A aba "Do jogo": lê uma captura do mCAD Connect e entrega ao mesmo caminho do
   recorte do mundo, prévia no cursor inclusive. */
const {chromium}=require('playwright'),fs=require('fs');
function captura(w,h,x0,z0){
 const alt=[],blo=[],pal=['grass_block','stone','sand'];
 for(let j=0;j<h;j++)for(let i=0;i<w;i++){
  const borda=i===0||j===0||i===w-1||j===h-1;
  alt.push(borda?null:64+Math.round(6*Math.sin(i/5)*Math.cos(j/5)));
  blo.push(borda?0:(i+j)%7===0?1:0);}
 return JSON.stringify({formato:'mcad-connect/captura',v:1,mundo:'Mundo de teste',
  dimensao:'minecraft:overworld',quando:new Date().toISOString(),
  x0,z0,w,h,pal,alt,blo});}
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);

 console.log(await pg.evaluate(txt=>{openP(newProject());P.els=[];welClose&&welClose();
  const F=ccParse(txt,'teste.mcadcap');
  return 'captura de 40×40 lida:'
   +'\n  recorte: '+F.w+'×'+F.h+' blocos a partir de '+F.x0+'/'+F.z0
   +'\n  colunas com chão: '+F.n+' de '+(F.w*F.h)+' (as bordas vieram vazias de propósito)'
   +'\n  cotas: '+F.zmin+' a '+F.zmax
   +'\n  blocos encontrados: '+[...F.hist].map(([k,v])=>k+'='+v).join(', ')
   +'\n  pontos depois da decimação: '+WPRE.V.length
   +'\n  nome do mundo: '+WIMP.name}, captura(40,40,300,-120)));

 console.log(await pg.evaluate(()=>{const n0=P.els.length;
  wImpGo();
  return 'Criar terreno a partir da captura:'
   +'\n  elementos: '+n0+' -> '+P.els.length+(P.els.length===n0?' (nada ainda — vai pela prévia)':' (ENTROU DIRETO)')
   +'\n  ferramenta: '+tool+' · prévia '+TPEND.w+'×'+TPEND.h+' blocos'
   +'\n  coordenadas de origem oferecidas: '+TPEND.ox+'/'+TPEND.oz}));

 console.log(await pg.evaluate(()=>{toolClick([12,8],[12,8],{});
  const t=P.els[P.els.length-1],q=tinOf(t),bb=topoBB(t);
  return 'assentado com um clique em 12/8:'
   +'\n  terreno: '+t.name+' · '+(t.tp||[]).length+' pontos · '+q.T.length+' triângulos'
   +'\n  centro: '+((bb[0]+bb[2])/2)+'/'+((bb[1]+bb[3])/2)
   +'\n  camadas do tipo: '+(P.types.topo.find(x=>x.id===t.ty)||{ly:[]}).ly.map(l=>l.m+'×'+l.t).join(', ')
   +'\n  cota no centro: '+tinZ(q,(bb[0]+bb[2])/2,(bb[1]+bb[3])/2)}));

 console.log(await pg.evaluate(()=>{
  let r='';try{ccParse('{"formato":"outra coisa"}','x')}catch(e){r=e.message}
  let r2='';try{ccParse('{"formato":"mcad-connect/captura","v":1,"w":2,"h":2,"alt":[1]}','x')}catch(e){r2=e.message}
  return 'arquivos inválidos são recusados com explicação:\n  "'+r+'"\n  "'+r2+'"'}));

 console.log(errs.join('\n')||'sem erros');await b.close()})();
