const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1300,height:850},acceptDownloads:true});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 const zf=JSON.parse(fs.readFileSync('/tmp/zipfiles.json','utf8'));
 await pg.addInitScript(z=>{window.JSZip={loadAsync:async()=>({files:z,file:p=>({async:async()=>z[p]})})}},zf);
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 // projeto com tipo próprio, componente e texturas
 await pg.evaluate(async()=>{const r=await packBuild(new Blob(['x']));PACK=r.tex;PACKN='Texturas.jar';T3.clear();PAT.clear();TXON=true;
  openP(newProject());P.name='Casa de teste';P.els=[];
  const d={id:uid(),name:'Módulo',cat:'Paredes',n:2,cells:[{x:0,y:0,z:0,m:'stone_bricks'},{x:0,y:1,z:0,m:'oak_planks'}]};
  LIB.push(d);libSave();
  P.types.wall[0].layers=[{mat:'comp:'+d.id,t:1}];
  P.mats.push({id:'m1',name:'Pedra da casa',cat:'Alvenaria',block:'stone_bricks',color:'#9a9a9a'});
  P.els.push(mk(P,'wall',{x1:.5,z1:.5,x2:8.5,z2:.5,ty:P.types.wall[0].id,h:4},lv));
  B=build(P);render()});
 // Ctrl+S abre o diálogo
 await pg.keyboard.press('Control+s');await pg.waitForTimeout(300);
 console.log('1. Ctrl+S ->',(await pg.textContent('#dlg')).replace(/\s+/g,' ').slice(0,60));
 console.log('   sem textarea à vista:',await pg.evaluate(()=>!document.querySelector('#dlg textarea')));
 // exporta (sem a API de downloads, cai no link): captura o download
 const [dl]=await Promise.all([pg.waitForEvent('download',{timeout:8000}).catch(()=>null),pg.click('[data-a="fxexp"]')]);
 await pg.waitForTimeout(400);
 console.log('2. download:',dl?dl.suggestedFilename():'(nenhum)','| mensagem:',await pg.textContent('#fxm'));
 const path='/tmp/export.mcad';if(dl)await dl.saveAs(path);
 const st=fs.existsSync(path)?fs.statSync(path).size:0;
 console.log('   arquivo:',Math.round(st/1024),'KB');
 const j=JSON.parse(fs.readFileSync(path,'utf8'));
 console.log('   conteúdo: projeto="'+j.p.name+'" ·',j.p.els.length,'elemento(s) ·',j.lib.length,'componente(s) ·',(j.p.mats||[]).length,'material(is) ·',j.p.types.wall.length,'tipo(s) ·','texturas:',j.pack?Object.keys(j.pack.tex).length+' blocos':'não');
 // importa num "outro dispositivo": limpa biblioteca, texturas e projetos
 await pg.evaluate(()=>{LIB=[];libSave();PACK={};PACKN='';T3.clear();PAT.clear();openP(newProject());P.name='Vazio';render();dlgFile()});
 await pg.waitForTimeout(300);
 await pg.setInputFiles('#fxf',path);
 await pg.click('[data-a="fxpick"]');await pg.waitForTimeout(400);
 console.log('3. prévia:',(await pg.textContent('#fxm2')).replace(/\s+/g,' '));
 await pg.click('[data-a="fximp"]');await pg.waitForTimeout(600);
 console.log('4. importado:',await pg.evaluate(()=>P.name),'|',await pg.evaluate(()=>P.els.length),'elemento(s) |',
  await pg.evaluate(()=>LIB.length),'componente(s) na biblioteca |',await pg.evaluate(()=>Object.keys(PACK).length),'texturas |',
  await pg.evaluate(()=>(P.mats||[]).length),'material(is)');
 console.log('   parede continua com o componente:',await pg.evaluate(()=>{const w=P.els[0];const t=B.tile[w.id];return t?t.n+' cópias de "'+t.name+'"':'SEM COMPONENTE'}));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
