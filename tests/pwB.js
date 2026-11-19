const {chromium}=require('playwright'),fs=require('fs');
(async()=>{
 const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860},deviceScaleFactor:2});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(800);
 const tex=JSON.parse(fs.readFileSync('/tmp/tex.json','utf8'));
 await pg.evaluate(async(tex)=>{
  /* texturas reais do .jar, como um pacote carregado pelo usuário */
  PACK={oak_planks:{s:await url2c(tex.oak_planks),t:null,b:null},
        glass_pane:{s:await url2c(tex.glass),t:null,b:null},
        oak_fence:{s:await url2c(tex.oak_planks),t:null,b:null},
        cobblestone:{s:await url2c(tex.cobblestone),t:null,b:null},
        stone_bricks:{s:await url2c(tex.stone_bricks),t:null,b:null}};
  PACKN='Texturas.jar';T3.clear();PAT.clear();TXON=true;
  openP(newProject());P.els=[];
  const el=(c,ex)=>{const w=mk(P,c,ex,lv);P.els.push(w);return w};
  el('wall',{x1:.5,z1:2.5,x2:11.5,z2:2.5,t:1,h:4});
  el('window',{x1:4.5,z1:2.5,x2:8.5,z2:2.5,mat:'glass_pane',t:1,off:1,h:2});
  el('floor',{pts:[[.5,5.5],[11.5,5.5],[11.5,8.5],[.5,8.5]],mat:'stone_bricks',t:1,off:0});
  el('fence',{x1:2.5,z1:6.5,x2:9.5,z2:6.5,mat:'oak_fence',h:1});
  el('fence',{x1:2.5,z1:7.5,x2:9.5,z2:7.5,mat:'cobblestone_wall',h:1});
  B=build(P);fit();cam.s=48;render()},tex);
 await pg.waitForTimeout(400);
 await (await pg.$('#c2')).screenshot({path:'/tmp/sB.png'});
 console.log('ERROS:',errs.length?errs.join('\n'):'nenhum');
 await b.close()})();
