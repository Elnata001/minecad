const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:800}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];
  const a=P.levels[0].id,b2=P.levels[1].id,o=[];
  const fc=mk(P,'fence',{x1:0.5,z1:0.5,x2:0.5,z2:7.5,h:2},a);P.els.push(fc);
  const cl=mk(P,'column',{x1:3.5,z1:3.5,sx:2,sz:2,h:2,top:null},a);P.els.push(cl);
  const rf=mk(P,'roof',{pts:[[0.5,0.5],[11.5,0.5],[11.5,7.5],[0.5,7.5]],sp:1,base:b2,off:0},b2);P.els.push(rf);
  mutate(()=>{typeOf(P,rf.ty).under='stair'});
  window.__fc=fc;window.__cl=cl;window.__rf=rf;
  const prof=id=>{const m=new Map();for(const v of B.vox.values())if(v.o===id&&(!m.has(v.x+','+v.z)||m.get(v.x+','+v.z)<v.y))m.set(v.x+','+v.z,v.y);
   return [...m.entries()].sort().map(([k,y])=>k+':'+y).join(' ')};
  const n=id=>[...B.vox.values()].filter(v=>v.o===id).length;
  o.push('1. livres -> cerca: '+n(fc.id)+' blocos ['+prof(fc.id)+']');
  o.push('   pilar: '+n(cl.id)+' blocos ['+prof(cl.id)+']');
  o.push('2. hospedeiro válido? cobertura/cerca: '+attOk(fc,rf)+' | cobertura/pilar: '+attOk(cl,rf));
  mutate(()=>{fc.att=rf.id;cl.att=rf.id});
  o.push('3. anexados -> cerca: '+n(fc.id)+' blocos ['+prof(fc.id)+']');
  o.push('   pilar: '+n(cl.id)+' blocos ['+prof(cl.id)+']');
  const base=new Map();for(const v of B.vox.values())if(v.o===rf.id){const k=v.x+','+v.z;if(!base.has(k)||base.get(k)>v.y)base.set(k,v.y)}
  o.push('   face inferior da cobertura nas colunas da cerca: '+[...Array(8).keys()].map(z=>base.get('0,'+z)).join(','));
  o.push('   nas colunas do pilar: '+['3,3','3,4','4,3','4,4'].map(k=>base.get(k)).join(','));
  o.push('4. apoios da cobertura saem sob os anexados: '+[...attCols(P,rf.id)].sort().join(' '));
  return o.join('\n')}));
 // botões do painel
 for(const [nm,v] of [['cerca','__fc'],['pilar','__cl']]){
  await pg.evaluate(k=>{sel=window[k].id;SELS=[sel];tool='sel';render()},v);await pg.waitForTimeout(250);
  console.log('5. painel ('+nm+'): '+await pg.evaluate(()=>{const bs=[...document.querySelectorAll('#fb .fbm')].map(x=>x.dataset.a+(x.className.includes('fbx')?'/oculto-até-passar-o-cursor':'/visível')+(x.className.includes('on')?'/verde':''));return bs.join(' · ')||'sem botões'}));
 }
 // desanexar pelo botão
 await pg.evaluate(()=>{document.querySelector('#fb [data-a="detach"]').click()});await pg.waitForTimeout(300);
 console.log('6. pilar desanexado: '+await pg.evaluate(()=>'att='+__cl.att+' · tfz='+(__cl.tfz?'sim':'não')+' · blocos='+[...B.vox.values()].filter(v=>v.o===__cl.id).length+' · botão='+document.querySelector('#fb .fbm[data-a]').dataset.a));
 console.log('   aviso: '+await pg.evaluate(()=>document.querySelector('#toast .tst, #toast div')?.textContent.trim()||''));
 console.log('7. desfazer: '+await pg.evaluate(()=>{undo();return 'att='+(P.els.find(e=>e.cat==='column').att?'sim':'não')}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
