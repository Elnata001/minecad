const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:820}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 const XY=async(x,z)=>pg.evaluate(([x,z])=>{const r=c2.getBoundingClientRect();return[r.left+(x-cam.x)*cam.s+c2.clientWidth/2,r.top+(z-cam.z)*cam.s+c2.clientHeight/2]},[x,z]);
 await pg.evaluate(()=>{openP(newProject());P.els=[];const a=P.levels[0].id;
  const w=mkWall(P,[0.5,0.5],[8.5,0.5],a);w.h=3;P.els.push(w);window.__w=w;
  B=build(P);view='plan';lv=a;cam.s=26;cam.x=5;cam.z=4;tool='sel';render()});
 // 1. biblioteca -> Novo grupo
 await pg.evaluate(()=>dlgComp());await pg.waitForTimeout(200);
 console.log('1. botão na biblioteca: '+await pg.evaluate(()=>!!document.querySelector('[data-a="gnew"]')));
 await pg.evaluate(()=>act('gnew'));await pg.waitForTimeout(200);
 await pg.evaluate(()=>{document.querySelector('#askv').value='Banco';act('askok')});await pg.waitForTimeout(300);
 console.log('2. modo de grupo: '+await pg.evaluate(()=>!!GED&&GED.name)+' · ferramenta: '+await pg.evaluate(()=>tool)+' · vista: '+await pg.evaluate(()=>view));
 await pg.evaluate(()=>{view='plan';render()});await pg.waitForTimeout(250);
 console.log('   barra flutuante: '+await pg.evaluate(()=>{const c=document.querySelector('#cfb');return getComputedStyle(c).display+' · '+[...c.querySelectorAll('button')].map(b=>b.dataset.a).join(',')}));
 console.log('   barra de edição: '+await pg.evaluate(()=>[...document.querySelectorAll('#etools .tl')].map(b=>b.dataset.a).join(',')));
 console.log('   ferramentas esmaecidas: '+await pg.evaluate(()=>[...document.querySelectorAll('#tools .tl')].filter(b=>b.className.includes('dim')).length+' de '+document.querySelectorAll('#tools .tl').length));
 console.log('   trocar para Parede: '+await pg.evaluate(()=>{act('tool:wall');return tool}));
 // 3. posiciona 3 blocos
 await pg.evaluate(()=>{DEF.block.mat='oak_planks';DEF.block.off=0;render()});
 for(const [x,z] of [[2.5,3.5],[3.5,3.5],[4.5,3.5]]){const q=await XY(x,z);await pg.mouse.move(q[0],q[1]);await pg.mouse.down();await pg.mouse.up();await pg.waitForTimeout(120)}
 console.log('3. blocos no grupo: '+await pg.evaluate(()=>gNum()));
 // 4. ancorar na parede
 await pg.evaluate(()=>act('tool:anchor'));await pg.waitForTimeout(150);
 {const q=await XY(4.5,0.5);await pg.mouse.move(q[0],q[1]);await pg.waitForTimeout(150);
  console.log('4. destaque na parede (fora do grupo): '+await pg.evaluate(()=>EHOV===__w.id));
  await pg.mouse.down();await pg.mouse.up();await pg.waitForTimeout(250)}
 console.log('   ancorado: '+await pg.evaluate(()=>GED.anc&&GED.anc.h===__w.id)+' · ferramenta volta a: '+await pg.evaluate(()=>tool));
 // 5. concluir
 await pg.evaluate(()=>act('gdone'));await pg.waitForTimeout(350);
 console.log('5. '+await pg.evaluate(()=>{const g=P.els.find(e=>e.cat==='comp'),d=g&&defOf(g.def);
  return 'instância: '+(g?g.name:'nenhuma')+' · def grupo: '+(d?d.grp+' com '+d.n+' blocos':'—')+' · âncora: '+JSON.stringify(g&&g.anc)+' · modo: '+(GED?'aberto':'fechado')}));
 console.log('   blocos do projeto: '+await pg.evaluate(()=>B.vox.size)+' · quantitativo de tábuas: '+await pg.evaluate(()=>B.qty.oak_planks||0));
 // 6. mover a parede leva o grupo junto
 console.log('6. '+await pg.evaluate(()=>{const g=P.els.find(e=>e.cat==='comp');
  const a0=[...B.vox.values()].filter(v=>v.o===g.id).map(v=>v.x+','+v.y+','+v.z).sort()[0];
  sel=__w.id;SELS=[__w.id];mutate(()=>moveSel(0,4));
  const a1=[...B.vox.values()].filter(v=>v.o===g.id).map(v=>v.x+','+v.y+','+v.z).sort()[0];
  return 'grupo antes '+a0+' -> depois de mover a parede 4 em Z: '+a1}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
