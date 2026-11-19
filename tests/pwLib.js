const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const a=P.levels[0].id,o=[];
  const w=mkWall(P,[0.5,0.5],[8.5,0.5],a);w.h=3;P.els.push(w);
  const r=mk(P,'roof',{pts:[[0.5,3.5],[8.5,3.5],[8.5,9.5],[0.5,9.5]],sp:1,base:P.levels[1].id,off:0},P.levels[1].id);P.els.push(r);
  const st=mk(P,'stair',{pts:[[2.5,12.5],[2.5,16.5]],w:2},a);P.els.push(st);
  const d=mk(P,'door',{host:w.id,pos:3},a);P.els.push(d);
  const g={id:uid(),name:'Grupo A',cat:'Grupo',grp:1,n:2,cells:[{x:0,y:0,z:0,m:'stone'},{x:1,y:0,z:0,m:'stone'}]};LIB.push(g);
  const g2={id:uid(),name:'Grupo B',cat:'Grupo',grp:1,n:1,cells:[{x:0,y:0,z:0,m:'oak_planks'}]};LIB.push(g2);
  B=build(P);view='plan';lv=a;tool='sel';render();
  const chk=n=>{const pp=document.querySelector('#pp'),ps=pp.querySelector('.pps');
   return n+': '+pp.offsetHeight+'px'+(ps.scrollHeight>ps.clientHeight+1?' CORTADO ('+ps.scrollHeight+'>'+ps.clientHeight+')':'')};
  for(const[n,id]of [['parede',w.id],['cobertura',r.id],['escada',st.id],['porta',d.id]]){sel=id;SELS=[id];render();o.push(chk(n))}
  sel=null;SELS=[];for(const t of ['wall','roof','stair','comp','block','curtain','dim','txt']){tool=t;render();o.push(chk('ferramenta '+t))}
  tool='sel';sel=w.id;SELS=[w.id,r.id];render();o.push(chk('seleção múltipla'));
  SELS=[];sel=null;view='3d';render();o.push(chk('3D'));view='plan';render();
  return o.join('\n')}));
 await pg.evaluate(()=>{CPG='comp';CFLT='';dlgComp()});await pg.waitForTimeout(400);
 {const r=await pg.evaluate(()=>{const q=document.querySelector('.libw').getBoundingClientRect();return{x:q.x-16,y:q.y-16,width:q.width+32,height:Math.min(q.height+32,760)}});
  await pg.screenshot({path:'/tmp/lib_comp.png',clip:r})}
 console.log('aba componentes: '+await pg.evaluate(()=>document.querySelectorAll('.cgrid .ccard').length+' cartões'));
 await pg.evaluate(()=>act('cpg:grp'));await pg.waitForTimeout(400);
 console.log('aba grupos: '+await pg.evaluate(()=>document.querySelectorAll('.cgrid .ccard').length+' cartões · títulos: '+[...document.querySelectorAll('.ccard b')].map(x=>x.textContent).join(', ')));
 {const r=await pg.evaluate(()=>{const q=document.querySelector('.libw').getBoundingClientRect();return{x:q.x-16,y:q.y-16,width:q.width+32,height:Math.min(q.height+32,760)}});
  await pg.screenshot({path:'/tmp/lib_grp.png',clip:r})}
 console.log('altura das páginas: '+await pg.evaluate(()=>{CPG='comp';dlgComp();const a=document.querySelector('.libw').offsetHeight;CPG='grp';dlgComp();const b2=document.querySelector('.libw').offsetHeight;return a+'px vs '+b2+'px'}));
 console.log('mensagens de vazio na página de grupos: '+await pg.evaluate(()=>{CPG='grp';CFLT='';dlgComp();return [...document.querySelectorAll('.libw .m')].filter(x=>/Nenhum/.test(x.textContent)).length}));
 console.log('linha de topo em uma só faixa: '+await pg.evaluate(()=>{const r=document.querySelector('.libtop');const ys=[...r.children].map(c=>Math.round(c.getBoundingClientRect().top));return new Set(ys).size===1?'sim ('+ys[0]+')':'não ('+ys.join(',')+')'}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
