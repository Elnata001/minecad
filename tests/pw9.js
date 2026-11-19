const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 await pg.evaluate(()=>{openP(newProject());P.els=[];
  const el=(c,ex)=>{const w=mk(P,c,ex,lv);P.els.push(w);return w};
  const w1=el('wall',{x1:.5,z1:2.5,x2:9.5,z2:2.5,t:1,h:4});
  el('window',{x1:4.5,z1:2.5,x2:7.5,z2:2.5,mat:'glass_pane',t:1,off:1,h:2});
  el('wall',{x1:.5,z1:6.5,x2:9.5,z2:6.5,t:1,h:4});
  el('fence',{x1:.5,z1:9.5,x2:6.5,z2:9.5,mat:'oak_fence',h:1});
  B=build(P);fit();render()});
 const bb=await (await pg.$('#c2')).boundingBox();
 const W=await pg.evaluate(()=>{const w=P.els.find(e=>e.cat==='window');const v=[...B.vox.values()].find(v=>v.o===w.id);return[v.x,v.y,v.z]});
 // 1) fundo sob o painel: há bloco da parede embaixo?
 console.log('painel em',W.join(','),'| bloco abaixo:',await pg.evaluate(([x,y,z])=>{const v=B.vox.get(x+','+(y-1)+','+z);return v?v.m+' (dono '+(P.els.find(e=>e.id===v.o)||{}).name+')':'nenhum'},W));
 await pg.screenshot({path:'/tmp/s9.png'});
 // 2) menu de contexto sobre a parede
 const px=await pg.evaluate(([x,,z])=>{const r=document.querySelector('#c2').getBoundingClientRect();return[(x+.5-cam.x)*cam.s+r.width/2+r.left,(z+.5-cam.z)*cam.s+r.height/2+r.top]},W);
 await pg.mouse.click(px[0],px[1],{button:'right'});await pg.waitForTimeout(250);
 console.log('menu:',await pg.evaluate(()=>{const m=document.querySelector('#cmx');return m?[...m.querySelectorAll('[data-cm]')].map(i=>i.textContent).join(' | '):'NÃO ABRIU'}));
 // selecionar elementos da mesma categoria
 await pg.click('[data-cm="selcat"]');await pg.waitForTimeout(200);
 console.log('selecionar elementos ->',await pg.evaluate(()=>SELS.map(i=>(P.els.find(e=>e.id===i)||{}).name).join(', ')));
 // ocultar a parede 1
 await pg.mouse.click(px[0],px[1],{button:'right'});await pg.waitForTimeout(200);
 await pg.click('[data-cm="hide"]');await pg.waitForTimeout(250);
 console.log('após ocultar:',await pg.evaluate(()=>({ocultos:(P.hid||{})['p:'+lv]||[],elementos:P.els.length,blocos:Object.values(B.qty).reduce((a,b)=>a+b,0)})));
 await pg.screenshot({path:'/tmp/s10.png'});
 // reexibir
 await pg.mouse.click(px[0]+200,px[1]+200,{button:'right'});await pg.waitForTimeout(200);
 console.log('menu no vazio:',await pg.evaluate(()=>{const m=document.querySelector('#cmx');return m?[...m.querySelectorAll('[data-cm]')].map(i=>i.textContent).join(' | '):'(nenhum)'}));
 await pg.click('[data-cm="unhide"]');await pg.waitForTimeout(200);
 console.log('após reexibir:',await pg.evaluate(()=>((P.hid||{})['p:'+lv]||[]).length+' ocultos'));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
