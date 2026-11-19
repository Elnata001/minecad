const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1340,height:820},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];
  const a=P.levels[0].id,b2=P.levels[1].id;
  const w=mkWall(P,[0.5,0.5],[0.5,7.5],a);w.h=4;w.top=null;P.els.push(w);
  P.els.push(mk(P,'roof',{pts:[[0.5,0.5],[11.5,0.5],[11.5,7.5],[0.5,7.5]],sp:1,base:b2,off:0},b2));
  B=build(P);sel=w.id;tool='sel';cam={x:6,z:4,s:26};render()});
 await pg.waitForTimeout(350);
 const T=()=>pg.evaluate(()=>{const d=[...document.querySelectorAll('.tst')].pop();return d?d.dataset.t:'—'});
 console.log('botões do painel:',await pg.evaluate(()=>[...document.querySelectorAll('#fb .fbmw button')].map(b2=>b2.title+(getComputedStyle(b2).width==='0px'?' (oculto)':' (visível)')).join(' | ')));
 const g=await pg.$('#fb .fbg');await g.hover();await pg.waitForTimeout(350);
 console.log('ao passar o cursor:',await pg.evaluate(()=>[...document.querySelectorAll('#fb .fbmw button')].map(b2=>b2.title+' '+getComputedStyle(b2).width).join(' | ')));
 await pg.screenshot({path:'/tmp/at1.png',clip:{x:150,y:150,width:760,height:420}});
 await pg.click('#fb [data-a="attach"]');await pg.waitForTimeout(250);
 console.log('modo de seleção:',await pg.evaluate(()=>!!ATTP),'|',await T());
 // clica na cobertura
 await pg.evaluate(()=>{PK3=P.els[1].id;toolClick([6.5,4.5],[6.5,4.5],{});PK3=undefined;render()});
 await pg.waitForTimeout(250);
 console.log('após anexar:',await T(),'| vínculo:',await pg.evaluate(()=>P.els[0].att===P.els[1].id));
 console.log('perfil:',await pg.evaluate(()=>{const H=new Map();[...B.vox.values()].filter(v=>v.o===P.els[0].id).forEach(v=>{if(!H.has(v.z)||H.get(v.z)<v.y)H.set(v.z,v.y)});return[...H.entries()].sort((a,b2)=>a[0]-b2[0]).map(([z,y])=>y).join(',')}));
 console.log('info:',await pg.evaluate(()=>info(P.els[0]).filter(r=>/Topo|Altura|Blocos/.test(r[0])).map(r=>r[0]+': '+r[1]).join(' · ')));
 console.log('botão agora:',await pg.evaluate(()=>{const b2=document.querySelector('#fb [data-a="detach"]');return b2?b2.title:'não trocou'}));
 // desfazer e refazer
 await pg.evaluate(()=>undo());await pg.waitForTimeout(200);
 console.log('desfazer:',await pg.evaluate(()=>'vínculo '+!!P.els[0].att+' · blocos '+[...B.vox.values()].filter(v=>v.o===P.els[0].id).length));
 await pg.evaluate(()=>redo());await pg.waitForTimeout(200);
 console.log('refazer:',await pg.evaluate(()=>'vínculo '+!!P.els[0].att+' · blocos '+[...B.vox.values()].filter(v=>v.o===P.els[0].id).length));
 // desanexar
 await pg.evaluate(()=>act('detach'));await pg.waitForTimeout(250);
 console.log('desanexar:',await T(),'| vínculo',await pg.evaluate(()=>!!P.els[0].att),'· perfil mantido:',await pg.evaluate(()=>{const H=new Map();[...B.vox.values()].filter(v=>v.o===P.els[0].id).forEach(v=>{if(!H.has(v.z)||H.get(v.z)<v.y)H.set(v.z,v.y)});return[...H.entries()].sort((a,b2)=>a[0]-b2[0]).map(([z,y])=>y).join(',')}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
