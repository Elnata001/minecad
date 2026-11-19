const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1300,height:850},acceptDownloads:true});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 // simula a plataforma: claude.use('downloads').save com a lista de extensões reais
 await pg.addInitScript(()=>{window.__saved=[];
  const OK=['gif','png','jpg','jpeg','webp','mp4','webm','mov','txt','json','md','docx','pptx','epub','csv','ttf','html','svg','pdf','xlsx','zip','fig'];
  window.claude={use:async n=>n==='downloads'?{save:async({filename,data})=>{
   const ext=filename.split('.').pop().toLowerCase();
   if(!OK.includes(ext)){const e=new Error('extensão não aceita');e.code='rejected_extension';throw e}
   window.__saved.push({filename,bytes:(data&&data.length)||0});return{status:'saved'}}}:null}});
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.name='Casa de exemplo';B=build(P);render();dlgFile()});
 await pg.waitForTimeout(300);
 await pg.click('[data-a="fxexp"]');await pg.waitForTimeout(600);
 console.log('1. exportar projeto ->',await pg.textContent('#fxm'));
 console.log('   arquivos entregues:',await pg.evaluate(()=>window.__saved.map(x=>x.filename+' ('+Math.round(x.bytes/1024)+' KB)').join(', ')));
 // componente
 await pg.evaluate(()=>{$('#dlg').close();cExp(LIB[0].id)});await pg.waitForTimeout(250);
 await pg.click('[data-a^="cdl:"]');await pg.waitForTimeout(500);
 console.log('2. exportar componente ->',await pg.textContent('#cm'));
 // importação por arquivo: escreve o .mcad entregue e lê de volta
 const data=await pg.evaluate(()=>JSON.stringify(mcadBundle(false)));
 fs.writeFileSync('/tmp/p.mcad.json',data);
 await pg.evaluate(()=>{$('#dlg').close();dlgFile()});await pg.waitForTimeout(250);
 await pg.setInputFiles('#fxf','/tmp/p.mcad.json');await pg.click('[data-a="fxpick"]');await pg.waitForTimeout(400);
 console.log('3. ler arquivo ->',(await pg.textContent('#fxm2')).replace(/\s+/g,' ').slice(0,110));
 // componente por arquivo
 const cj=await pg.evaluate(()=>JSON.stringify({mcomp:1,def:LIB[0]}));
 fs.writeFileSync('/tmp/c.mcomp.json',cj);
 await pg.evaluate(()=>{$('#dlg').close();cImp()});await pg.waitForTimeout(250);
 console.log('4. janela de importação sem caixa de texto:',await pg.evaluate(()=>!document.querySelector('#dlg textarea')));
 await pg.setInputFiles('#cjf','/tmp/c.mcomp.json');await pg.click('[data-a="cimpgo"]');await pg.waitForTimeout(400);
 console.log('   prévia:',(await pg.textContent('#cprev')).replace(/\s+/g,' ').slice(0,100));
 // recusa do usuário
 await pg.evaluate(()=>{window.claude.use=async n=>n==='downloads'?{save:async()=>{const e=new Error('no');e.code='declined';throw e}}:null;$('#dlg').close();dlgFile()});
 await pg.waitForTimeout(250);await pg.click('[data-a="fxexp"]');await pg.waitForTimeout(400);
 console.log('5. quando o usuário recusa ->',await pg.textContent('#fxm'));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
