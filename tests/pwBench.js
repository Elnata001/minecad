const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860}});
 pg.on('pageerror',e=>console.log('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{const o=[];
  for(const n of [8000,16000,30000]){
   const V=[];for(let i=0;i<n;i++)V.push([Math.random()*256,Math.random()*256]);
   const t0=performance.now();const T=delaunay(V);const dt=performance.now()-t0;
   o.push('   '+n+' pontos → '+T.length+' triângulos em '+Math.round(dt)+' ms');
   if(dt>8000)break}
  return 'Delaunay (Bowyer–Watson atual):\n'+o.join('\n')}));
 await b.close()})();
