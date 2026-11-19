const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860}});
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const a=P.levels[0].id,o=[];
  const w=mkWall(P,[0.5,0.5],[8.5,0.5],a);w.h=3;P.els.push(w);
  const st=mk(P,'stair',{pts:[[2.5,12.5],[2.5,16.5]],w:2},a);P.els.push(st);
  B=build(P);view='plan';lv=a;render();
  let mx=0,who='';
  const chk=n=>{const ps=document.querySelector('#pp .pps');
   for(const c of ps.children){const h=c.offsetHeight;if(h>mx){mx=h;who=n+' › '+c.className+' "'+c.textContent.trim().slice(0,40)+'"'}}};
  tool='sel';for(const e of P.els){sel=e.id;SELS=[e.id];render();chk('sel '+e.cat)}
  sel=null;SELS=[];
  for(const t of ['sel','move','block','comp','wall','floor','column','door','window','stair','roof','beam','fence','curtain','cut','dim','txt','ln','tag','trim','split','rot']){tool=t;render();chk('fer '+t)}
  tool='sel';sel=w.id;SELS=[w.id,st.id];render();chk('multi');
  o.push('conteúdo mais alto: '+mx+'px em '+who);
  return o.join('\n')}));
 await b.close()})();
