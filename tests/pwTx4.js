const {chromium}=require('playwright'),fs=require('fs');
const tex=JSON.parse(fs.readFileSync('/tmp/tex.json','utf8'));
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:880},deviceScaleFactor:2});
 pg.on('pageerror',e=>console.log('ERRO',e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 await pg.evaluate(async t=>{openP(newProject());
  const load=u=>new Promise(res=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas');c.width=i.width;c.height=i.height;c.getContext('2d').drawImage(i,0,0);res(c)};i.onerror=()=>res(null);i.src=u});
  const P2={};for(const k in t){const c=await load(t[k]);if(c)P2[k]={s:c,t:null,b:null}}
  PACK={oak_planks:P2.oak_planks,cobblestone:P2.cobblestone,stone_bricks:P2.stone_bricks,glass:P2.glass};
  PACKN='teste.jar';TXON=true;T3.clear();PAT.clear();ICOC.clear()},tex);
 // monta uma amostra lado a lado: com pacote x sem pacote
 await pg.evaluate(()=>{const ids=['oak_planks','cobblestone','stone_bricks','glass'];
  const d=document.createElement('div');d.id='amostra';d.style.cssText='position:fixed;left:40px;top:120px;z-index:999;background:#232622;padding:12px 16px;border-radius:10px;color:#e8e9e4;font:12px sans-serif';
  const linha=(rot,fn)=>'<div style="display:flex;gap:14px;align-items:center;margin:6px 0"><b style="width:92px">'+rot+'</b>'+ids.map(i=>'<span style="display:flex;align-items:center;gap:5px">'+fn(i)+MATS[i][0].slice(0,14)+'</span>').join('')+'</div>';
  TXON=true;ICOC.clear();const comPacote=linha('com pacote',blkIco);
  TXON=false;ICOC.clear();const semPacote=linha('sem pacote',blkIco);
  TXON=true;ICOC.clear();
  d.innerHTML=comPacote+semPacote;document.body.appendChild(d)});
 await pg.waitForTimeout(300);
 const bb=await (await pg.$('#amostra')).boundingBox();
 await pg.screenshot({path:'/tmp/tx_cmp.png',clip:bb});
 await b.close()})();
