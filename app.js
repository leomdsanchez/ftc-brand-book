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

  function initAtmosphere() {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const canvas = document.createElement('canvas');
    canvas.className = 'atmosphere';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.append(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) { canvas.remove(); return; }
    let width, height, left, top, particles = [], sources = [], dirty = true;
    let frame = null, last = 0, elapsed = 0;
    const pointer = { x: 0, y: 0, strength: 0, target: 0 };
    function resize() {
      width = innerWidth; height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      left = width > 760 ? $('#sidebar').getBoundingClientRect().right : 0;
      top = $('.topbar').getBoundingClientRect().bottom;
      const count = Math.min(width < 760 ? 70 : 220, Math.round(width * height / 5000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random(), y: Math.random(), size: .45 + Math.random() * .95,
        speed: 3 + Math.random() * 6, phase: Math.random() * Math.PI * 2, opacity: 0
      }));
      dirty = true;
    }
    function measureSources() {
      // Lights stay anchored to the page while scrolling. Overlapping, soft
      // pools cover the whole theme without making every area equally bright.
      const areaWidth = width - left;
      const columns = Math.max(1, Math.ceil(areaWidth / 420));
      const spacingX = areaWidth / columns;
      const spacingY = 360;
      const radius = Math.max(spacingX, spacingY) * 1.3;
      const firstRow = Math.max(0, Math.floor((window.scrollY - radius - 160) / spacingY));
      const lastRow = Math.ceil((window.scrollY + height + radius - 160) / spacingY);
      sources = [];
      for (let row = firstRow; row <= lastRow; row++) {
        const y = 160 + row * spacingY - window.scrollY;
        for (let column = 0; column < columns; column++) {
          sources.push({ x: left + (column + .5) * spacingX, y, radius,
            strength: .4 + ((row + column) % 3) * .04 });
        }
      }
      // The fixed navigation and header get their own gentler light points.
      if (left > 0) {
        for (const fraction of [.22, .65, 1]) {
          sources.push({ x: left * .5, y: height * fraction,
            radius: Math.max(260, height * .45), strength: .28 });
        }
      }
      sources.push({ x: left + areaWidth * .5, y: top * .5,
        radius: Math.max(300, areaWidth * .6), strength: .24 });
      sources.push(...[ ['.hero-art', 280, .9], ['.hero-actions .primary', 170, .65],
        ['#live-button', 170, .75], ['.balance-card', 230, .8] ].flatMap(([selector, radius, strength]) => {
        const element = $(selector);
        if (!element || !element.getClientRects().length) return [];
        const rect = element.getBoundingClientRect();
        if (rect.bottom < top - radius || rect.top > height + radius) return [];
        return [{ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, radius, strength }];
      }));
      dirty = false;
    }
    function glow(source, white = false) {
      const gradient = ctx.createRadialGradient(source.x, source.y, 0, source.x, source.y, source.radius);
      // Match the squared distance falloff used to illuminate each dust mote.
      for (const distance of [0, .25, .5, .75, 1]) {
        const alpha = source.strength * (1 - distance) ** 2;
        gradient.addColorStop(distance, white ? `rgba(225,237,255,${alpha * .035})` : `rgba(0,82,252,${alpha * .12})`);
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(source.x - source.radius, source.y - source.radius, source.radius * 2, source.radius * 2);
    }
    function draw(now) {
      frame = requestAnimationFrame(draw);
      if (last && now - last < 1000 / 30) return;
      const delta = last ? Math.min((now - last) / 1000, .05) : 0;
      last = now; elapsed += delta;
      if (dirty) measureSources();
      pointer.strength += (pointer.target - pointer.strength) * .12;
      const lights = [...sources];
      if (pointer.strength > .01) lights.push({ ...pointer, radius: 180 });
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      for (const source of sources) glow(source);
      if (pointer.strength > .01) glow({ ...pointer, radius: 180 }, true);
      for (const particle of particles) {
        const x = particle.x * width + Math.sin(elapsed * .2 + particle.phase) * 12;
        const y = ((particle.y * height - elapsed * particle.speed) % height + height) % height;
        const illumination = Math.min(1, lights.reduce((sum, light) => sum + Math.max(0, 1 - Math.hypot(x - light.x, y - light.y) / light.radius) ** 2 * light.strength, 0));
        // No ambient visibility floor: unlit dust fades completely away.
        const light = Math.max(0, (illumination - .025) / .975);
        const targetAlpha = Math.pow(light, .75) * .75;
        particle.opacity += (targetAlpha - particle.opacity) * (1 - Math.exp(-delta * 9));
        const alpha = particle.opacity;
        if (alpha < .012) continue;
        if (illumination > .12) {
          const halo = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 4);
          halo.addColorStop(0, `rgba(160,199,255,${alpha * .4})`); halo.addColorStop(1, 'rgba(160,199,255,0)');
          ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x, y, particle.size * 4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = `rgba(225,237,255,${alpha})`;
        ctx.beginPath(); ctx.arc(x, y, particle.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    function sync() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null; last = 0;
      canvas.hidden = motion.matches;
      if (!motion.matches && !document.hidden) { dirty = true; frame = requestAnimationFrame(draw); }
      else ctx.clearRect(0, 0, width, height);
    }
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', () => { dirty = true; pointer.target = 0; }, { passive: true });
    window.addEventListener('pointermove', event => {
      pointer.x = event.clientX; pointer.y = event.clientY;
      const action = event.target.closest?.('.btn.primary');
      pointer.target = event.pointerType !== 'touch' && action && !action.disabled && action.getAttribute('aria-disabled') !== 'true' && action.getAttribute('aria-busy') !== 'true' ? 1 : 0;
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { pointer.target = 0; });
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    resize(); sync();
  }
  initAtmosphere();
})();
