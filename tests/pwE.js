const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:900}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 pg.on('dialog',d=>{errs.push('USOU DIÁLOGO NATIVO: '+d.type());d.dismiss()});
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 // simula o sandbox do artefato: modais nativos ignorados
 await pg.addInitScript(()=>{window.prompt=()=>{console.log('prompt bloqueado');return null};window.confirm=()=>false;window.alert=()=>{}});
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];B=build(P);render()});
 // Novo componente
 await pg.evaluate(()=>dlgComp());await pg.waitForTimeout(300);
 await pg.click('[data-a="cnew"]');await pg.waitForTimeout(300);
 console.log('1. Novo componente ->',(await pg.textContent('#dlg')).replace(/\s+/g,' ').slice(0,70),'| campo:',await pg.inputValue('#askv'));
 await pg.fill('#askv','Vaso de planta');
 await pg.click('[data-a="askok"]');await pg.waitForTimeout(400);
 console.log('2. entrou no modo de criação:',await pg.evaluate(()=>!!CEDIT&&P.name),'| ferramenta',await pg.evaluate(()=>tool));
 // concluir sem blocos
 await pg.click('[data-a="cdone"]');await pg.waitForTimeout(300);
 console.log('3. concluir vazio ->',(await pg.textContent('#props')).replace(/\s+/g,' ').match(/Modele ao menos[^A-Z]*/)||'(sem aviso)');
 // modela e conclui
 await pg.evaluate(()=>{for(const[x,y,m]of[[0,0,'dark_oak_planks'],[0,1,'oak_leaves'in MATS?'oak_leaves':'oak_slab']])P.els.push(mk(P,'block',{x1:x+.5,z1:.5,off:y,mat:m},lv));B=build(P);render()});
 await pg.click('[data-a="cdone"]');await pg.waitForTimeout(500);
 console.log('4. concluído: biblioteca =',await pg.evaluate(()=>LIB.map(d=>d.name).join(', ')));
 console.log('   projeto de volta:',await pg.evaluate(()=>P.name),'| CEDIT',await pg.evaluate(()=>CEDIT===null?'limpo':'AINDA ATIVO'));
 // renomear
 const id=await pg.evaluate(()=>LIB[LIB.length-1].id);
 await pg.click(`[data-a="cren:${id}"]`);await pg.waitForTimeout(300);
 await pg.fill('#askv','Vaso grande');await pg.click('[data-a="askok"]');await pg.waitForTimeout(300);
 console.log('5. renomeado ->',await pg.evaluate(()=>LIB[LIB.length-1].name));
 // excluir com cancelamento e depois confirmação
 await pg.click(`[data-a="cdel:${id}"]`);await pg.waitForTimeout(250);
 await pg.click('[data-a="askno"]');await pg.waitForTimeout(250);
 console.log('6. cancelar exclusão ->',await pg.evaluate(()=>LIB.length),'componentes');
 await pg.evaluate(()=>dlgComp());await pg.waitForTimeout(200);
 await pg.click(`[data-a="cdel:${id}"]`);await pg.waitForTimeout(250);
 await pg.click('[data-a="askok"]');await pg.waitForTimeout(300);
 console.log('   confirmar exclusão ->',await pg.evaluate(()=>LIB.length),'componentes');
 // editar definição com instâncias: escolher "salvar como novo"
 const cad=await pg.evaluate(()=>LIB.find(d=>d.name==='Cadeira').id);
 await pg.evaluate(c=>{DEF.comp.def=c;tool='comp';PK3=null;Y3=null;for(const[x,z]of[[2,2],[4,2]]){const w=mk(P,'comp',{x1:x+.5,z1:z+.5,def:c,rot:0},lv);w.name='Cadeira '+(P.els.length+1);P.els.push(w)}B=build(P);render()},cad);
 await pg.evaluate(()=>dlgComp());await pg.waitForTimeout(200);
 await pg.click(`[data-a="cedit:${cad}"]`);await pg.waitForTimeout(350);
 await pg.evaluate(()=>{P.els.push(mk(P,'block',{x1:.5,z1:1.5,off:0,mat:'oak_planks'},lv));B=build(P);render()});
 await pg.click('[data-a="cdone"]');await pg.waitForTimeout(300);
 console.log('7. pergunta de atualização:',(await pg.textContent('#dlg')).replace(/\s+/g,' ').slice(0,120));
 await pg.click('[data-a="askno"]');await pg.waitForTimeout(500);
 console.log('   "salvar como novo" ->',await pg.evaluate(()=>LIB.map(d=>d.name).join(', ')));
 console.log('   instâncias intactas:',await pg.evaluate(()=>P.els.filter(e=>e.cat==='comp').map(e=>(defOf(e.def)||{}).name+' ('+[...B.vox.values()].filter(v=>v.o===e.id).length+' blocos)').join(' | ')));
 // descartar edição
 await pg.evaluate(()=>{dlgComp()});await pg.waitForTimeout(200);
 await pg.click(`[data-a="cedit:${cad}"]`);await pg.waitForTimeout(300);
 await pg.click('[data-a="ccancel"]');await pg.waitForTimeout(250);
 await pg.click('[data-a="askok"]');await pg.waitForTimeout(400);
 console.log('8. descartar edição -> projeto:',await pg.evaluate(()=>P.name),'| elementos',await pg.evaluate(()=>P.els.length));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
