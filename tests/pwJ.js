const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1200,height:900},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 const tex=JSON.parse(fs.readFileSync('/tmp/tex.json','utf8'));
 await pg.evaluate(async(tex)=>{
  PACK={oak_planks:{s:await url2c(tex.oak_planks),t:null,b:null},
        oak_slab:{s:await url2c(tex.oak_planks),t:null,b:null},
        oak_stairs:{s:await url2c(tex.oak_planks),t:null,b:null},
        oak_fence:{s:await url2c(tex.oak_planks),t:null,b:null},
        dark_oak_planks:{s:await url2c(tex.cobblestone),t:null,b:null},
        bookshelf:{s:await url2c(tex.stone_bricks),t:null,b:null}};
  PACKN='Texturas.jar';T3.clear();PAT.clear();TXON=true;render();dlgComp()},tex);
 await pg.waitForTimeout(600);
 await pg.evaluate(()=>{document.querySelector('.cgrid').style.maxHeight='none'});await pg.waitForTimeout(300);
 // mede quantas cores distintas cada miniatura tem (textura => muitas; cor chapada => poucas)
 console.log('cores distintas por miniatura:',await pg.evaluate(()=>[...document.querySelectorAll('.ccard')].map(c=>{
  const cv=c.querySelector('canvas'),g=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data,s=new Set();
  for(let i=0;i<g.length;i+=4)if(g[i+3]>10)s.add(g[i]+','+g[i+1]+','+g[i+2]);
  return c.querySelector('b').textContent+': '+s.size}).join(' | ')));
 await (await pg.$('.cgrid')).screenshot({path:'/tmp/sI.png'});
 // com texturas desligadas volta à cor chapada
 await pg.evaluate(()=>{TXON=false;dlgComp()});await pg.waitForTimeout(400);
 console.log('texturas desligadas:',await pg.evaluate(()=>[...document.querySelectorAll('.ccard')].slice(0,2).map(c=>{
  const cv=c.querySelector('canvas'),g=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data,s=new Set();
  for(let i=0;i<g.length;i+=4)if(g[i+3]>10)s.add(g[i]+','+g[i+1]+','+g[i+2]);
  return c.querySelector('b').textContent+': '+s.size}).join(' | ')));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
