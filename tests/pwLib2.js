const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{LIB=LIB.filter(x=>!x.grp);CPG='grp';CFLT='';dlgComp();
  const w=document.querySelector('.libw');
  return 'página de grupos vazia: '+w.offsetHeight+'px · mensagens: '+[...w.querySelectorAll('.m')].filter(x=>/Nenhum/.test(x.textContent)).map(x=>x.textContent.slice(0,30)).join(' | ')}));
 {const r=await pg.evaluate(()=>{const q=document.querySelector('.libw').getBoundingClientRect();return{x:q.x-16,y:q.y-16,width:q.width+32,height:q.height+32}});
  await pg.screenshot({path:'/tmp/lib_vazio.png',clip:r})}
 console.log(await pg.evaluate(()=>{CPG='comp';dlgComp();return 'página de componentes: '+document.querySelector('.libw').offsetHeight+'px'}));
 // barra de propriedades: folga até a rolagem
 await pg.evaluate(()=>{$('#dlg').close();openP(newProject());P.els=[];const a=P.levels[0].id;
  const w=mkWall(P,[0.5,0.5],[8.5,0.5],a);w.h=3;P.els.push(w);B=build(P);view='plan';lv=a;tool='sel';sel=w.id;SELS=[w.id];render()});
 await pg.waitForTimeout(300);
 console.log(await pg.evaluate(()=>{const pp=document.querySelector('#pp'),ps=pp.querySelector('.pps');
  const cs=getComputedStyle(ps);return 'barra '+pp.offsetHeight+'px · folga até a rolagem '+cs.paddingBottom+' · trilha '+(ps.scrollWidth>ps.clientWidth?'ativa':'vazia')}));
 {const r=await pg.evaluate(()=>{const q=document.querySelector('#pp').getBoundingClientRect();return{x:q.x,y:q.y,width:Math.min(q.width,980),height:q.height+6}});
  await pg.screenshot({path:'/tmp/pp_bar.png',clip:r})}
 console.log(errs.join('\n')||'sem erros');await b.close()})();
