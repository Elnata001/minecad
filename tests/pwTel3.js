/* Área de modelagem maior, grade 3D que acompanha o projeto, .zip escrito pelo próprio
   programa e o recorte do mundo entrando pela prévia. */
const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);

 console.log(await pg.evaluate(()=>{
  const larg=c2.clientWidth||900;
  return 'limites de zoom da planta: '+ZMIN+' a '+ZMAX+' px por bloco'
   +'\n  afastado ao máximo cabem ~'+Math.round(larg/ZMIN)+' blocos na largura (antes: '+Math.round(larg/3)+')'}));

 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];
  const t=mk(P,'topo',{pts:[[0,0],[400,0],[400,400],[0,400]],closed:true},P.levels[0].id);
  t.tp=[[10,10,0],[390,10,20],[390,390,5],[10,390,12]];P.els.push(t);
  B=build(P);fit();
  const larg=c2.clientWidth||900;
  return 'terreno de 400x400 blocos, Enquadrar projeto:'
   +'\n  escala resultante: '+cam.s.toFixed(2)+' px/bloco · cabem '+Math.round(larg/cam.s)+' blocos'
   +(cam.s<3?' (o piso antigo de 3 não deixaria)':'')}));

 console.log(await pg.evaluate(()=>{
  const t=P.els[0];
  /* a grade do 3D é recriada conforme a extensão do modelo */
  grid3();const g1=grid.userData.k;
  P.els=[];const s=mk(P,'topo',{pts:[[0,0],[12,0],[12,12],[0,12]],closed:true},P.levels[0].id);
  s.tp=[[1,1,0],[11,1,0],[11,11,0],[1,11,0]];P.els.push(s);B=build(P);grid3();
  return 'grade da vista 3D (tamanho|passo|centro):'
   +'\n  com o terreno de 400 blocos: '+g1
   +'\n  com o de 12 blocos: '+grid.userData.k+(g1!==grid.userData.k?' (acompanhou)':' (NAO MUDOU)')}));

 console.log(await pg.evaluate(()=>{
  const dados=new TextEncoder().encode('conteudo de teste do schematic');
  const z=zipOne('minecad.schem',dados),dv=new DataView(z.buffer);
  const ass=String.fromCharCode(z[0],z[1],z[2],z[3]);
  const fim=z.length-22,eocd=String.fromCharCode(z[fim],z[fim+1],z[fim+2],z[fim+3]);
  return '.zip escrito pelo próprio programa, sem biblioteca externa:'
   +'\n  assinatura local: '+ass+' · fim do arquivo: '+eocd
   +'\n  entradas: '+dv.getUint16(fim+10,true)+' · tamanho total: '+z.length+' bytes para '+dados.length+' de conteúdo'
   +'\n  nome gravado: '+new TextDecoder().decode(z.subarray(30,30+dv.getUint16(26,true)))}));

 console.log(await pg.evaluate(()=>{
  /* num navegador comum o download sai pelo link; a função não depende mais do claude.ai */
  let baixou=null;const criar=document.createElement.bind(document);
  document.createElement=n=>{const e=criar(n);if(n==='a'){const c=e.click.bind(e);e.click=()=>{baixou=e.download}}return e};
  return dlSave('teste.zip',new Uint8Array([1,2,3]),'application/zip').then(r=>{
   document.createElement=criar;
   return 'dlSave fora do claude.ai: ok='+r.ok+' · arquivo oferecido: '+baixou})}));

 console.log(errs.join('\n')||'sem erros');await b.close()})();
