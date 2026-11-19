const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1000,height:700},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 const zf=JSON.parse(fs.readFileSync('/tmp/zipfiles.json','utf8'));
 await pg.addInitScript(z=>{window.JSZip={loadAsync:async()=>({files:z,file:p=>({async:async()=>z[p]})})}},zf);
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 await pg.evaluate(async()=>{const r=await packBuild(new Blob(['x']));PACK=r.tex;PACKN='Texturas.jar';T3.clear();PAT.clear();TXON=true;
  openP(newProject());P.els=[];
  P.els.push(mk(P,'floor',{pts:[[.5,.5],[8.5,.5],[8.5,5.5],[.5,5.5]],mat:'grass_block',t:1,off:0},lv));
  const w=mk(P,'wall',{x1:.5,z1:7.5,x2:8.5,z2:7.5,t:1,h:4,mat:'oak_planks'},lv);P.els.push(w);
  const d1=mk(P,'door',{host:w.id,pos:2}),d2=mk(P,'door',{host:w.id,pos:3});P.els.push(d1,d2);
  const uu=doorAxes(w,d1).u;d1.dir=dirIdx(DOORC[0][0],hgFromVec(w,[uu[0],uu[1]]));d2.dir=dirIdx(DOORC[0][0],hgFromVec(w,[-uu[0],-uu[1]]));
  B=build(P);fit();cam.s=52;render()});
 await pg.waitForTimeout(400);
 // cor média da área do piso de grama na planta
 console.log('planta, piso de grama:',await pg.evaluate(()=>{const c=document.querySelector('#c2'),g=c.getContext('2d'),
  r=c.getBoundingClientRect(),dpr=c.width/r.width,
  d=g.getImageData(Math.round(c.width*.4),Math.round(c.height*.28),40,40).data;let s=[0,0,0],n=0;
  for(let i=0;i<d.length;i+=4){s[0]+=d[i];s[1]+=d[i+1];s[2]+=d[i+2];n++}
  return s.map(x=>Math.round(x/n)).join(',')}));
 await (await pg.$('#c2')).screenshot({path:'/tmp/sJ.png'});
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
