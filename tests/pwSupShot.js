const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];
  const b2=P.levels[1].id;
  const r=mk(P,'roof',{pts:[[0.5,0.5],[11.5,0.5],[11.5,7.5],[0.5,7.5]],sp:1,base:b2,off:0},b2);P.els.push(r);
  mutate(()=>{typeOf(P,r.ty).under='stair'});
  // corte transversal pela seção: desenha em ASCII o perfil em X=5
  const cs=voxRoof(P,r).filter(c=>c[0]===5).sort((a,c)=>a[2]-c[2]||a[1]-c[1]);
  const ys=cs.map(c=>c[1]),y1=Math.max(...ys),y0=Math.min(...ys);let out=[];
  for(let y=y1;y>=y0;y--){let l='y'+String(y).padStart(2)+' ';
   for(let z=0;z<8;z++){const c=cs.find(q=>q[2]===z&&q[1]===y);
    l+=c?(c[3]?(c[3].half==='top'?'n':'u'):c[6]==='top'?'^':c[6]==='bottom'?'_':'#'):'.'}
   out.push(l)}
  return 'corte em X=5 (u=escada da água, n=escada invertida de apoio, ^=cumeeira):\n'+out.join('\n')}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
