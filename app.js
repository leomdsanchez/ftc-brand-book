(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  let toastTimer;
  function toast(message) {
    clearTimeout(toastTimer);
    const host = document.querySelector('dialog[open]') || document.body;
    if ($('#toast').parentElement !== host) host.append($('#toast'));
    $('#toast-text').textContent = message;
    $('#toast').hidden = false;
    toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 4500);
  }
  $('#toast-close').addEventListener('click', () => { clearTimeout(toastTimer); $('#toast').hidden = true; });
  async function copy(text, message = 'Copiado. Pronto para usar.') {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement('textarea');
        area.value = text; area.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
        const host = document.querySelector('dialog[open]') || document.body;
        const active = document.activeElement;
        host.append(area); area.focus(); area.select();
        const ok = document.execCommand('copy'); area.remove(); active?.focus();
        if (!ok) throw new Error('Clipboard unavailable');
      }
      toast(message);
    } catch {
      showCode('Copiar manualmente', text, 'Selecione o código abaixo e copie com Ctrl+C ou Cmd+C.');
      toast('Selecione o texto para copiar manualmente.');
    }
  }
  const colors = [
    ['Azul Frontrade', '#0052FC', '--brand', 'AÇÃO PRINCIPAL'],
    ['Fundo', '#090909', '--bg'],
    ['Superfície', '#0D0D0D', '--surface'],
    ['Texto principal', '#FFFFFF', '--text'],
    ['Texto secundário', '#A4A4A4', '--text-secondary']
  ];
  $('#palette').innerHTML = colors.map(([name,hex,token,tag]) => `<button class="color-card" data-copy="${hex}" aria-label="Copiar ${name}, ${hex}"><div class="color-swatch" style="--swatch:${hex};--swatch-text:${hex === '#FFFFFF' || hex === '#A4A4A4' ? '#222' : '#fff'}"><span class="swatch-tag">${tag || 'BASE'}</span>${icon('copy')}</div><div class="color-info"><strong>${name}</strong><code>${hex}</code><small>${token}</small></div></button>`).join('');
  $$('[data-copy]').forEach(button => button.addEventListener('click', () => copy(button.dataset.copy, `${button.dataset.copy} copiado.`)));
  $('#spacing-list').innerHTML = [4,8,12,16,24,32,48,64].map(n=>`<div class="spacing-item"><i style="--space:${n}px"></i><span>${n}</span></div>`).join('');

  let variant = 'primary';
  function renderButtons() {
    const states = [ ['Padrão','',false], ['Hover · amostra','state-hover',false], ['Pressionado · amostra','state-pressed',false], ['Foco · amostra','state-focus',false], ['Desabilitado','',true], ['Carregando','',false] ];
    $('#button-states').innerHTML = states.map(([label, cls, disabled],i) => `<div class="state-cell"><button class="btn ${variant} ${cls}" ${disabled ? 'disabled' : ''} ${i===5?'aria-busy="true" aria-disabled="true" tabindex="-1"':''} data-state="${i}" aria-label="${label}: Comprar cripto">${i===5?'<span class="spinner" aria-hidden="true"></span>Processando…':`${icon('plus')}Comprar cripto`}</button><span class="label">${label}</span></div>`).join('');
    $('#live-button').className = `btn ${variant}`;
    $$('[data-state]', $('#button-states')).forEach(button => button.addEventListener('click',()=>{
      if (button.dataset.state !== '5') toast('Exemplo de ação. Nenhuma compra foi realizada.');
    }));
  }
  function setupTabs(container, callback) {
    const tabs = $$('[role=tab]',container);
    const activate = tab => {
      tabs.forEach(t => {const selected = t === tab; t.setAttribute('aria-selected', String(selected));t.tabIndex = selected ? 0 : -1;});
      const panel = document.getElementById(tab.getAttribute('aria-controls')); panel.setAttribute('aria-labelledby',tab.id);
      callback(tab);
    };
    tabs.forEach((tab,i) => {
      tab.addEventListener('click',()=>activate(tab));
      tab.addEventListener('keydown', e => {
        let index;
        if(e.key==='ArrowRight') index=(i+1)%tabs.length;
        if(e.key==='ArrowLeft') index=(i-1+tabs.length)%tabs.length;
        if(e.key==='Home') index=0;
        if(e.key==='End') index=tabs.length-1;
        if(index !== undefined){ e.preventDefault();tabs[index].focus();activate(tabs[index]); }
      });
    });
  }
  setupTabs($('#button-tabs'),tab=>{variant=tab.dataset.variant;renderButtons();});renderButtons();
  const liveButton=$('#live-button');
  let liveResetTimer, livePressed=false, liveCompleted=false;
  function updateLiveState(){
    const state=liveButton.disabled?'Desabilitado':liveButton.getAttribute('aria-busy')==='true'?'Carregando':liveCompleted?'Concluído':livePressed?'Pressionado':liveButton.matches(':focus-visible')?'Foco por teclado':liveButton.matches(':hover')&&window.matchMedia('(hover:hover)').matches?'Hover':'Padrão';
    $('#live-button-state').textContent=`Estado: ${state}`;
  }
  ['pointerenter','pointerleave','focus','blur'].forEach(event=>liveButton.addEventListener(event,updateLiveState));
  liveButton.addEventListener('pointerdown',()=>{livePressed=true;updateLiveState();});
  window.addEventListener('pointerup',()=>{livePressed=false;updateLiveState();});
  liveButton.addEventListener('pointercancel',()=>{livePressed=false;updateLiveState();});
  liveButton.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){livePressed=true;updateLiveState();}});
  liveButton.addEventListener('keyup',()=>{livePressed=false;updateLiveState();});
  $('#disable-live').addEventListener('change',e=>{liveButton.disabled=e.target.checked;updateLiveState();});
  liveButton.addEventListener('click',async e=>{
    const b=e.currentTarget;
    if(b.disabled||b.getAttribute('aria-busy')==='true')return;
    clearTimeout(liveResetTimer);liveCompleted=false;
    $('#disable-live').disabled=true;
    b.setAttribute('aria-busy','true');b.setAttribute('aria-disabled','true');
    b.innerHTML='<span class="spinner" aria-hidden="true"></span>Processando…';
    updateLiveState();
    await new Promise(resolve=>setTimeout(resolve,1300));
    b.removeAttribute('aria-busy');b.removeAttribute('aria-disabled');
    $('#disable-live').disabled=false;liveCompleted=true;
    b.innerHTML=`${icon('check')}Exemplo concluído`;toast('Simulação concluída. Nenhuma operação real foi realizada.');
    updateLiveState();
    liveResetTimer=setTimeout(()=>{liveCompleted=false;b.innerHTML=`${icon('plus')}Comprar cripto`;updateLiveState();},2200);
  });
  $$('[data-demo-action]').forEach(b=>b.addEventListener('click',()=>toast('Ação demonstrada. Este botão está pronto para receber seu fluxo.')));

  $('#demo-form').addEventListener('submit',e=>{
    e.preventDefault();const input=$('#demo-email');const field=input.closest('.field');const valid=input.value.trim()!==''&&input.validity.valid;
    field.classList.toggle('error',!valid);field.classList.toggle('success',valid);
    input.setAttribute('aria-invalid',String(!valid));
    $('#demo-email-message').textContent=valid?'Email válido. Nenhum dado foi enviado.':'Insira um email válido, como voce@exemplo.com.';
    if(valid)toast('Email validado nesta página.');else input.focus();
  });
  $('#demo-email').addEventListener('input',e=>{e.target.closest('.field').classList.remove('error','success');e.target.removeAttribute('aria-invalid');$('#demo-email-message').textContent='Experimente enviar com um email incompleto.';});

  const assets=[
    {name:'Bitcoin',symbol:'BTC',coin:'₿',cls:'bitcoin',price:352480,change:2.45,amount:'0,0452 BTC',balance:15932.10},
    {name:'Ethereum',symbol:'ETH',coin:'Ξ',cls:'ethereum',price:18920,change:-.82,amount:'0,3200 ETH',balance:6054.40},
    {name:'Tether',symbol:'USDT',coin:'₮',cls:'usdt',price:5.42,change:.03,amount:'528,3229 USDT',balance:2863.50}
  ];
  const transactions=[
    {...assets[0],type:'Compra',date:'02 out. 2026',total:500,status:'Concluído',statusClass:'positive'},
    {...assets[1],type:'Compra',date:'01 out. 2026',total:250,status:'Pendente',statusClass:'warning'},
    {...assets[2],type:'Venda',date:'30 set. 2026',total:120,status:'Falhou',statusClass:'negative'}
  ];
  const brl=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
  const balance=assets.reduce((total,asset)=>total+asset.balance,0);
  function renderBalance(){ $('#portfolio-balance').textContent=$('#balance-switch').checked?brl(balance):'R$ ••••••'; }
  $('#balance-switch').addEventListener('change',renderBalance);renderBalance();
  const assetCell=a=>`<div class="asset-name"><span class="coin ${a.cls}">${a.coin}</span><div><strong>${a.name}</strong><small>${a.symbol}</small></div></div>`;
  let view='assets', sortDirection=0;
  function renderData(){
    const query=$('#asset-search').value.trim().toLocaleLowerCase('pt-BR');
    let rows=(view==='assets'?assets:transactions).filter(a=>`${a.name} ${a.symbol}`.toLocaleLowerCase('pt-BR').includes(query));
    if(view==='assets'&&sortDirection)rows=[...rows].sort((a,b)=>(a.price-b.price)*sortDirection);
    if(view==='assets'){
      $('#table-head').innerHTML=`<tr><th scope="col">Ativo</th><th scope="col" class="number" aria-sort="${sortDirection===1?'ascending':sortDirection===-1?'descending':'none'}"><button class="sort-btn" id="sort-price" aria-label="Ordenar por preço">Preço ${sortDirection===1?'↑':sortDirection===-1?'↓':'↕'}</button></th><th scope="col" class="number">24h</th><th scope="col" class="number">Quantidade</th><th scope="col" class="number">Saldo</th></tr>`;
      $('#table-body').innerHTML=rows.map(a=>`<tr><td>${assetCell(a)}</td><td class="number">${brl(a.price)}</td><td class="number ${a.change>=0?'positive':'negative'}">${a.change>=0?'↗ +':'↘ −'}${Math.abs(a.change).toFixed(2).replace('.',',')}%</td><td class="number muted">${a.amount}</td><td class="number">${brl(a.balance)}</td></tr>`).join('');
      $('#sort-price').addEventListener('click',()=>{sortDirection=sortDirection===1?-1:1;renderData();$('#sort-price').focus();});
    }else{
      $('#table-head').innerHTML='<tr><th scope="col">Ativo</th><th scope="col">Operação</th><th scope="col">Data</th><th scope="col" class="number">Valor</th><th scope="col">Status</th></tr>';
      $('#table-body').innerHTML=rows.map(a=>`<tr><td>${assetCell(a)}</td><td>${a.type}</td><td class="muted">${a.date}</td><td class="number">${brl(a.total)}</td><td><span class="badge ${a.statusClass}">${a.status}</span></td></tr>`).join('');
    }
    $('#empty-state').hidden=rows.length!==0;$('#asset-table').hidden=rows.length===0;
    $('#result-count').textContent=`${rows.length} ${view==='assets'?'ativos':'transações'}`;
    $('#asset-table caption').textContent=view==='assets'?'Ativos fictícios para demonstrar o componente de tabela':'Transações fictícias para demonstrar o componente de tabela';
  }
  setupTabs($('#data-tabs'),tab=>{view=tab.dataset.view;$('#asset-search').placeholder=view==='assets'?'Buscar ativo…':'Buscar transação…';renderData();});
  $('#asset-search').addEventListener('input',renderData);
  $('#clear-search').addEventListener('click',()=>{$('#asset-search').value='';renderData();$('#asset-search').focus();});renderData();

  const tradeDialog=$('#trade-modal');
  $('#modal-open').addEventListener('click',()=>tradeDialog.showModal());
  $('#buy-open').addEventListener('click',()=>tradeDialog.showModal());
  $('#deposit-demo').addEventListener('click',()=>toast('Exemplo de depósito. Nenhuma movimentação real foi iniciada.'));
  $('#toast-demo').addEventListener('click',()=>toast('Tudo certo. Sua preferência foi atualizada no exemplo.'));
  $('#confirm-demo').addEventListener('click',()=>{tradeDialog.close();toast('Exemplo confirmado. Nenhuma compra real foi realizada.');});
  $$('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  $$('dialog').forEach(d=>d.addEventListener('close',()=>{if(d.contains($('#toast')))document.body.append($('#toast'));}));
  $$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));

  const tokenNames=['brand','brand-hover','brand-pressed','bg','surface','surface-raised','text','text-secondary','text-soft','border','border-control','success','warning','danger','focus','radius-control','radius-card','radius-panel','space-1','space-2','space-3','space-4','space-6','space-8','space-12','space-16','font'];
  const computedTokens=getComputedStyle(document.documentElement);
  const tokenCSS=`/* Frontrade Cryptos · tokens v0.2
   Base da marca: azul, neutros e Satoshi.
   Propostas: estados, cores funcionais e escala de medidas. */
:root {
${tokenNames.map(name=>`  --${name}: ${computedTokens.getPropertyValue(`--${name}`).trim()};`).join('\n')}
}`;
  const buttonCode=`<!-- Use junto ao styles.css e aos arquivos Satoshi em assets/. -->
<button class="btn primary">Comprar cripto</button>
<button class="btn secondary">Cancelar</button>
<button class="btn ghost">Saiba mais</button>
<button class="btn primary" disabled>Indisponível</button>
<button class="btn primary" aria-busy="true" aria-disabled="true">
  <span class="spinner" aria-hidden="true"></span>
  Processando…
</button>

<!-- O styles.css inclui hover, :active e :focus-visible nas três variantes.
     :disabled mantém a aparência mesmo sob hover.
     Durante carregamento, o handler deve impedir novas ações
     enquanto aria-busy="true". Veja HANDOFF.md para o contrato completo. -->`;
  function showCode(title,code,description='Use os tokens junto ao arquivo styles.css da biblioteca.'){
    $('#code-title').textContent=title;$('#code-content').textContent=code;$('#code-description').textContent=description;
    if(!$('#code-dialog').open)$('#code-dialog').showModal();
  }
  $('#open-code').addEventListener('click',()=>showCode('Tokens da identidade',tokenCSS));
  $('#view-css').addEventListener('click',()=>showCode('Tokens CSS',tokenCSS));
  $('[data-snippet="buttons"]').addEventListener('click',()=>showCode('Estrutura dos botões',buttonCode,'Copie as estruturas e reutilize as classes do arquivo styles.css.'));
  $('#copy-code').addEventListener('click',()=>copy($('#code-content').textContent));
  $('#download-tokens').addEventListener('click',()=>{
    const url=URL.createObjectURL(new Blob([tokenCSS],{type:'text/css'}));
    const a=document.createElement('a');a.href=url;a.download='frontrade-tokens.css';document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Tokens CSS exportados.');
  });
  const menu=$('#menu-toggle');
  const mobileLayout=window.matchMedia('(max-width:760px)');
  function syncNavigation(){
    const hidden=mobileLayout.matches&&!$('#sidebar').classList.contains('open');
    $('#sidebar').inert=hidden;
    if(hidden)$('#sidebar').setAttribute('aria-hidden','true');else $('#sidebar').removeAttribute('aria-hidden');
  }
  function closeMenu(){ $('#sidebar').classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir navegação');syncNavigation(); }
  menu.addEventListener('click',()=>{const open=$('#sidebar').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar navegação':'Abrir navegação');syncNavigation();});
  mobileLayout.addEventListener('change',closeMenu);syncNavigation();
  $$('.sidebar a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('click',e=>{if(!$('#sidebar').contains(e.target)&&!menu.contains(e.target))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#sidebar').classList.contains('open')){closeMenu();menu.focus();}});
  const navLinks=$$('.nav-link');
  const sections=$$('main>section');
  sections.forEach(section=>section.tabIndex=-1);
  function updateActiveSection(){
    const atEnd=window.scrollY>0&&window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4;
    const current=atEnd?sections.at(-1):sections.filter(section=>section.getBoundingClientRect().top<=140).at(-1)||sections[0];
    const id=current.id;
    navLinks.forEach(a=>{const selected=a.getAttribute('href')===`#${id}`;a.classList.toggle('active',selected);if(selected)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  }
  let scrollFrame;
  window.addEventListener('scroll',()=>{if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{updateActiveSection();scrollFrame=null;});},{passive:true});
  window.addEventListener('resize',updateActiveSection);updateActiveSection();
})();
