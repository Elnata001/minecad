const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log('1. ferramentas na barra: '+await pg.evaluate(()=>[...document.querySelectorAll('#tools .tl')].map(b=>b.dataset.a.replace('tool:','')).join(',')));
 console.log('2. grupo do terreno: '+await pg.evaluate(()=>JSON.stringify(SUBT.topo)));
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const o=[];view='plan';lv=P.levels[0].id;
  tool='topo';DMETS.topo='rect';toolClick([0.5,0.5],[0.5,0.5],{});toolClick([30.5,24.5],[30.5,24.5],{});
  const t=P.els[0];tool='tpt';
  for(const p of [[4,4,0],[26,4,5],[26,20,12],[4,20,6],[15,12,14]]){DEF.tpt.z=p[2];topoPt([p[0],p[1]])}
  view='3d';sel=t.id;SELS=[t.id];render();
  const tm=meshes.filter(m=>m.userData&&m.userData.o===t.id);
  o.push('3. malha 3D: '+tm.length+' objeto(s) · vértices '+(tm[0]?tm[0].geometry.attributes.position.count:0)+' (3 por triângulo de '+tinOf(t).T.length+')');
  o.push('   linhas auxiliares no 3D: '+(meshes.length-tm.length-0)+' objeto(s) extras');
  // modos de visualização
  for(const v of ['hyp','flat','tri','none']){mutate(()=>{t.vw=v});render();
   o.push('   modo '+v+': '+meshes.length+' objetos no 3D')}
  mutate(()=>{t.vw='hyp'});
  // seleção em 3D pelo raio
  window.__HIT3=[{object:tm[0],point:{x:15,y:14,z:12},distance:1}];
  const c=ray3({clientX:600,clientY:400});o.push('4. clique no 3D sobre o terreno: id='+(c&&c.id===t.id));
  window.__HIT3=null;
  return o.join('\n')}));
 await pg.evaluate(()=>{view='plan';tool='topo';render()});await pg.waitForTimeout(350);
 await pg.screenshot({path:'/tmp/topo_tools.png',clip:{x:0,y:100,width:420,height:700}});
 console.log(errs.join('\n')||'sem erros');await b.close()})();
