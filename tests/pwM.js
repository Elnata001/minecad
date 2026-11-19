const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1200,height:800}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 const r=await pg.evaluate(()=>{
  const BX=(w,h,d,x,y,z)=>uvCell(new THREE.BoxGeometry(w,h,d).translate(x||0,y||0,z||0));
  /* faixa de UV por face: mostra que fatia da textura a peça usa */
  const faces=g=>{const p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv,o={};
   for(let i=0;i<p.count;i++){const nx=n.getX(i),ny=n.getY(i),nz=n.getZ(i),
    f=nx>.5?'+X':nx<-.5?'-X':ny>.5?'+Y':ny<-.5?'-Y':nz>.5?'+Z':'-Z';
    const q=o[f]||(o[f]={u:[9,-9],v:[9,-9]});const u=uv.getX(i),v=uv.getY(i);
    q.u[0]=Math.min(q.u[0],u);q.u[1]=Math.max(q.u[1],u);q.v[0]=Math.min(q.v[0],v);q.v[1]=Math.max(q.v[1],v)}
   return Object.keys(o).sort().map(f=>f+' u'+o[f].u.map(x=>+x.toFixed(2)).join('–')+' v'+o[f].v.map(x=>+x.toFixed(2)).join('–')).join(' | ')};
  return{
   cubo:faces(BX(1,1,1,0,0,0)),
   lajeBaixa:faces(BX(1,.5,1,0,-.25,0)),
   painelPoste:faces(BX(.125,1,.125,0,0,0)),
   painelBraco:faces(BX(.125,1,.4375,0,0,-.28125)),
   cercaPoste:faces(BX(.25,1,.25,0,0,0)),
   troncoX:faces(uvCell(new THREE.BoxGeometry(1,1,1),'x'))}});
 for(const k in r)console.log(k.padEnd(12),r[k]);
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
