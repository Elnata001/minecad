/* Processo principal do MineCAD no Electron.
   O aplicativo em si continua sendo o index.html — este arquivo só dá a ele o que
   um navegador não dá: janela que lembra o tamanho, menu nativo, associação do
   .mcad, leitura direta da pasta de mundos do Minecraft e atualização automática. */
const {app,BrowserWindow,Menu,ipcMain,dialog,shell,nativeTheme}=require('electron');
const path=require('path'),fs=require('fs'),fsp=fs.promises;

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
  title:'MineCAD',
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
 win.webContents.setWindowOpenHandler(({url})=>{shell.openExternal(url);return{action:'deny'}});
 win.webContents.on('will-navigate',(ev,url)=>{if(url!==win.webContents.getURL()){ev.preventDefault();shell.openExternal(url)}});
 return win}

function menu(){
 const t=[
  {label:'Arquivo',submenu:[
   {label:'Tela inicial',accelerator:'CmdOrCtrl+Shift+N',click:()=>enviar('tela-inicial')},
   {label:'Abrir projeto…',accelerator:'CmdOrCtrl+O',click:()=>enviar('abrir-projeto')},
   {label:'Salvar',accelerator:'CmdOrCtrl+S',click:()=>enviar('salvar-projeto')},
   {label:'Salvar como…',accelerator:'CmdOrCtrl+Shift+S',click:()=>enviar('salvar-como')},
   {type:'separator'},
   {label:'Associar os arquivos .mcad a este programa',click:async()=>{
     const ok=await associarMcad();
     dialog.showMessageBox(win,{type:ok?'info':'warning',title:'Arquivos .mcad',
      message:ok?'Pronto.':'Não foi possível registrar a associação.',
      detail:ok?'O clique duplo num arquivo .mcad passa a abrir o MineCAD. Se o Windows ainda abrir outro programa, clique com o botão direito no arquivo, escolha “Abrir com” › “Escolher outro aplicativo” e marque o MineCAD como padrão.'
              :'Tente novamente com o programa aberto normalmente, sem privilégios especiais.'})}},
   {type:'separator'},
   {label:'Sair',role:'quit'}]},
  {label:'Editar',submenu:[
   {label:'Desfazer',accelerator:'CmdOrCtrl+Z',click:()=>enviar('desfazer')},
   {label:'Refazer',accelerator:'CmdOrCtrl+Y',click:()=>enviar('refazer')},
   {type:'separator'},
   {label:'Recortar',role:'cut'},{label:'Copiar',role:'copy'},{label:'Colar',role:'paste'}]},
  {label:'Visualizar',submenu:[
   {label:'Recarregar',role:'reload'},
   {label:'Aproximar',role:'zoomIn'},{label:'Afastar',role:'zoomOut'},{label:'Tamanho normal',role:'resetZoom'},
   {type:'separator'},
   {label:'Tela cheia',role:'togglefullscreen'},
   {label:'Ferramentas de desenvolvedor',accelerator:'F12',role:'toggleDevTools'}]},
  {label:'Ajuda',submenu:[
   {label:'Repositório no GitHub',click:()=>shell.openExternal('https://github.com/Elnata001/minecad')},
   {label:'Versão para navegador',click:()=>shell.openExternal('https://elnata001.github.io/minecad/')},
   {type:'separator'},
   {label:'Sobre o MineCAD',click:()=>dialog.showMessageBox(win,{type:'info',title:'Sobre',
     message:'MineCAD '+app.getVersion(),
     detail:'BIM simplificado para projetar arquitetura de Minecraft.\n\nElectron '+process.versions.electron+' · Chromium '+process.versions.chrome})}]}
 ];
 Menu.setApplicationMenu(Menu.buildFromTemplate(t))}
const enviar=(canal,dado)=>{if(win&&!win.isDestroyed())win.webContents.send(canal,dado)};

/* ---- associação dos arquivos .mcad ----
   O instalador registra a extensão, mas o Windows só passa a abrir o programa no clique
   duplo quando existe um ProgID apontando para o executável. Isso é gravado em HKCU, que
   é por usuário e não pede privilégio, e é refeito quando o caminho do programa muda. */
function associarMcad(){
 if(process.platform!=='win32'||!app.isPackaged)return Promise.resolve(false);
 const exe=process.execPath,{execFile}=require('child_process');
 const chaves=[
  ['HKCU\\Software\\Classes\\.mcad','/ve','/d','MineCAD.Projeto'],
  ['HKCU\\Software\\Classes\\.mcad\\OpenWithProgids','/v','MineCAD.Projeto','/t','REG_NONE'],
  ['HKCU\\Software\\Classes\\MineCAD.Projeto','/ve','/d','Projeto do MineCAD'],
  ['HKCU\\Software\\Classes\\MineCAD.Projeto\\DefaultIcon','/ve','/d',exe+',0'],
  ['HKCU\\Software\\Classes\\MineCAD.Projeto\\shell\\open','/ve','/d','Abrir no MineCAD'],
  ['HKCU\\Software\\Classes\\MineCAD.Projeto\\shell\\open\\command','/ve','/d','"'+exe+'" "%1"']
 ];
 return new Promise(res=>{let i=0;
  const passo=()=>{if(i>=chaves.length){
    try{fs.writeFileSync(ASSOC,JSON.stringify({exe}))}catch(e){}
    return res(true)}
   execFile('reg',['add'].concat(chaves[i++]).concat(['/f']),{windowsHide:true},err=>err?res(false):passo())};
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
  filters:[{name:'Projeto do MineCAD',extensions:['mcad','json']}],properties:['openFile']});
 if(r.canceled||!r.filePaths[0])return null;
 return{caminho:r.filePaths[0],texto:await fsp.readFile(r.filePaths[0],'utf8')}});
ipcMain.handle('salvar-em',async(ev,{caminho,texto})=>{
 try{await fsp.writeFile(caminho,texto,'utf8');return true}catch(e){return false}});
ipcMain.handle('escolher-salvar',async(ev,{nome,texto})=>{const r=await dialog.showSaveDialog(win,{title:'Salvar projeto',
  defaultPath:(nome||'projeto')+'.mcad',filters:[{name:'Projeto do MineCAD',extensions:['mcad']}]});
 if(r.canceled||!r.filePath)return null;
 await fsp.writeFile(r.filePath,texto,'utf8');return r.filePath});

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
    autoUpdater.autoDownload=true;autoUpdater.checkForUpdatesAndNotify()}catch(e){}}
 });
 app.on('window-all-closed',()=>app.quit());
 app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length)criarJanela()});
}
async function abrirArquivo(caminho){try{enviar('abrir-arquivo',{caminho,texto:await fsp.readFile(caminho,'utf8')})}catch(e){}}
ipcMain.handle('pendente',async()=>{if(!abrirAoIniciar)return null;const c=abrirAoIniciar;abrirAoIniciar=null;
 try{return{caminho:c,texto:await fsp.readFile(c,'utf8')}}catch(e){return null}});
/* o .mcad é o documento: o aplicativo guarda o caminho e o Ctrl+S sobrescreve ali */
