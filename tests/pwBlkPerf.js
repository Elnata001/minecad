const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const o=[];view='plan';lv=P.levels[0].id;
  const t=Object.assign({id:uid(),cat:'topo',name:'Grande',base:lv,off:0,bl:[],pad:[],
   pts:[[0.5,0.5],[100.5,0.5],[100.5,80.5],[0.5,80.5]],closed:true,
   eq:1,mi:5,ref:0,vw:'hyp',bk:true,vw3:'blocks',qz:'near',fill:'depth',dp:4,
   ly:[{m:'grass_block',t:1},{m:'dirt',t:3},{m:'stone',t:0}],tp:[]},{});
  for(let i=0;i<120;i++)t.tp.push([2+Math.random()*96,2+Math.random()*76,Math.sin(i*.7)*6+10]);
  P.els.push(t);
  let s=performance.now();B=build(P);const tb=performance.now()-s;
  o.push('terreno 100×80 com 120 pontos: '+B.vox.size+' blocos · build '+tb.toFixed(0)+' ms');
  s=performance.now();B=build(P);o.push('  rebuild com cache: '+(performance.now()-s).toFixed(0)+' ms');
  s=performance.now();render();o.push('  render planta: '+(performance.now()-s).toFixed(0)+' ms');
  view='3d';s=performance.now();render();o.push('  render 3D (modo blocos): '+(performance.now()-s).toFixed(0)+' ms · malhas '+meshes.length);
  mutate(()=>{t.vw3='tin'});s=performance.now();render();o.push('  modo superfície: '+(performance.now()-s).toFixed(0)+' ms · malhas '+meshes.length);
  mutate(()=>{t.vw3='both'});render();o.push('  sobreposição: malhas '+meshes.length);
  mutate(()=>{t.vw3='struct'});render();
  o.push('  estrutura (sem a fiada de topo): malhas '+meshes.length);
  mutate(()=>{t.vw3='blocks'});
  // alteração de ponto: quanto custa refazer
  s=performance.now();mutate(()=>{t.tp[0][2]+=3});const tu=performance.now()-s;
  o.push('  alterar um ponto (retriangula + rediscretiza + rebuild): '+tu.toFixed(0)+' ms');
  s=performance.now();mutate(()=>{t.dp=6});
  o.push('  mudar só a profundidade (reaproveita malha e alturas): '+(performance.now()-s).toFixed(0)+' ms');
  s=performance.now();mutate(()=>{t.ly=[{m:'sand',t:2},{m:'stone',t:0}]});
  o.push('  mudar só as camadas: '+(performance.now()-s).toFixed(0)+' ms');
  return o.join('\n')}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
