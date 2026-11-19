const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:820},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 const info=()=>pg.evaluate(()=>{const fb=document.querySelector('#fb'),fs2=fb.querySelector('.fbs'),fm=fb.querySelector('.fbmw'),r=fb.getBoundingClientRect();
  const bs=[...fb.querySelectorAll('.fbm')],first=bs[0]&&bs[0].getBoundingClientRect(),last=bs[bs.length-1]&&bs[bs.length-1].getBoundingClientRect();
  return 'campo: '+(fs2.textContent.trim()||'(vazio)')+' · botões: '+bs.map(x=>x.dataset.a).join(',')
   +(first?' · folga esq '+Math.round(first.left-r.left)+'px / dir '+Math.round(r.right-last.right)+'px':'')});
 await pg.evaluate(()=>{openP(newProject());P.els=[];const a=P.levels[0].id;
  // componente comum
  const d=LIB[0];const c=mk(P,'comp',{def:d.id,x1:2.5,z1:2.5},a);P.els.push(c);window.__c=c;
  // grupo
  const g={id:uid(),name:'Meu grupo',cat:'Grupo',grp:1,n:2,cells:[{x:0,y:0,z:0,m:'stone'},{x:1,y:0,z:0,m:'stone'}]};LIB.push(g);
  const gi=mk(P,'comp',{def:g.id,x1:8.5,z1:2.5},a);gi.name='Meu grupo';P.els.push(gi);window.__g=gi;
  const w=mkWall(P,[0.5,8.5],[8.5,8.5],a);w.h=3;P.els.push(w);window.__w=w;
  B=build(P);view='plan';lv=a;cam.s=24;cam.x=5;cam.z=5;tool='sel';render()});
 await pg.evaluate(()=>{sel=__c.id;SELS=[sel];render()});await pg.waitForTimeout(300);
 console.log('1. componente -> '+await info());
 await pg.evaluate(()=>{sel=__g.id;SELS=[sel];render()});await pg.waitForTimeout(300);
 console.log('2. grupo -> '+await info());
 await pg.evaluate(()=>{sel=__w.id;SELS=[sel];render()});await pg.waitForTimeout(300);
 console.log('3. parede -> '+await info());
 console.log('4. barra de propriedades do grupo tem troca de componente: '+await pg.evaluate(()=>{sel=__g.id;SELS=[sel];render();return $('#props').innerHTML.includes('data-k="def"')}));
 console.log('   do componente comum: '+await pg.evaluate(()=>{sel=__c.id;SELS=[sel];render();return $('#props').innerHTML.includes('data-k="def"')}));
 // capturas
 await pg.evaluate(()=>{sel=__c.id;SELS=[sel];render()});await pg.waitForTimeout(350);
 {const r=await pg.evaluate(()=>{const q=document.querySelector('#fb').getBoundingClientRect();return{x:q.x-14,y:q.y-14,width:q.width+28,height:q.height+28}});await pg.screenshot({path:'/tmp/fb_comp.png',clip:r})}
 await pg.evaluate(()=>{sel=__g.id;SELS=[sel];render()});await pg.waitForTimeout(350);
 {const r=await pg.evaluate(()=>{const q=document.querySelector('#fb').getBoundingClientRect();return{x:q.x-14,y:q.y-14,width:q.width+28,height:q.height+28}});await pg.screenshot({path:'/tmp/fb_grupo.png',clip:r})}
 // o lápis do componente abre o editor
 await pg.evaluate(()=>{sel=__c.id;SELS=[sel];render()});await pg.waitForTimeout(250);
 await pg.evaluate(()=>document.querySelector('#fb [data-a^="cedit"]').click());await pg.waitForTimeout(400);
 console.log('5. lápis do componente -> modo de criação: '+await pg.evaluate(()=>CEDIT?CEDIT.name:'não abriu'));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
