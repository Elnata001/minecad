const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const b=await chromium.launch(),pg=await b.newPage({viewport:{width:1360,height:880}});
 const errs=[];pg.on('pageerror',e=>errs.push('ERRO '+e.message));
 await pg.addInitScript(fs.readFileSync('/tmp/three-shim.js','utf8'));
 await pg.goto('file:///mnt/user-data/outputs/minecad.html');await pg.waitForTimeout(850);
 const mkp=()=>pg.evaluate(()=>{openP(newProject());P.els=[];B=build(P);tool='stair';RP=[];cam={x:6,z:4,s:30};render()});
 await mkp();
 // 2. lado do traçado
 console.log('2. lado do traçado:',await pg.evaluate(()=>{
  const r=[];for(const sd of['left','center','right']){
   const w=Object.assign({id:'s',cat:'stair',base:P.levels[0].id},JSON.parse(JSON.stringify(DEF.stair)),{w:3,sd,pts:[[0.5,0.5],[6.5,0.5]]});
   const c=stairPlan(P,w).cells;r.push(sd+': Z '+[...new Set(c.map(x=>x[2]))].sort((a,b2)=>a-b2).join(','))}
  return r.join(' | ')}));
 console.log('   campo aparece só com largura > 1:',await pg.evaluate(()=>{
  const a=fields('stair',{...DEF.stair,w:1},'data-k',1).includes('Lado do traçado'),
   b2=fields('stair',{...DEF.stair,w:3},'data-k',1).includes('Lado do traçado');return 'w=1 '+a+' · w=3 '+b2}));
 // 3. sem restrição superior: vários lances com patamar
 console.log('3. sem restrição superior:',await pg.evaluate(()=>{
  DEF.stair.top='';DEF.stair.w=1;
  const w=Object.assign({id:'s',cat:'stair',base:P.levels[0].id},JSON.parse(JSON.stringify(DEF.stair)),{pts:[[0.5,0.5],[4.5,0.5],[8.5,0.5]]});
  const pl=stairPlan(P,w);return 'lances '+pl.segs.length+' · degraus '+pl.N+' · patamares '+pl.lands+' · sobe '+pl.H}));
 console.log('   um lance só:',await pg.evaluate(()=>{
  const w=Object.assign({id:'s',cat:'stair',base:P.levels[0].id},JSON.parse(JSON.stringify(DEF.stair)),{top:'',pts:[[0.5,0.5],[4.5,0.5]]});
  const pl=stairPlan(P,w);return 'degraus '+pl.N+' · patamares '+pl.lands}));
 // 4. com restrição superior: limite e contagem
 console.log('4. com restrição superior (4 blocos):',await pg.evaluate(()=>{
  const t=P.levels[1].id;
  const f=pts=>{const w=Object.assign({id:'s',cat:'stair',base:P.levels[0].id},JSON.parse(JSON.stringify(DEF.stair)),{top:t,pts});const p=stairPlan(P,w);return p.N+'/'+p.need};
  return 'lance curto '+f([[0.5,0.5],[2.5,0.5]])+' · dois lances '+f([[0.5,0.5],[2.5,0.5],[4.5,0.5]])+' · longo demais '+f([[0.5,0.5],[20.5,0.5]])}));
 // interface: cliques e limite
 await pg.evaluate(()=>{DEF.stair.top=P.levels[1].id;RP=[];tool='stair';render()});
 const bb=await (await pg.$('#c2')).boundingBox();
 const XY=(x,z)=>({x:bb.x+bb.width/2+(x-6)*30,y:bb.y+bb.height/2+(z-4)*30});
 const clk=async(x,z)=>{const q=XY(x,z);await pg.mouse.move(q.x,q.y);await pg.mouse.down();await pg.mouse.up();await pg.waitForTimeout(130)};
 await clk(0.5,0.5);await clk(2.5,0.5);
 console.log('5. parte 1 (2 cliques): pontos',await pg.evaluate(()=>RP.length),'|',await pg.evaluate(()=>stairHint().replace(/<[^>]+>/g,' ')));
 await pg.mouse.move(...Object.values(XY(5.5,0.5)));await pg.waitForTimeout(200);
 await pg.screenshot({path:'/tmp/es1.png',clip:{x:bb.x,y:bb.y,width:620,height:330}});
 await clk(5.5,3.5);await clk(7.5,3.5);
 console.log('   parte 2 (2 cliques):',await pg.evaluate(()=>RP.length),'|',await pg.evaluate(()=>stairHint().replace(/<[^>]+>/g,' ')));
 await clk(9.5,6.5);
 console.log('   parte 3 recusada?',await pg.evaluate(()=>RP.length),'|',await pg.evaluate(()=>{const d=[...document.querySelectorAll('.tst')].pop();return d?d.dataset.t:'—'}));
 console.log('6. botões:',await pg.evaluate(()=>[...document.querySelectorAll('#pp button')].map(b2=>b2.textContent+(b2.disabled?'(off)':'')).join(' | ')));
 await pg.click('#pp button[data-a="stdone"]');await pg.waitForTimeout(250);
 console.log('   concluir:',await pg.evaluate(()=>{const e=P.els.find(x=>x.cat==='stair');if(!e)return'nada';const p=stairPlan(P,e);
  return 'escada com '+p.parts+' partes · '+p.N+'/'+p.need+' degraus · '+p.lands+' patamares · '+[...B.vox.values()].filter(v=>v.o===e.id).length+' blocos'}));
 await pg.evaluate(()=>{RP=[];tool='stair';render()});
 await clk(0.5,6.5);await clk(3.5,6.5);
 await pg.click('#pp button[data-a="stcancel"]');await pg.waitForTimeout(200);
 console.log('   cancelar:',await pg.evaluate(()=>'RP '+RP.length+' · escadas no projeto '+P.els.filter(e=>e.cat==='stair').length));
 console.log(errs.join('\n')||' sem erros');await b.close()})();
