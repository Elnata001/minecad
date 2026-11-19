const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1300,height:850},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message+' @ '+String(e.stack||'').split('\n')[1]));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 await pg.evaluate(()=>{openP(newProject());P.els=[];
  const d={id:uid(),name:'Parede de 6',cat:'Paredes',n:18,cells:[]};
  for(let x=0;x<6;x++)for(let y=0;y<3;y++)d.cells.push({x,y,z:0,m:y===1?'oak_planks':'stone_bricks'});
  LIB.push(d);libSave();
  const ty={id:uid(),name:'Modular',layers:[{mat:'comp:'+d.id,t:1}]};P.types.wall.push(ty);
  DEF.wall.ty=ty.id;DEF.wall.h=3;tool='wall';B=build(P);fit();cam.s=30;cam.x=10;cam.z=4;render()});
 const bb=await (await pg.$('#c2')).boundingBox(),S=await pg.evaluate(()=>cam.s);
 const at=(x,z)=>pg.evaluate(([x,z])=>{const r=document.querySelector('#c2').getBoundingClientRect();
   return[(x-cam.x)*cam.s+r.width/2+r.left,(z-cam.z)*cam.s+r.height/2+r.top]},[x,z]);
 // primeiro ponto
 let p=await at(.5,.5);await pg.mouse.click(p[0],p[1]);await pg.waitForTimeout(150);
 for(const L of [3,6,7,12,14,18]){
  p=await at(L+.5,.5);await pg.mouse.move(p[0],p[1]);await pg.waitForTimeout(160);
  const g=await pg.evaluate(()=>{const d=draftCells(cur);if(!d||!d.cells.length)return 'nenhum';
   const xs=d.cells.map(c=>c[0]);return d.n+' módulo(s), X '+Math.min(...xs)+'..'+Math.max(...xs)});
  console.log('comprimento',String(L+1).padStart(2),'-> prévia:',g);}
 await pg.screenshot({path:'/tmp/sN.png'});
 // confirma e compara com o gerado
 p=await at(12.5,.5);await pg.mouse.click(p[0],p[1]);await pg.waitForTimeout(250);await pg.keyboard.press('Escape');
 console.log('parede criada:',await pg.evaluate(()=>{const w=P.els.find(e=>e.cat==='wall');const t=B.tile[w.id];return t.n+' módulo(s), '+B.per[w.id]+' blocos'}));
 console.log('barra de status mostrou a contagem:',(await pg.evaluate(()=>{tool='wall';pts=[.5,.5];cur=[12.5,.5];return stText()})).includes('módulo(s)'));
 // 3D
 await pg.evaluate(()=>{P.els=[];tool='wall';pts=null;o.t.set(6,0,2);o.r=30;o.th=.9;o.ph=1;setView('3d');B=build(P);render()});
 const r3=await (await pg.$('#v3')).boundingBox(),CX=r3.x+r3.width/2,CY=r3.y+r3.height/2;
 await pg.mouse.click(CX-150,CY+40);await pg.waitForTimeout(200);
 await pg.mouse.move(CX+150,CY+40);await pg.waitForTimeout(300);
 console.log('prévia no 3D:',await pg.evaluate(()=>DGV&&DGV.visible?DGV.count+' blocos fantasma':'NENHUMA'));
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
