const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1300,height:850}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 await pg.evaluate(()=>{openP(newProject());P.els=[];
  const mkd=(n,cat,cells)=>{const d={id:uid(),name:n,cat,n:cells.length,cells};LIB.push(d);return d};
  mkd('Pilar 3','Pilares',[0,1,2].map(y=>({x:0,y,z:0,m:'stone_bricks'})));
  mkd('Ladrilho','Pisos',[{x:0,y:0,z:0,m:'stone_bricks'},{x:1,y:0,z:0,m:'cobblestone'},{x:0,y:0,z:1,m:'cobblestone'},{x:1,y:0,z:1,m:'stone_bricks'}]);
  mkd('Viga 4','Vigas',[0,1,2,3].map(x=>({x,y:0,z:0,m:'oak_log'})));
  mkd('Cerca 2','Cercas',[{x:0,y:0,z:0,m:'oak_fence'},{x:1,y:0,z:0,m:'oak_fence'}]);
  libSave();B=build(P);fit();render()});
 console.log('primeira opção da lista de materiais do pilar:',await pg.evaluate(()=>matOpts('column')[0][1]));
 console.log('componentes na lista:',await pg.evaluate(()=>matOpts('column').filter(o=>o[0].indexOf('comp:')===0).map(o=>o[1]).join(', ')));
 const bb=await (await pg.$('#c2')).boundingBox();
 for(const [tool,label] of [['column','Pilar 3'],['floor','Ladrilho'],['beam','Viga 4'],['fence','Cerca 2']]){
  await pg.click(`[data-a="tool:${tool}"]`);await pg.waitForTimeout(250);
  // abre o seletor de material da barra de propriedades e escolhe o componente
  const sel=await pg.$('#pp .sxd[data-k="mat"], #pp .sxd');
  await sel.click();await pg.waitForTimeout(220);
  const opt=await pg.$(`#sxp .sxi:has-text("${label}")`);
  if(!opt){console.log(tool,'-> opção NÃO encontrada no seletor');await pg.keyboard.press('Escape');continue}
  await opt.click();await pg.waitForTimeout(250);
  const draft=await pg.evaluate(t=>DEF[t].mat,tool);
  // insere
  if(tool==='column'){await pg.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);}
  else{await pg.mouse.click(bb.x+bb.width/2-120,bb.y+bb.height/2-80);await pg.waitForTimeout(150);
       await pg.mouse.click(bb.x+bb.width/2+120,bb.y+bb.height/2+80);await pg.keyboard.press('Escape')}
  await pg.waitForTimeout(300);
  const r=await pg.evaluate(t=>{const e=P.els.filter(x=>x.cat===t).pop();if(!e)return{erro:'não criado'};
   return{mat:e.mat,nome:(MATS[e.mat]||[((defOf(compId(e.mat))||{}).name||'?')+' (componente)'])[0],blocos:B.per[e.id]||0}},tool);
  console.log(tool.padEnd(7),'| desenho:',draft,'| criado:',r.mat,'=',r.nome,'|',r.blocos,'blocos');
  await pg.evaluate(()=>{P.els=P.els.filter(e=>false);B=build(P);render()});
 }
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
