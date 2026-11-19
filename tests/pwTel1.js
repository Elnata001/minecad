/* Terreno como elemento individual: mover e girar levam os pontos cotados,
   as curvas de nível e as plataformas junto. */
const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1100,height:700}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);

 console.log(await pg.evaluate(()=>{openP(newProject());P.els=[];
  const t=mk(P,'topo',{pts:[[0,0],[10,0],[10,10],[0,10]],closed:true},P.levels[0].id);
  t.tp=[[1,1,0],[9,1,3],[9,9,6],[1,9,2],[5,5,4]];
  t.pad=[{id:'p1',pts:[[3,3],[6,3],[6,6],[3,6]],y:2}];
  t.bl=[{id:'b1',pts:[[0,5],[10,5]],y:3,cl:false}];
  P.els.push(t);B=build(P);
  const z0=tinZ(tinOf(t),5.5,5.5);
  sel=t.id;mutate(()=>moveEl(t,40,25));
  const z1=tinZ(tinOf(t),45.5,30.5),fora=tinZ(tinOf(t),5.5,5.5);
  return 'cota no centro antes: '+z0
   +'\nmesmo ponto depois de mover +40/+25: '+z1+(Math.abs(z0-z1)<1e-6?' (igual — a topografia acompanhou)':' (DIVERGIU)')
   +'\nna posição antiga agora: '+fora+(fora===null?' (null — nada ficou para trás)':' (SOBROU SUPERFICIE)')
   +'\npontos cotados: '+JSON.stringify(t.tp.map(p=>[p[0],p[1]]))
   +'\nplataforma: '+JSON.stringify(t.pad[0].pts)
   +'\ncurva de nível: '+JSON.stringify(t.bl[0].pts)}));

 console.log(await pg.evaluate(()=>{const t=P.els[0];
  const z0=tinZ(tinOf(t),45.5,30.5);
  sel=t.id;ROT.pv=[45.5,30.5];rotApply(90);
  const z1=tinZ(tinOf(t),45.5,30.5);
  return 'girado 90° em torno do próprio centro: cota '+z0+' -> '+z1
   +(z1!==null?' (a superfície continua lá)':' (SUMIU)')
   +'\npontos cotados depois do giro: '+JSON.stringify(t.tp.map(p=>[p[0],p[1]]))}));

 console.log(await pg.evaluate(()=>{P.els=[];
  const a=mk(P,'topo',{pts:[[0,0],[8,0],[8,8],[0,8]],closed:true},P.levels[0].id);
  a.tp=[[1,1,0],[7,1,0],[7,7,0],[1,7,0]];P.els.push(a);
  sel=null;SELS=[];
  const n0=P.els.length;
  topoPt([200,200],5);
  const novo=P.els.length>n0;
  return 'ponto cotado clicado a 200/200, longe do terreno existente:'
   +'\n  terrenos no projeto: '+n0+' -> '+P.els.length+(novo?' (nasceu um terreno novo)':' (FOI PARAR NO TERRENO ANTIGO)')
   +'\n  pontos do terreno original: '+a.tp.length+(a.tp.length===4?' (intacto)':' (CONTAMINADO)')}));

 console.log(errs.join('\n')||'sem erros');await b.close()})();
