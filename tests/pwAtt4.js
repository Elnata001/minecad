const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 const prep=()=>pg.evaluate(()=>{openP(newProject());P.els=[];
  const a=P.levels[0].id,b2=P.levels[1].id;
  const w=mkWall(P,[0.5,0.5],[0.5,7.5],a);w.h=4;w.top=null;P.els.push(w);
  P.els.push(mk(P,'roof',{pts:[[0.5,0.5],[11.5,0.5],[11.5,7.5],[0.5,7.5]],sp:1,base:b2,off:0},b2));
  B=build(P);mutate(()=>{w.att=P.els[1].id});sel=null;SELS=[];tool='sel';render()});
 const nb=()=>pg.evaluate(()=>[...B.vox.values()].filter(v=>v.o===P.els[0].id).length);
 // excluir o hospedeiro: pergunta
 await prep();
 await pg.evaluate(()=>{sel=P.els[1].id;SELS=[sel];del()});await pg.waitForTimeout(300);
 console.log('excluir hospedeiro:',await pg.evaluate(()=>{const d=document.querySelector('#dlg[open]');return d?d.textContent.replace(/\s+/g,' ').slice(0,120):'sem diálogo'}));
 await pg.click('#dlg [data-a="askok"]');await pg.waitForTimeout(300);
 console.log('  manter geometria ->',await pg.evaluate(()=>'elementos '+P.els.length+' · vínculo '+!!P.els[0].att+' · perfil fixo '+!!P.els[0].tfz+' · blocos '+[...B.vox.values()].filter(v=>v.o===P.els[0].id).length));
 await prep();
 await pg.evaluate(()=>{sel=P.els[1].id;SELS=[sel];del()});await pg.waitForTimeout(250);
 await pg.click('#dlg [data-a="askno"]');await pg.waitForTimeout(300);
 console.log('  voltar ao original ->',await pg.evaluate(()=>'vínculo '+!!P.els[0].att+' · perfil fixo '+!!P.els[0].tfz+' · blocos '+[...B.vox.values()].filter(v=>v.o===P.els[0].id).length));
 // mover uma parede com perfil fixo
 await prep();
 await pg.evaluate(()=>{const w=P.els[0];attDetach(w,true)});await pg.waitForTimeout(200);
 const antes=await nb();
 await pg.evaluate(()=>mutate(()=>moveEl(P.els[0],3,0)));await pg.waitForTimeout(200);
 console.log('mover com perfil fixo:',antes,'->',await nb(),'blocos (perfil acompanha)');
 // editar altura de parede anexada avisa
 await prep();
 await pg.evaluate(()=>{sel=P.els[0].id;setp({dataset:{k:'h'},value:'8',type:'number'})});await pg.waitForTimeout(250);
 console.log('editar altura anexada:',await pg.evaluate(()=>{const d=[...document.querySelectorAll('.tst')].pop();return d?d.dataset.t.slice(0,80):'sem aviso'}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
