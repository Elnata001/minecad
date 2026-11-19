const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 pg.on('pageerror',e=>console.log('ERRO',e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const o=[];
  for(const r of[5,7,12,20])for(const t of[1,2,3]){
   const w=mk(P,'wall',{pts:[[0.5,0.5],[0.5+r,0.5]],pk:'circle',closed:true,h:1,t},P.levels[0].id);
   const c=voxWall(P,w);let mn=1e9,mx=-1e9;
   c.forEach(q=>{const d=Math.hypot(q[0]+.5-0.5,q[2]+.5-0.5);mn=Math.min(mn,d);mx=Math.max(mx,d)});
   // continuidade: todo bloco tem vizinho em 8 direções dentro do anel
   const S=new Set(c.map(q=>q[0]+','+q[2]));let furo=0;
   S.forEach(k=>{const[x,z]=k.split(',').map(Number);let n=0;
    for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]])if(S.has((x+dx)+','+(z+dz)))n++;
    if(n<2)furo++});
   let diag=0;S.forEach(k=>{const[x,z]=k.split(',').map(Number);for(const[dx,dz]of[[1,1],[1,-1]])if(S.has((x+dx)+','+(z+dz))&&!S.has((x+dx)+','+z)&&!S.has(x+','+(z+dz)))diag++});
   o.push('r='+r+' t='+t+': '+S.size+' células · raio de '+mn.toFixed(2)+' a '+mx.toFixed(2)+' (faixa '+(mx-mn).toFixed(2)+') · células isoladas '+furo)}
  return o.join('\n')}));
 await b.close()})();
