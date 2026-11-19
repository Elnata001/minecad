const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1440,height:900}});
 const errs=[];pg.on('pageerror',e=>errs.push('PAGEERROR '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 const out=await pg.evaluate(()=>{
  openP(newProject());P.els=[];
  const el=(c,ex)=>{const w=mk(P,c,ex,lv);P.els.push(w);return w};
  el('fence',{x1:.5,z1:.5,x2:3.5,z2:.5,mat:'oak_fence',h:1});
  el('fence',{x1:.5,z1:4.5,x2:4.5,z2:4.5,mat:'cobblestone_wall',h:1});
  const w=el('wall',{x1:.5,z1:8.5,x2:8.5,z2:8.5,t:1,h:4});
  el('window',{x1:2.5,z1:8.5,x2:5.5,z2:8.5,mat:'glass_pane',t:1,off:1,h:2});
  const d1=el('door',{host:w.id,pos:1}),d2=el('door',{host:w.id,pos:2});
  const uu=doorAxes(w,d1).u;d1.dir=dirIdx(DOORC[0][0],hgFromVec(w,[uu[0],uu[1]]));d2.dir=dirIdx(DOORC[0][0],hgFromVec(w,[-uu[0],-uu[1]]));
  B=build(P);setView('3d');
  const g={};for(const m of meshes){const k=m.geometry.__k+(m.material.transparent?' [transp]':'')+(m.material.alphaTest?' [recorte]':'');g[k]=(g[k]||0)+m.count}
  return{geo:g,malhas:meshes.length,txon:TXON}});
 console.log('texturas ligadas:',out.txon,'| malhas:',out.malhas);
 for(const k of Object.keys(out.geo).sort())console.log('  ',k.padEnd(28),out.geo[k]);
 // planta
 await pg.evaluate(()=>{setView('plan');fit();render()});await pg.waitForTimeout(400);
 await pg.screenshot({path:'/tmp/s5.png'});
 // fachada
 await pg.evaluate(()=>{const v=P.views&&P.views[0];if(v){SVID=v.id;setView('sec')}});await pg.waitForTimeout(400);
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
