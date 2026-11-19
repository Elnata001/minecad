/* Ponte entre o processo principal e o aplicativo. Só o que está aqui fica visível
   para a página — o resto do Node continua fora do alcance dela. */
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('mcDesktop',{
 versao:process.versions.electron,
 /* mundos do Minecraft instalados nesta máquina */
 mundos:()=>ipcRenderer.invoke('mundos'),
 regioes:pasta=>ipcRenderer.invoke('regioes',pasta),
 lerArquivo:caminho=>ipcRenderer.invoke('ler-arquivo',caminho),
 /* projetos .mcad */
 escolherAbrir:()=>ipcRenderer.invoke('escolher-abrir'),
 escolherSalvar:(nome,texto)=>ipcRenderer.invoke('escolher-salvar',{nome,texto}),
 salvarEm:(caminho,texto)=>ipcRenderer.invoke('salvar-em',{caminho,texto}),
 associar:()=>ipcRenderer.invoke('associar'),
 sobre:()=>ipcRenderer.invoke('sobre'),
 pendente:()=>ipcRenderer.invoke('pendente'),
 /* comandos vindos do menu nativo */
 ao:(canal,fn)=>{const ok=['abrir-projeto','salvar-projeto','salvar-como','tela-inicial','desfazer','refazer','abrir-arquivo'];
  if(ok.includes(canal))ipcRenderer.on(canal,(ev,dado)=>fn(dado))}
});
