const {chromium}=require('playwright'),fs=require('fs');
const tex=JSON.parse(fs.readFileSync('/tmp/tex.json','utf8'));
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:880}});
 pg.on('pageerror',e=>console.log('ERRO',e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 const r=await pg.evaluate(async t=>{
  openP(newProject());
  const load=u=>new Promise(res=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas');c.width=i.width;c.height=i.height;c.getContext('2d').drawImage(i,0,0);res(c)};i.onerror=()=>res(null);i.src=u});
  TXON=false;ICOC.clear();const semTex=blkIco('oak_planks');
  const P2={};for(const k in t){const c=await load(t[k]);if(c)P2[k]={s:c}}
  PACK={oak_planks:P2.oak_planks,cobblestone:P2.cobblestone,stone_bricks:P2.stone_bricks,glass:P2.glass};
  TXON=true;ICOC.clear();const comTex=blkIco('oak_planks');
  TXON=true;const semPack=blkIco('bricks');
  return{iguais:semTex===comTex,temPack:!!PACK.oak_planks,semPackDif:semPack!==comTex,
   txOfOk:!!txOf({m:'oak_planks'}),cacheKeys:[...ICOC.keys()]}},tex);
 console.log(JSON.stringify(r,null,1));
 await b.close()})();
