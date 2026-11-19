const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1300,height:850}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 // o programa abre na tela inicial: sai dela como o usuário sairia
 await pg.evaluate(()=>welClose());
 await pg.evaluate(()=>cEnter('Teste',null));await pg.waitForTimeout(300);
 await pg.click('#cfb [data-ce="c"]');await pg.waitForTimeout(250);
 console.log('1. categorias oferecidas:',await pg.evaluate(()=>[...document.querySelectorAll('#sxp .sxi')].map(x=>x.textContent.trim()).join(' · ')));
 await pg.keyboard.press('Escape');await pg.waitForTimeout(150);
 await pg.evaluate(()=>{CEDIT.cat='Pilares';for(let y=0;y<2;y++)P.els.push(mk(P,'block',{x1:.5,z1:.5,off:y,mat:y?'stone_brick_slab':'stone_bricks'},lv));B=build(P);render()});
 await pg.click('[data-a="cdone"]');await pg.waitForTimeout(400);
 await pg.evaluate(()=>{$('#dlg').close()});
 // pilar usando o componente
 await pg.evaluate(()=>{openP(newProject());P.els=[];const d=LIB[LIB.length-1];
  const c=mk(P,'column',{x1:.5,z1:.5,mat:'comp:'+d.id,sx:1,sz:1,h:7,off:0},lv);P.els.push(c);
  B=build(P);tool='sel';sel=c.id;SELS=[c.id];render()});
 await pg.waitForTimeout(300);
 console.log('2. painel do pilar:',(await pg.textContent('#pp')).replace(/\s+/g,' ').slice(0,260));
 console.log('   categoria BIM:',await pg.evaluate(()=>B.cats[sel]),'| cópias:',await pg.evaluate(()=>B.tile[sel].n),'| sobra:',await pg.evaluate(()=>B.tile[sel].left));
 // desfazer/refazer e salvar
 await pg.evaluate(()=>{mutate(()=>{P.els[0].h=9})});await pg.waitForTimeout(200);
 console.log('3. após alterar a altura para 9:',await pg.evaluate(()=>B.tile[sel].n),'cópias');
 await pg.evaluate(()=>undo());await pg.waitForTimeout(200);
 console.log('   desfazer ->',await pg.evaluate(()=>P.els[0].h),'de altura,',await pg.evaluate(()=>B.tile[P.els[0].id].n),'cópias');
 console.log('   projeto guarda a definição:',await pg.evaluate(()=>{save();const p=load(P.id);return (p.comps||[]).length+' definição(ões)'}));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
