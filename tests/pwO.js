const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1300,height:850}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 pg.on('dialog',d=>{errs.push('MODAL NATIVO');d.dismiss()});
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.addInitScript(()=>{window.prompt=()=>null;window.confirm=()=>false;window.alert=()=>{}});
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 // o programa abre na tela inicial: sai dela como o usuário sairia
 await pg.evaluate(()=>welClose());
 // 1) criação com seletor de categoria
 await pg.evaluate(()=>cEnter('Módulo de parede',null));await pg.waitForTimeout(300);
 const cats=await pg.evaluate(()=>{const c=document.querySelector('#cfb');const sel=c.querySelector('[data-ce="c"]');
  const op=[...c.querySelectorAll('[data-ce="c"] option')].map(o=>o.textContent);
  return{tipo:sel?sel.tagName:'(nenhum)',opcoes:op.join(', ')}});
 console.log('1. categoria:',cats.tipo,'->',cats.opcoes);
 await pg.evaluate(()=>{CEDIT.cat='Paredes';
  for(let y=0;y<3;y++)for(let x=0;x<2;x++)P.els.push(mk(P,'block',{x1:x+.5,z1:.5,off:y,mat:y===1?'glass':'stone_bricks'},lv));
  B=build(P);render()});
 await pg.click('[data-a="cdone"]');await pg.waitForTimeout(500);
 console.log('   salvo:',await pg.evaluate(()=>{const d=LIB[LIB.length-1];return d.name+' / '+d.cat+' / '+d.cells.length+' células'}));
 // 2) tipo de parede com o componente
 await pg.evaluate(()=>{$('#dlg').close();dlgTypes()});await pg.waitForTimeout(300);
 const cid=await pg.evaluate(()=>'comp:'+LIB[LIB.length-1].id);
 console.log('2. componente na janela de tipos:',(await pg.textContent('#dlg')).includes('Módulo de parede'));
 await pg.evaluate(c=>{const ty=P.types.wall[0];ty.layers=[{mat:'oak_planks',t:1},{mat:'stone',t:1}];
  const t={dataset:{ty:ty.id,f:'mat',i:'0'},value:c};tyEdit(t);dlgTypes()},cid);
 await pg.waitForTimeout(300);
 console.log('   ao escolher: camadas =',await pg.evaluate(()=>P.types.wall[0].layers.map(l=>l.mat).join(', ')));
 console.log('   + Camada neste tipo:',await pg.evaluate(()=>{const tp=[...document.querySelectorAll('#dlg .tp')][0];return tp.querySelector('[data-a^="lyadd"]')?'AINDA EXISTE':'oculto'}),
   '| aviso:',(await pg.textContent('#dlg')).includes('própria composição da parede')?'presente':'ausente');
 // 3) desenha a parede e confere o BIM
 await pg.evaluate(c=>{$('#dlg').close();openP(newProject());P.els=[];
  const ty=P.types.wall[0];ty.layers=[{mat:c,t:1}];ty.cls=undefined;const w=mk(P,'wall',{x1:.5,z1:.5,x2:8.5,z2:.5,ty:ty.id,h:6,off:0},lv);P.els.push(w);B=build(P);sel=w.id;SELS=[w.id];render()},cid);
 await pg.waitForTimeout(300);
 console.log('3. painel da parede:',(await pg.textContent('#pp')).replace(/\s+/g,' ').slice(0,230));
 console.log('   categoria BIM:',await pg.evaluate(()=>B.cats[sel]),'| blocos:',await pg.evaluate(()=>B.per[sel]));
 // 4) componente de piso aparece na ferramenta Piso
 await pg.evaluate(()=>{const d=JSON.parse(JSON.stringify(LIB[LIB.length-1]));d.id=uid();d.name='Ladrilho';d.cat='Pisos';
  d.cells=[{x:0,y:0,z:0,m:'stone_bricks'},{x:1,y:0,z:0,m:'polished_andesite'in MATS?'polished_andesite':'stone'},{x:0,y:0,z:1,m:'polished_andesite'in MATS?'polished_andesite':'stone'},{x:1,y:0,z:1,m:'stone_bricks'}];
  LIB.push(d);libSave();
  P.els=[];const f=mk(P,'floor',{pts:[[.5,.5],[8.5,.5],[8.5,8.5],[.5,8.5]],mat:'comp:'+d.id,t:1,off:0},lv);P.els.push(f);B=build(P);sel=f.id;SELS=[f.id];render()});
 await pg.waitForTimeout(300);
 console.log('4. piso com componente:',await pg.evaluate(()=>{const t=B.tile[sel];return t.n+' cópias, sobra '+t.left}),
  '| opção na lista:',await pg.evaluate(()=>matOpts('floor').some(o=>o[0].indexOf('comp:')===0)));
 console.log('   quantitativo:',await pg.evaluate(()=>JSON.stringify(B.qty)));
 // 5) escadas e coberturas não oferecem componentes
 console.log('5. escada/cobertura sem componentes:',await pg.evaluate(()=>!matOpts('stair').some(o=>o[0].indexOf('comp:')===0)&&!matOpts('roof').some(o=>o[0].indexOf('comp:')===0)));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
