const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 const out=await pg.evaluate(()=>{openP(newProject());P.els=[];const a=P.levels[0].id,bad=[],hs=new Set();
  const w=mkWall(P,[0.5,0.5],[8.5,0.5],a);w.h=3;P.els.push(w);
  const r=mk(P,'roof',{pts:[[0.5,3.5],[8.5,3.5],[8.5,9.5],[0.5,9.5]],sp:1,base:P.levels[1].id,off:0},P.levels[1].id);P.els.push(r);
  const st=mk(P,'stair',{pts:[[2.5,12.5],[2.5,16.5]],w:2},a);P.els.push(st);
  const d=mk(P,'door',{host:w.id,pos:3},a);P.els.push(d);
  const cl=mk(P,'column',{x1:6.5,z1:12.5,h:3},a);P.els.push(cl);

  const bl=mk(P,'block',{x1:10.5,z1:10.5},a);P.els.push(bl);
  B=build(P);view='plan';lv=a;render();
  const chk=n=>{const pp=document.querySelector('#pp'),ps=pp.querySelector('.pps');hs.add(pp.offsetHeight);
   if(ps.scrollHeight>ps.clientHeight+1)bad.push(n+' ('+ps.scrollHeight+'>'+ps.clientHeight+')')};
  tool='sel';for(const e of P.els){sel=e.id;SELS=[e.id];render();chk('sel '+e.cat)}
  sel=null;SELS=[];
  for(const t of ['sel','move','block','comp','wall','floor','column','door','window','stair','roof','beam','fence','curtain','cut','dim','txt','ln','tag','trim','split','rot']){tool=t;render();chk('ferramenta '+t)}
  tool='sel';sel=w.id;SELS=[w.id,r.id];render();chk('multi');
  SELS=[];view='3d';render();chk('3d');view='plan';
  sel=w.id;SELS=[w.id];skStart&&skStart();render();chk('editar forma');if(SK)skEnd(false);
  return 'alturas: '+[...hs].join(',')+' · cortados: '+(bad.join(' | ')||'nenhum')});
 console.log(out);console.log(errs.join('\n')||'sem erros');await b.close()})();
