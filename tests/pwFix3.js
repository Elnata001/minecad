const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1280,height:860}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(900);
 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];const o=[];view='plan';lv=P.levels[0].id;
  tool='topo';DMETS.topo='rect';toolClick([0.5,0.5],0,{});toolClick([20.5,16.5],0,{});
  const t=P.els[0];tool='tpt';
  for(const p of [[3,3,0],[17,3,0],[17,13,0],[3,13,0]]){DEF.tpt.z=p[2];topoPt([p[0],p[1]])}
  // 1. cota 0 -> topo do bloco em y=-1 (face superior no nível 0), como o piso
  let c=[...B.vox.values()].filter(v=>v.o===t.id&&v.tt);
  o.push('1. pontos na cota 0 -> fiada de topo em Y '+[...new Set(c.map(v=>v.y))].join(','));
  mutate(()=>{const f=mk(P,'floor',{pts:[[2.5,2.5],[6.5,6.5]],pk:'rect',closed:true,off:0},lv);P.els.push(f)});
  const fc=[...B.vox.values()].filter(v=>B.cats[v.o]==='floor');
  o.push('   piso com deslocamento 0 em Y '+[...new Set(fc.map(v=>v.y))].join(',')+' (mesma convenção: '+
   (new Set(c.map(v=>v.y)).has(-1)&&new Set(fc.map(v=>v.y)).has(-1))+')');
  mutate(()=>{P.els=P.els.filter(e=>e.cat!=='floor')});
  // 2. parâmetros da barra
  const setK=(k,v)=>{const el=P.els.find(e=>e.id===t.id);mutate(()=>{el[k]=coerce(k,v)})};
  sel=t.id;SELS=[t.id];tool='sel';render();
  const before=B.vox.size;
  setK('qz','up');o.push('2. quantização "up": '+coerceCheck('qz','up'));
  function coerceCheck(k,v){return typeof coerce(k,v)+' = '+JSON.stringify(coerce(k,v))}
  o.push('   fill: '+coerceCheck('fill','base')+' · vw: '+coerceCheck('vw','tri')+' · vw3: '+coerceCheck('vw3','both'));
  o.push('   booleanos: sc '+coerceCheck('sc',false)+' · bk '+coerceCheck('bk',false)+' · pv '+coerceCheck('pv',false));
  o.push('   eq com decimal: '+coerceCheck('eq',0.5)+' · ref '+coerceCheck('ref',-2.5));
  setK('bk',false);o.push('   desligar conversão pela barra: blocos '+[...B.vox.values()].filter(v=>v.o===t.id).length);
  setK('bk',true);setK('qz','near');
  setK('sc',false);o.push('   desligar curvas: t.sc='+JSON.stringify(P.els[0].sc)+' (curvas desenhadas: '+(P.els[0].sc!==false?'sim':'não')+')');
  setK('sc',true);
  setK('fill','base');setK('by',-8);
  o.push('   preenchimento até -8: menor Y '+Math.min.apply(null,[...B.vox.values()].filter(v=>v.o===t.id).map(v=>v.y)));
  setK('fill','depth');
  // 3. edição no 3D
  view='3d';tedStart(t.id);render();
  o.push('3. marcadores no 3D: '+TDM.length+' (pontos '+t.tp.length+')');
  TED.sel=[0];build3();
  const t0=P.els[0].tp[0].slice();
  // simula arraste vertical com Alt
  TD3={i:0,my:0,base:[t0.slice()]};TD3.my=-42;
  const k=Math.round(-TD3.my/14);P.els[0].tp[0][2]=Math.round((t0[2]+k)*100)/100;B=build(P);
  o.push('   Alt+arraste: cota '+t0[2]+' -> '+P.els[0].tp[0][2]+' · topo do terreno subiu: '+
   Math.max.apply(null,[...B.vox.values()].filter(v=>v.o===t.id&&v.tt).map(v=>v.y)));
  TD3=null;tedEnd();
  return o.join('\n')}));
 console.log(errs.join('\n')||'sem erros');await b.close()})();
