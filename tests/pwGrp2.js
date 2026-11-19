const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:820}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 const XY=async(x,z)=>pg.evaluate(([x,z])=>{const r=c2.getBoundingClientRect();return[r.left+(x-cam.x)*cam.s+c2.clientWidth/2,r.top+(z-cam.z)*cam.s+c2.clientHeight/2]},[x,z]);
 await pg.evaluate(()=>{openP(newProject());P.els=[];const a=P.levels[0].id;
  const w=mkWall(P,[0.5,0.5],[8.5,0.5],a);w.h=3;P.els.push(w);
  const c=mk(P,'column',{x1:2.5,z1:5.5,h:3},a);P.els.push(c);
  const f=mk(P,'fence',{x1:5.5,z1:5.5,x2:8.5,z2:5.5,h:1},a);P.els.push(f);
  window.__w=w;window.__c=c;window.__f=f;B=build(P);view='plan';lv=a;cam.s=26;cam.x=5;cam.z=4;tool='sel';render()});
 // --- cancelar ---
 await pg.evaluate(()=>{gEnter('Teste',null,null)});await pg.waitForTimeout(250);
 await pg.evaluate(()=>{for(const q of [[2.5,3.5],[3.5,3.5]]){tool='block';toolClick(q,q,{})}});await pg.waitForTimeout(200);
 console.log('1. blocos antes de cancelar: '+await pg.evaluate(()=>gNum()));
 await pg.evaluate(()=>act('gcancel'));await pg.waitForTimeout(250);
 console.log('   após cancelar: modo '+await pg.evaluate(()=>GED?'aberto':'fechado')+' · elementos '+await pg.evaluate(()=>P.els.length)+' · blocos '+await pg.evaluate(()=>B.vox.size));
 // --- agrupar pela seleção ---
 console.log('2. menu de contexto com 2 selecionados: '+await pg.evaluate(()=>{sel=__c.id;SELS=[__c.id,__f.id];render();
   cmOpen(300,300,__c.id);const t=[...document.querySelectorAll('#cmx [data-cm]')].map(x=>x.dataset.cm).join(',');cmClose();return t}));
 await pg.evaluate(()=>{sel=__c.id;SELS=[__c.id,__f.id];gFromSel()});await pg.waitForTimeout(250);
 await pg.evaluate(()=>{document.querySelector('#askv').value='Pilar e cerca';act('askok')});await pg.waitForTimeout(350);
 console.log('   agrupado: '+await pg.evaluate(()=>{const g=P.els.find(e=>e.cat==='comp'),d=g&&defOf(g.def);
  return (g?g.name+' · '+d.n+' blocos · grp='+d.grp:'falhou')+' · elementos no projeto: '+P.els.length+' · blocos: '+B.vox.size}));
 // --- editar forma abre o grupo ---
 await pg.evaluate(()=>{const g=P.els.find(e=>e.cat==='comp');sel=g.id;SELS=[g.id];tool='sel';render()});
 await pg.waitForTimeout(300);
 console.log('3. painel do grupo: '+await pg.evaluate(()=>[...document.querySelectorAll('#fb .fbm')].map(x=>x.dataset.a+' ('+x.title+')').join(' · ')));
 const gid=await pg.evaluate(()=>P.els.find(e=>e.cat==='comp').id);
 await pg.evaluate(()=>document.querySelector('#fb [data-a="gedit"]').click());await pg.waitForTimeout(350);
 console.log('4. editando: modo '+await pg.evaluate(()=>GED?GED.name:'—')+' · blocos explodidos '+await pg.evaluate(()=>gNum())+' · instância sumiu: '+await pg.evaluate(()=>!P.els.some(e=>e.cat==='comp')));
 await pg.evaluate(()=>{tool='block';DEF.block.mat='stone';DEF.block.off=3;toolClick([2.5,5.5],[2.5,5.5],{})});await pg.waitForTimeout(200);
 await pg.evaluate(()=>act('gdone'));await pg.waitForTimeout(350);
 console.log('5. após editar: '+await pg.evaluate(id=>{const g=P.els.find(e=>e.cat==='comp'),d=g&&defOf(g.def);
  return 'mesma instância: '+(g&&g.id===id)+' · blocos na def: '+(d?d.n:'—')+' · defs na biblioteca: '+LIB.filter(x=>x.grp).length},gid));
 console.log('   desfazer/refazer: '+await pg.evaluate(()=>{const n0=B.vox.size;undo();const n1=B.vox.size;redo();return n0+' -> '+n1+' -> '+B.vox.size}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
