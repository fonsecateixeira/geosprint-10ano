(function(){
  const labels = {
    home:{icon:'🏠',title:'Visão geral',sub:'Plano e progresso'},
    subs:{icon:'🌍',title:'Subsistemas',sub:'Terra e interações'},
    rocks:{icon:'🪨',title:'Ciclo das rochas',sub:'Processos e texturas'},
    lab:{icon:'🔬',title:'Laboratório',sub:'Identificar amostras'},
    flash:{icon:'🧠',title:'Flashcards',sub:'Memória rápida'},
    quiz:{icon:'⚡',title:'Quiz rápido',sub:'Treino imediato'},
    exam:{icon:'⏱️',title:'Modo Prova',sub:'Simulação de 50 min'},
    manual:{icon:'📚',title:'Manual & caderno',sub:'43 fotografias'}
  };

  const top = document.createElement('header');
  top.className = 'mobile-topbar';
  top.innerHTML =
    '<div class="mobile-brand">'+
      '<div class="mobile-brand-logo">G10</div>'+
      '<div class="mobile-brand-copy"><b>GeoSprint</b><span class="mobile-current" id="mobileCurrent">Visão geral</span></div>'+
    '</div>'+
    '<button class="mobile-menu-trigger" id="mobileMenuTrigger" aria-label="Abrir menu" aria-expanded="false">☰</button>';
  document.body.appendChild(top);

  const backdrop = document.createElement('div');
  backdrop.className = 'mobile-menu-backdrop';
  backdrop.id = 'mobileMenuBackdrop';
  document.body.appendChild(backdrop);

  const sheet = document.createElement('div');
  sheet.className = 'mobile-menu-sheet';
  sheet.id = 'mobileMenuSheet';
  sheet.setAttribute('role','dialog');
  sheet.setAttribute('aria-label','Menu de estudo');
  sheet.innerHTML =
    '<div class="mobile-menu-head">'+
      '<div><strong>O que queres estudar?</strong><small>Todas as áreas da versão desktop</small></div>'+
      '<button class="mobile-menu-close" id="mobileMenuClose" aria-label="Fechar menu">✕</button>'+
    '</div>'+
    '<div class="mobile-menu-grid" id="mobileMenuGrid"></div>';
  document.body.appendChild(sheet);

  const grid = sheet.querySelector('#mobileMenuGrid');
  Object.keys(labels).forEach(function(page){
    const item = labels[page];
    const b = document.createElement('button');
    b.className = 'mobile-menu-item';
    b.dataset.mobilePage = page;
    b.innerHTML = '<span class="mi-icon">'+item.icon+'</span><span><b>'+item.title+'</b><small>'+item.sub+'</small></span>';
    b.addEventListener('click',function(){ navigate(page); });
    grid.appendChild(b);
  });

  const nav = document.querySelector('.mobile-nav');
  if(nav){
    nav.innerHTML =
      '<button data-mobile-page="home"><span class="mn-icon">🏠</span><span class="mn-label">Início</span></button>'+
      '<button data-mobile-menu="1"><span class="mn-icon">🧭</span><span class="mn-label">Estudar</span></button>'+
      '<button data-mobile-page="lab"><span class="mn-icon">🔬</span><span class="mn-label">Lab</span></button>'+
      '<button data-mobile-page="quiz"><span class="mn-icon">⚡</span><span class="mn-label">Quiz</span></button>'+
      '<button data-mobile-page="exam"><span class="mn-icon">⏱️</span><span class="mn-label">Prova</span></button>';

    nav.querySelectorAll('[data-mobile-page]').forEach(function(b){
      b.addEventListener('click',function(){ navigate(b.dataset.mobilePage); });
    });
    nav.querySelector('[data-mobile-menu]').addEventListener('click',openMenu);
  }

  const trigger = top.querySelector('#mobileMenuTrigger');
  const close = sheet.querySelector('#mobileMenuClose');
  trigger.addEventListener('click',openMenu);
  close.addEventListener('click',closeMenu);
  backdrop.addEventListener('click',closeMenu);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeMenu(); });

  function openMenu(){
    sheet.classList.add('show');
    backdrop.classList.add('show');
    document.body.classList.add('mobile-menu-open');
    trigger.setAttribute('aria-expanded','true');
    sync(activePage());
  }
  function closeMenu(){
    sheet.classList.remove('show');
    backdrop.classList.remove('show');
    document.body.classList.remove('mobile-menu-open');
    trigger.setAttribute('aria-expanded','false');
  }
  function navigate(page){
    if(typeof window.go === 'function') window.go(page);
    else {
      document.querySelectorAll('.page').forEach(function(x){x.classList.toggle('active',x.id===page);});
      window.scrollTo(0,0);
    }
    closeMenu();
    sync(page);
  }
  function activePage(){
    const el = document.querySelector('.page.active');
    return el ? el.id : 'home';
  }
  function sync(page){
    const item = labels[page] || labels.home;
    const current = document.getElementById('mobileCurrent');
    if(current) current.textContent = item.title;
    document.querySelectorAll('[data-mobile-page]').forEach(function(b){
      b.classList.toggle('active',b.dataset.mobilePage===page);
    });
    document.querySelectorAll('.mobile-menu-item').forEach(function(b){
      b.classList.toggle('active',b.dataset.mobilePage===page);
    });
  }

  document.querySelectorAll('.page').forEach(function(pageEl){
    new MutationObserver(function(){
      if(pageEl.classList.contains('active')) sync(pageEl.id);
    }).observe(pageEl,{attributes:true,attributeFilter:['class']});
  });

  sync(activePage());
})();