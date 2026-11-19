const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1200,height:800}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 const zf=JSON.parse(fs.readFileSync('/tmp/zipfiles.json','utf8'));
 // JSZip mínimo com os arquivos reais do .jar, para exercitar packBuild sem rede
 await pg.addInitScript(z=>{window.__ZF=z;window.JSZip={loadAsync:async()=>({files:z,file:p=>({async:async()=>z[p]})})}},zf);
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 const r=await pg.evaluate(async()=>{
  const r2=await packBuild(new Blob(['x']));PACK=r2.tex;PACKN='Texturas.jar';T3.clear();PAT.clear();TXON=true;
  const px=(c,x,y,w,h)=>avgRGB(c,x,y,w,h).map(Math.round);
  const g=PACK.grass_block,d=PACK.oak_door;
  return{blocos:r2.n,
   grama:{lado_faixa:px(g.s,0,0,g.s.width,4),topo:px(g.t,0,0,g.t.width,g.t.height),fundo:g.b?px(g.b,0,0,g.b.width,g.b.height):null},
   porta:{tem_topo:!!d.t,base:px(d.s,0,0,d.s.width,d.s.height),topo:d.t?px(d.t,0,0,d.t.width,d.t.height):null,iguais:d.t?d.s.toDataURL()===d.t.toDataURL():null}}});
 console.log('blocos lidos:',r.blocos);
 console.log('grama -> faixa verde do lado:',r.grama.lado_faixa.join(','),'| topo depois do tingimento:',r.grama.topo.join(','),'| fundo (terra):',r.grama.fundo.join(','));
 console.log('porta -> tem textura de topo:',r.porta.tem_topo,'| base',r.porta.base.join(','),'| topo',(r.porta.topo||[]).join(','),'| iguais?',r.porta.iguais);
 // variantes de textura da porta no 3D
 console.log('variantes:',await pg.evaluate(()=>{const v={m:'oak_door',dw:{}};
  return ['d','dt','dr','dtr'].map(f=>f+'='+(txOf(v,f)===PACK.oak_door.t?'topo':txOf(v,f)===PACK.oak_door.s?'base':'espelhada')).join(' · ')}));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
