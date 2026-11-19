const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:780},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 const tex=JSON.parse(fs.readFileSync('/tmp/tex.json','utf8'));
 const r=await pg.evaluate(async(tex)=>{
  /* carrega as texturas reais do .jar direto no PACK, como faria o leitor de pacote */
  PACK={oak_door:{s:await url2c(tex.oak_door_bottom),t:await url2c(tex.oak_door_top),b:null},
        glass_pane:{s:await url2c(tex.glass),t:null,b:null},
        glass:{s:await url2c(tex.glass),t:null,b:null},
        oak_fence:{s:await url2c(tex.oak_planks),t:null,b:null},
        cobblestone_wall:{s:await url2c(tex.cobblestone),t:null,b:null},
        stone_bricks:{s:await url2c(tex.stone_bricks),t:null,b:null}};
  PACKN='Texturas.jar';T3.clear();PAT.clear();TXON=true;
  openP(newProject());P.els=[];
  const el=(c,ex)=>{const w=mk(P,c,ex,lv);P.els.push(w);return w};
  const w=el('wall',{x1:.5,z1:2.5,x2:9.5,z2:2.5,t:1,h:4,mat:'stone_bricks'});
  el('window',{x1:6.5,z1:2.5,x2:8.5,z2:2.5,mat:'glass_pane',t:1,off:1,h:2});
  const d1=el('door',{host:w.id,pos:2}),d2=el('door',{host:w.id,pos:3});
  const uu=doorAxes(w,d1).u;d1.dir=dirIdx(DOORC[0][0],hgFromVec(w,[uu[0],uu[1]]));d2.dir=dirIdx(DOORC[0][0],hgFromVec(w,[-uu[0],-uu[1]]));
  el('fence',{x1:.5,z1:6.5,x2:5.5,z2:6.5,mat:'oak_fence',h:1});
  el('fence',{x1:.5,z1:8.5,x2:5.5,z2:8.5,mat:'cobblestone_wall',h:1});
  B=build(P);setView('3d');
  /* a porta usa quatro variantes: baixo/cima × dobradiça esquerda/direita */
  const dv=[...B.vox.values()].filter(v=>v.dw);
  const cv=dv.map(v=>{const f='d'+(v.dw.half==='upper'?'t':'')+(v.dw.hinge==='right'?'r':'');return f+'='+(txOf(v,f)===PACK.oak_door.t?'topo':txOf(v,f)===PACK.oak_door.s?'base':'espelhada')});
  const px=c=>{const g2=c.getContext('2d'),d=g2.getImageData(0,0,16,16).data;let a=0;for(let i=3;i<d.length;i+=4)if(d[i]<128)a++;return a};
  return{variantes:[...new Set(cv)].join(' · '),
   malhas:meshes.map(m=>m.geometry.__k+'×'+m.count+(m.material.transparent?'(transp)':'')).join(' | '),
   vidroTransparente:px(PACK.glass.s)+' de 256 pixels transparentes na textura do vidro',
   espelhada:px(mirC(PACK.oak_door.s))===px(PACK.oak_door.s)?'espelho gerado':'falhou'}},tex);
 console.log('variantes de textura da porta:',r.variantes);
 console.log('malhas 3D:',r.malhas);
 console.log(r.vidroTransparente,'|',r.espelhada);
 await pg.evaluate(()=>{setView('plan');fit();cam.s=64;cam.x=5;cam.z=2.5;render()});
 await pg.waitForTimeout(400);
 await (await pg.$('#c2')).screenshot({path:'/tmp/s7.png'});
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
