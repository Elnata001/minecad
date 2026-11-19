const {chromium}=require('playwright'),fs=require('fs');
const zf=JSON.parse(fs.readFileSync('/tmp/zipfiles.json','utf8'));
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:880},deviceScaleFactor:2});
 pg.on('pageerror',e=>console.log('ERRO',e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 const r=await pg.evaluate(async z=>{
  openP(newProject());
  const load=u=>new Promise(res=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas');c.width=i.width;c.height=i.height;c.getContext('2d').drawImage(i,0,0);res(c)};i.onerror=()=>res(null);i.src=u});
  // simula o resultado de packBuild a partir dos arquivos do .jar
  const P2={};
  for(const path in z){const m=/block\/([a-z0-9_]+)\.png$/.exec(path);if(!m)continue;const c=await load(z[path]);if(!c)continue;
   const id=m[1];
   if(id.endsWith('_top')){const base=id.slice(0,-4);(P2[base]=P2[base]||{}).t=c}
   else if(id.endsWith('_side')){const base=id.slice(0,-5);(P2[base]=P2[base]||{}).s=c}
   else (P2[id]=P2[id]||{}).s=c}
  PACK=P2;PACKN='teste.jar';TXON=true;T3.clear();PAT.clear();ICOC.clear();
  return{blocos:Object.keys(P2).join(', ')}},zf);
 console.log('pacote:',r.blocos);
 await pg.evaluate(()=>{dlgMats();mtAct('mtnew','')});await pg.waitForTimeout(300);
 await pg.evaluate(()=>{const s=document.querySelector('#dlg .sxd[data-f="block"]');s&&s.click()});await pg.waitForTimeout(400);
 await pg.fill('#sxq','grama');await pg.waitForTimeout(200);
 console.log('itens:',await pg.evaluate(()=>[...document.querySelectorAll('#sxp .sxi span')].map(s=>s.textContent).join(', ')));
 await pg.fill('#sxq','');await pg.waitForTimeout(200);
 const pb=await (await pg.$('#sxp')).boundingBox();
 await pg.screenshot({path:'/tmp/tx_dd.png',clip:{x:pb.x,y:pb.y,width:pb.width,height:Math.min(pb.height,300)}});
 await b.close()})();
