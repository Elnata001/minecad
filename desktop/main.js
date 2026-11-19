/* Processo principal do mCAD no Electron.
   O aplicativo em si continua sendo o index.html — este arquivo só dá a ele o que
   um navegador não dá: janela que lembra o tamanho, menu nativo, associação do
   .mcad, leitura direta da pasta de mundos do Minecraft e atualização automática. */
const {app,BrowserWindow,Menu,ipcMain,dialog,shell,nativeTheme}=require('electron');
const path=require('path'),fs=require('fs'),fsp=fs.promises;

const NOME='mCAD 27';
app.setAppUserModelId('com.elnata001.mcad');
const ESTADO=path.join(app.getPath('userData'),'janela.json');
const lerEstado=()=>{try{return JSON.parse(fs.readFileSync(ESTADO,'utf8'))}catch(e){return{}}};
const salvarEstado=o=>{try{fs.writeFileSync(ESTADO,JSON.stringify(o))}catch(e){}};

let win=null,abrirAoIniciar=null;

/* arquivo .mcad passado na linha de comando (clique duplo no Explorer) */
const mcadDeArgv=argv=>{const a=(argv||[]).find(x=>/\.mcad$/i.test(x)&&fs.existsSync(x));return a||null};

function criarJanela(){
 const e=lerEstado();
 win=new BrowserWindow({
  width:e.width||1440,height:e.height||900,x:e.x,y:e.y,
  minWidth:960,minHeight:600,show:false,
  backgroundColor:nativeTheme.shouldUseDarkColors?'#1d1f1c':'#f2f2ef',
  title:NOME,
  webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,spellcheck:false}
 });
 if(e.maximized)win.maximize();
 win.loadFile(path.join(__dirname,'app','index.html'));
 win.once('ready-to-show',()=>win.show());
 const guardar=()=>{if(!win||win.isDestroyed())return;const b=win.getNormalBounds();
  salvarEstado({...b,maximized:win.isMaximized()})};
 win.on('resize',guardar);win.on('move',guardar);win.on('close',guardar);
 win.on('closed',()=>{win=null});
 /* link externo abre no navegador do sistema, não dentro do aplicativo */
 /* o título é do aplicativo, não da página, e a página não muda o que aparece na barra */
 win.on('page-title-updated',e=>e.preventDefault());
 win.setTitle(NOME);
 /* nada de zoom de navegador: Ctrl+roda e pinça ficam travados em 100% */
 win.webContents.setVisualZoomLevelLimits(1,1);
 win.webContents.on('zoom-changed',()=>win.webContents.setZoomFactor(1));
 win.webContents.on('before-input-event',(ev,i)=>{
  if(i.control&&i.shift&&(i.key==='I'||i.key==='i')){ev.preventDefault();win.webContents.toggleDevTools()}});
 win.webContents.setWindowOpenHandler(({url})=>{shell.openExternal(url);return{action:'deny'}});
 win.webContents.on('will-navigate',(ev,url)=>{if(url!==win.webContents.getURL()){ev.preventDefault();shell.openExternal(url)}});
 return win}

/* Sem menu nativo. Ele trazia a cara de navegador — recarregar, zoom, ferramentas de
   desenvolvedor — e tudo o que era útil ali passou para o menu do próprio programa.
   As ferramentas de desenvolvedor continuam alcançáveis por Ctrl+Shift+I, sem anúncio. */
function menu(){Menu.setApplicationMenu(null)}
const enviar=(canal,dado)=>{if(win&&!win.isDestroyed())win.webContents.send(canal,dado)};

/* ---- associação dos arquivos .mcad ----
   O instalador registra a extensão, mas o Windows só passa a abrir o programa no clique
   duplo quando existe um ProgID apontando para o executável. Isso é gravado em HKCU, que
   é por usuário e não pede privilégio, e é refeito quando o caminho do programa muda. */
function associarMcad(){
 if(process.platform!=='win32'||!app.isPackaged)return Promise.resolve(false);
 const exe=process.execPath,{execFile}=require('child_process');
 const chaves=[
  ['HKCU\\Software\\Classes\\.mcad','/ve','/d','mCAD.Projeto'],
  ['HKCU\\Software\\Classes\\.mcad\\OpenWithProgids','/v','mCAD.Projeto','/t','REG_NONE'],
  ['HKCU\\Software\\Classes\\mCAD.Projeto','/ve','/d','Projeto do mCAD'],
  ['HKCU\\Software\\Classes\\mCAD.Projeto\\DefaultIcon','/ve','/d',exe+',0'],
  ['HKCU\\Software\\Classes\\mCAD.Projeto\\shell\\open','/ve','/d','Abrir no mCAD'],
  ['HKCU\\Software\\Classes\\mCAD.Projeto\\shell\\open\\command','/ve','/d','"'+exe+'" "%1"']
 ];
 /* uma chave que falhe não interrompe as outras: a que decide o clique duplo é a última,
    shell\\open\\command, e é o resultado dela que vale */
 return new Promise(res=>{let i=0,ok=true;
  const passo=()=>{if(i>=chaves.length){
    if(ok)try{fs.writeFileSync(ASSOC,JSON.stringify({exe}))}catch(e){}
    return res(ok)}
   const ch=chaves[i++],crit=ch[0].indexOf('OpenWithProgids')<0;
   execFile('reg',['add'].concat(ch).concat(['/f']),{windowsHide:true},err=>{if(err&&crit)ok=false;passo()})};
  passo()})}
const ASSOC=path.join(app.getPath('userData'),'assoc.json');
const assocPendente=()=>{try{return JSON.parse(fs.readFileSync(ASSOC,'utf8')).exe!==process.execPath}catch(e){return true}};

/* ---- pasta de mundos do Minecraft ---- */
const pastaSaves=()=>{
 const c=[];
 if(process.platform==='win32'&&process.env.APPDATA)c.push(path.join(process.env.APPDATA,'.minecraft','saves'));
 if(process.platform==='darwin')c.push(path.join(app.getPath('home'),'Library','Application Support','minecraft','saves'));
 c.push(path.join(app.getPath('home'),'.minecraft','saves'));
 return c.find(p=>{try{return fs.statSync(p).isDirectory()}catch(e){return false}})||null};

ipcMain.handle('mundos',async()=>{const raiz=pastaSaves();if(!raiz)return{raiz:null,mundos:[]};
 const out=[];
 for(const d of await fsp.readdir(raiz,{withFileTypes:true})){if(!d.isDirectory())continue;
  const p=path.join(raiz,d.name),reg=path.join(p,'region');
  let n=0,mt=0;
  try{const fs2=await fsp.readdir(reg);n=fs2.filter(x=>/\.mca$/i.test(x)).length}catch(e){continue}
  try{mt=(await fsp.stat(p)).mtimeMs}catch(e){}
  out.push({nome:d.name,pasta:p,regioes:n,mtime:mt})}
 out.sort((a,b)=>b.mtime-a.mtime);
 return{raiz,mundos:out}});
ipcMain.handle('regioes',async(ev,pasta)=>{const reg=path.join(pasta,'region');
 const out=[];
 for(const f of await fsp.readdir(reg)){const m=/^r\.(-?\d+)\.(-?\d+)\.mca$/i.exec(f);if(!m)continue;
  const st=await fsp.stat(path.join(reg,f));
  out.push({arquivo:f,caminho:path.join(reg,f),rx:+m[1],rz:+m[2],bytes:st.size})}
 out.sort((a,b)=>a.rz-b.rz||a.rx-b.rx);
 return out});
ipcMain.handle('ler-arquivo',async(ev,caminho)=>{const b=await fsp.readFile(caminho);
 return b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)});

/* ---- diálogos de projeto ---- */
ipcMain.handle('escolher-abrir',async()=>{const r=await dialog.showOpenDialog(win,{title:'Abrir projeto',
  filters:[{name:'Projeto do mCAD',extensions:['mcad','json']}],properties:['openFile']});
 if(r.canceled||!r.filePaths[0])return null;
 return{caminho:r.filePaths[0],texto:await fsp.readFile(r.filePaths[0],'utf8')}});
ipcMain.handle('associar',async()=>{const ok=await associarMcad();
 dialog.showMessageBox(win,{type:ok?'info':'warning',title:'Arquivos .mcad',
  message:ok?'Pronto.':'Não foi possível registrar a associação.',
  detail:ok?'O clique duplo num arquivo .mcad passa a abrir o '+NOME+'. Se o Windows ainda abrir outro programa, clique com o botão direito no arquivo, escolha “Abrir com” › “Escolher outro aplicativo” e marque o '+NOME+' como padrão.'
          :'Tente novamente com o programa aberto normalmente, sem privilégios especiais.'});
 return ok});
ipcMain.handle('sobre',async()=>{dialog.showMessageBox(win,{type:'info',title:'Sobre',
 message:NOME+' '+app.getVersion(),
 detail:'BIM simplificado para projetar arquitetura de Minecraft.\n\nElectron '+process.versions.electron+' · Chromium '+process.versions.chrome});
 return true});
ipcMain.handle('salvar-em',async(ev,{caminho,texto})=>{
 try{await fsp.writeFile(caminho,texto,'utf8');return true}catch(e){return false}});
ipcMain.handle('escolher-salvar',async(ev,{nome,texto})=>{const r=await dialog.showSaveDialog(win,{title:'Salvar projeto',
  defaultPath:(nome||'projeto')+'.mcad',filters:[{name:'Projeto do mCAD',extensions:['mcad']}]});
 if(r.canceled||!r.filePath)return null;
 await fsp.writeFile(r.filePath,texto,'utf8');return r.filePath});

/* Qualquer arquivo que o programa gere — schematic em .zip, comandos, .mcad — passa por aqui.
   No navegador isso seria um download; num aplicativo de desktop o certo é a caixa de diálogo
   nativa, que também é o que faltava para o schematic e o .zip saírem. */
/* ---- mCAD Connect ----
   A pasta que o mod do Minecraft e o aplicativo compartilham. É a ponte entre os dois:
   o mod grava as capturas em "capturas", o mCAD grava os projetos em "projetos". */
const CONNECT=()=>path.join(app.getPath('documents'),'mCAD','Connect');
const CAPEXT=/\.(mcadcap|json)$/i;

ipcMain.handle('connect-listar',async()=>{
 const dir=path.join(CONNECT(),'capturas');
 try{await fsp.mkdir(dir,{recursive:true})}catch(e){}
 let itens=[];
 try{const nomes=await fsp.readdir(dir);
  for(const nome of nomes){
   if(!CAPEXT.test(nome))continue;
   try{const st=await fsp.stat(path.join(dir,nome));
    if(!st.isFile())continue;
    itens.push({nome,tam:st.size,ms:st.mtimeMs,
     quando:new Date(st.mtimeMs).toLocaleString('pt-BR')})}catch(e){}}
  itens.sort((a,b)=>b.ms-a.ms);   /* a captura mais recente primeiro */
 }catch(e){}
 return{pasta:dir,itens}});

ipcMain.handle('connect-ler',async(ev,{nome})=>{
 /* o nome vem da lista acima, mas confere assim mesmo: só arquivo, dentro da pasta */
 const base=path.basename(String(nome||''));
 if(base!==nome||!CAPEXT.test(base))throw new Error('nome de captura inválido');
 return fsp.readFile(path.join(CONNECT(),'capturas',base),'utf8')});

ipcMain.handle('connect-abrir-pasta',async()=>{
 const dir=CONNECT();
 try{await fsp.mkdir(path.join(dir,'capturas'),{recursive:true});
  await fsp.mkdir(path.join(dir,'projetos'),{recursive:true})}catch(e){}
 shell.openPath(dir);return dir});

const FILTROS={zip:[{name:'Arquivo compactado',extensions:['zip']}],
 schem:[{name:'Esquema do WorldEdit',extensions:['schem']}],
 txt:[{name:'Texto',extensions:['txt']}],
 mcad:[{name:'Projeto do mCAD',extensions:['mcad']}],
 nbt:[{name:'Estrutura do Minecraft',extensions:['nbt']}]};
ipcMain.handle('salvar-binario',async(ev,{nome,dados,bin})=>{
 const ext=String(nome||'').split('.').pop().toLowerCase();
 const r=await dialog.showSaveDialog(win,{title:'Salvar arquivo',defaultPath:nome||'arquivo',
  filters:(FILTROS[ext]||[{name:ext.toUpperCase(),extensions:[ext]}]).concat([{name:'Todos os arquivos',extensions:['*']}])});
 if(r.canceled||!r.filePath)return null;
 await fsp.writeFile(r.filePath,bin?Buffer.from(dados,'base64'):dados,bin?undefined:'utf8');
 return r.filePath});

/* ---- uma instância só; o segundo clique reaproveita a janela ---- */
if(!app.requestSingleInstanceLock())app.quit();
else{
 app.on('second-instance',(ev,argv)=>{const f=mcadDeArgv(argv);
  if(win){if(win.isMinimized())win.restore();win.focus();if(f)abrirArquivo(f)}});
 app.whenReady().then(async()=>{
  abrirAoIniciar=mcadDeArgv(process.argv);
  menu();criarJanela();
  if(app.isPackaged&&assocPendente())associarMcad().catch(()=>{});
  if(app.isPackaged){try{const{autoUpdater}=require('electron-updater');
    /* a numeração recomeçou em 27.1.0 com o nome mCAD 27, abaixo das versões antigas do
       MineCAD: sem isto o atualizador recusaria a troca por considerá-la um retrocesso */
    autoUpdater.allowDowngrade=true;
    autoUpdater.autoDownload=true;autoUpdater.checkForUpdatesAndNotify()}catch(e){}}
 });
 app.on('window-all-closed',()=>app.quit());
 app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length)criarJanela()});
}
async function abrirArquivo(caminho){try{enviar('abrir-arquivo',{caminho,texto:await fsp.readFile(caminho,'utf8')})}catch(e){}}
ipcMain.handle('pendente',async()=>{if(!abrirAoIniciar)return null;const c=abrirAoIniciar;abrirAoIniciar=null;
 try{return{caminho:c,texto:await fsp.readFile(c,'utf8')}}catch(e){return null}});
/* o .mcad é o documento: o aplicativo guarda o caminho e o Ctrl+S sobrescreve ali */
