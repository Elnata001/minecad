const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:760},deviceScaleFactor:2});
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 // o programa abre na tela inicial: sai dela como o usuário sairia
 await pg.evaluate(()=>welClose());
 await pg.evaluate(()=>{const w=[];for(let x=0;x<4;x++)for(let y=0;y<3;y++)w.push({x,y,z:0,m:'cobblestone'});
  LIB.push({id:'cw1',name:'Parede modular',cat:'Paredes',n:w.length,cells:w});libSave();render()});
 await (await pg.$('#tools .tl[data-g="wall"]')).hover();await pg.waitForTimeout(400);
 await pg.screenshot({path:'/tmp/sU.png',clip:{x:0,y:60,width:420,height:260}});
 const q=await (await pg.$('#tgrp [data-a="tool:wallc"]')).boundingBox();
 await pg.mouse.move(q.x+q.width/2,q.y+q.height/2);await pg.waitForTimeout(400);
 await pg.screenshot({path:'/tmp/sV.png',clip:{x:0,y:60,width:420,height:260}});
 await b.close()})();
