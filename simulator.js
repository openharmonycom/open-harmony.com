(()=>{
  const phone=document.querySelector('#phoneScreen');
  const home=document.querySelector('#homeView');
  const appView=document.querySelector('#appView');
  const appTitle=document.querySelector('#appTitle');
  const appContent=document.querySelector('#appContent');
  const quickPanel=document.querySelector('#quickPanel');
  const clock=document.querySelector('#clock');
  const dateLabel=document.querySelector('#dateLabel');
  const quickDate=document.querySelector('#quickDate');
  if(!phone)return;

  const templates={
    Gallery:`<p class="app-lede">Your moments, arranged by time.</p><h3>Recent photos</h3><div class="photo-grid"><div class="photo-tile" aria-label="Pink sunset photo"></div><div class="photo-tile" aria-label="Blue lake photo"></div><div class="photo-tile" aria-label="Warm landscape photo"></div><div class="photo-tile" aria-label="Mountain view photo"></div></div>`,
    Settings:`<p class="app-lede">Personalize your device experience.</p><div class="settings-list"><div class="settings-row"><span>◔</span><div><b>Wi-Fi</b><small>OpenHarmony network</small></div><button class="switch" data-setting="Wi-Fi" aria-label="Toggle Wi-Fi" aria-pressed="true"></button></div><div class="settings-row"><span>ᛒ</span><div><b>Bluetooth</b><small>Connected devices</small></div><button class="switch" data-setting="Bluetooth" aria-label="Toggle Bluetooth" aria-pressed="true"></button></div><div class="settings-row"><span>☾</span><div><b>Do Not Disturb</b><small>Silence notifications</small></div><button class="switch" data-setting="Do Not Disturb" aria-label="Toggle Do Not Disturb" aria-pressed="false"></button></div><div class="settings-row"><span>☼</span><div><b>Display & brightness</b><small>Comfortable viewing</small></div><span>›</span></div><div class="settings-row"><span>♧</span><div><b>Privacy</b><small>Permissions and security</small></div><span>›</span></div></div>`,
    'App Market':`<p class="app-lede">Discover apps for your connected life.</p><div class="market-card"><small>FEATURED COLLECTION</small><h3>Made for everyday</h3><p>Explore experiences for work, creativity, and the moments in between.</p></div><h3>Popular picks</h3><div class="sample-row"><span class="sample-icon">✦</span><div>Daily Notes<small>Productivity · 4.8 ★</small></div></div><div class="sample-row"><span class="sample-icon">♫</span><div>Music Studio<small>Entertainment · 4.7 ★</small></div></div><div class="sample-row"><span class="sample-icon">◎</span><div>Travel Map<small>Travel · 4.6 ★</small></div></div>`,
    Music:`<div class="music-player"><div class="album-art"></div><h3>Connected Horizons</h3><p>OpenHarmony Sessions</p><div class="progress-track"><span></span></div><p>1:24 <span style="float:right">3:42</span></p><button class="play-control" id="playMusic" type="button" aria-label="Play music">▶</button></div>`,
    Messages:`<p class="app-lede">A little more connected.</p><div class="message-bubble">Hey! Are we still meeting at the riverside park?</div><div class="message-bubble outgoing">Yes — see you there at 10:30 ☀</div><div class="message-bubble">Perfect. I’ll bring the camera!</div>`,
    Camera:`<p class="app-lede">Capture a moment.</p><div class="camera-view"><button class="shutter" id="shutter" type="button" aria-label="Take a sample photo"></button></div>`,
    Clock:`<p class="app-lede">A clear view of your day.</p><div class="clock-face" aria-label="Analog clock illustration"></div><h3 style="text-align:center">Shanghai · Local time</h3>`,
    Notes:`<p class="app-lede">Keep a thought close at hand.</p><div class="app-placeholder">A good idea can start anywhere.<br><br>Tap + to create a new note.</div>`,
    Phone:`<p class="app-lede">Your connected contacts.</p><div class="app-placeholder">No recent calls<br><br>Favorites and contacts appear here in this demo.</div>`,
    Browser:`<p class="app-lede">Explore the web.</p><div class="app-placeholder">Search or enter a website<br><br>This browser screen is a visual demo.</div>`
  };
  const labels=Object.keys(templates);
  let activeApp='';
  let pointerStart=null;

  const setDate=()=>{
    const now=new Date();
    clock.textContent=new Intl.DateTimeFormat('en',{hour:'numeric',minute:'2-digit'}).format(now);
    const formatted=new Intl.DateTimeFormat('en',{weekday:'long',month:'long',day:'numeric'}).format(now);
    dateLabel.textContent=formatted;
    quickDate.textContent=formatted;
  };
  setDate();
  window.setInterval(setDate,30000);

  const showHome=()=>{
    activeApp='';
    home.hidden=false;
    appView.hidden=true;
    quickPanel.hidden=true;
  };
  const openApp=(name)=>{
    if(!templates[name])return;
    activeApp=name;
    appTitle.textContent=name;
    appContent.innerHTML=templates[name];
    home.hidden=true;
    appView.hidden=false;
    quickPanel.hidden=true;
    appContent.querySelectorAll('[data-setting]').forEach(button=>{
      button.addEventListener('click',()=>{
        const next=button.getAttribute('aria-pressed')!=='true';
        button.setAttribute('aria-pressed',String(next));
      });
    });
    const play=appContent.querySelector('#playMusic');
    if(play)play.addEventListener('click',()=>{const playing=play.textContent==='❚❚';play.textContent=playing?'▶':'❚❚';play.setAttribute('aria-label',playing?'Play music':'Pause music')});
    const shutter=appContent.querySelector('#shutter');
    if(shutter)shutter.addEventListener('click',()=>{shutter.style.background='#7ee1be';shutter.setAttribute('aria-label','Sample photo captured')});
  };
  const toggleQuickPanel=(show)=>{
    quickPanel.hidden=show===undefined?!quickPanel.hidden:!show;
    if(!quickPanel.hidden)appView.hidden=true;
  };

  document.querySelectorAll('[data-app]').forEach(button=>button.addEventListener('click',()=>openApp(button.dataset.app)));
  document.querySelector('#statusButton').addEventListener('click',()=>toggleQuickPanel(true));
  document.querySelector('#closeQuickPanel').addEventListener('click',()=>{quickPanel.hidden=true;if(activeApp)appView.hidden=false});
  document.querySelector('#backButton').addEventListener('click',showHome);
  document.querySelector('#phoneBack').addEventListener('click',()=>{if(!quickPanel.hidden){quickPanel.hidden=true;if(activeApp)appView.hidden=false}else showHome()});
  document.querySelector('#homeButton').addEventListener('click',showHome);
  document.querySelector('#recentButton').addEventListener('click',()=>activeApp?openApp(activeApp):openApp('App Market'));
  document.querySelectorAll('[data-toggle]').forEach(button=>button.addEventListener('click',()=>{
    const enabled=button.getAttribute('aria-pressed')!=='true';
    button.setAttribute('aria-pressed',String(enabled));
    button.classList.toggle('active',enabled);
    const status=button.querySelector('small');
    if(status)status.textContent=enabled?'On':'Off';
  }));
  document.querySelector('.brightness-control input').addEventListener('input',event=>{
    const value=Number(event.currentTarget.value);
    phone.style.filter=`brightness(${0.58+value/200})`;
  });
  document.querySelector('#resetSimulator').addEventListener('click',()=>{
    document.querySelectorAll('[data-toggle]').forEach(button=>{
      const enabled=['Wi-Fi','Bluetooth'].includes(button.dataset.toggle);
      button.setAttribute('aria-pressed',String(enabled));
      button.classList.toggle('active',enabled);
      const status=button.querySelector('small');
      if(status)status.textContent=enabled?(button.dataset.toggle==='Wi-Fi'?'OpenHarmony':'On'):'Off';
    });
    const brightness=document.querySelector('.brightness-control input');
    brightness.value='82';
    phone.style.filter='';
    showHome();
  });
  phone.addEventListener('pointerdown',event=>{pointerStart=event.clientY});
  phone.addEventListener('pointerup',event=>{
    if(pointerStart===null)return;
    const distance=event.clientY-pointerStart;
    if(distance>65&&pointerStart<phone.clientHeight*.25)toggleQuickPanel(true);
    if(distance< -65){if(!quickPanel.hidden){quickPanel.hidden=true;if(activeApp)appView.hidden=false}else showHome()}
    pointerStart=null;
  });
  window.addEventListener('keydown',event=>{if(event.key==='Escape'){if(!quickPanel.hidden){quickPanel.hidden=true;if(activeApp)appView.hidden=false}else showHome()}});
})();
