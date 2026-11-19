const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1200,height:760}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 const prep=async()=>pg.evaluate(()=>{openP(newProject());P.els=[];
  const a=P.levels[0].id,b2=P.levels[1].id;
  const w=mkWall(P,[0.5,0.5],[0.5,7.5],a);w.h=3;w.top=b2;P.els.push(w);
  const r=mk(P,'roof',{pts:[[0.5,0.5],[11.5,0.5],[11.5,7.5],[0.5,7.5]],sp:1,base:b2,off:0},b2);P.els.push(r);
  mutate(()=>{typeOf(P,r.ty).under='stair'});
  const top=()=>{const m=new Map();for(const v of B.vox.values())if(v.o===w.id&&(!m.has(v.z)||m.get(v.z)<v.y))m.set(v.z,v.y);
   return [...m.entries()].sort((x,y)=>x[0]-y[0]).map(([z,y])=>y).join(',')};
  window.__t=top;window.__w=w;window.__r=r;sel=w.id;render();
  return 'livre (restrição superior): '+top()});
 console.log(await prep());
 console.log(await pg.evaluate(()=>{mutate(()=>{__w.att=__r.id});return 'anexada: '+__t()+' | attOf='+attOf(__w)}));
 // estado do botão com a parede anexada
 await pg.waitForTimeout(250);
 console.log(await pg.evaluate(()=>{const b=document.querySelector('.fbx');return 'botão: '+(b?b.dataset.a+' / classes='+b.className+' / title='+b.title:'ausente')}));
 // clicar no botão de desanexar
 await pg.evaluate(()=>document.querySelector('.fbx').click());
 await pg.waitForTimeout(300);
 console.log(await pg.evaluate(()=>'desanexada: '+__t()+' | attOf='+attOf(__w)+' | att='+__w.att+' | tfz='+(__w.tfz?Object.keys(__w.tfz).length+' colunas':'nenhum')));
 console.log(await pg.evaluate(()=>{const b=document.querySelector('.fbx');return 'botão: '+(b?b.dataset.a+' / classes='+b.className+' / title='+b.title:'ausente')}));
 console.log(await pg.evaluate(()=>{const t=document.querySelector('#toast');return 'aviso: '+(t?t.textContent.trim():'')}));
 // undo refaz o vínculo
 console.log(await pg.evaluate(()=>{undo();return 'após desfazer: '+__t()+' | attOf='+attOf(P.els.find(e=>e.cat==='wall'))}));
 console.log(await pg.evaluate(()=>{redo();return 'após refazer: '+__t()+' | attOf='+attOf(P.els.find(e=>e.cat==='wall'))}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
