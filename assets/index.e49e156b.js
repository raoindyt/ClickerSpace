var h=(l,t)=>()=>(t||l((t={exports:{}}).exports,t),t.exports);var p=h((f,r)=>{(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();class d{constructor(){this.money=0,this.clickValue=1,this.baseAutoClickValue=0,this.autoClickValue=0,this.currentPlanet="earth",this.isAdBoostActive=!1,this.adBoostTimeout=null,this.boostDuration=3e4,this.boostMultiplier=2,this.soundEnabled=!0,this.musicEnabled=!0,this.intervals=[],this.timeouts=[],this.eventListeners=[],this.clickDebounce=!1,this.unlockedPlanets=["earth"],this.planetPrices={mars:1e3,jupiter:5e3,saturn:1e4,uranus:25e3,neptune:5e4,sun:1e5},this.upgradePrices={click:10,auto:50},this.initMonetag(),this.loadGame(),this.initAudio(),this.initElements(),this.bindEvents(),this.initTabs(),this.startAutoClicker(),this.startAutoSave(),this.updateDisplay()}initMonetag(){this.adHandler=null,this.adPreloaded=!1,typeof show_9701900<"u"&&typeof show_9701900=="function"?(this.adHandler=show_9701900,console.log("Monetag SDK initialized successfully"),this.preloadAd()):console.warn("Monetag SDK not found. Ad features disabled.")}preloadAd(){if(!this.adHandler)return;const t=`preload-${Date.now()}`;this.adHandler({type:"preload",ymid:t}).then(()=>{this.adPreloaded=!0,this.currentPreloadId=t,console.log("Ad preloaded successfully")}).catch(e=>{console.log("Failed to preload ad:",e),this.adPreloaded=!1})}initAudio(){this.sounds={click:null,purchase:null,upgrade:null,boost:null};try{const t={click:"/sounds/click.mp3",purchase:"/sounds/purchase.mp3",upgrade:"/sounds/upgrade.mp3",boost:"/sounds/boost.mp3"};for(const[e,s]of Object.entries(t)){const i=new Audio(s);i.preload="auto",i.volume=.5,i.addEventListener("error",()=>{console.log(`Sound file not found: ${s}`)}),this.sounds[e]=i}}catch(t){console.log("Audio initialization failed:",t)}}initElements(){this.moneyDisplay=document.getElementById("money-amount"),this.incomeDisplay=document.getElementById("income-amount"),this.planetEarth=document.getElementById("planet-earth"),this.settingsBtn=document.getElementById("settings-btn"),this.mapBtn=document.getElementById("map-btn"),this.shopBtn=document.getElementById("shop-btn"),this.friendsBtn=document.getElementById("friends-btn"),this.overlay=document.getElementById("overlay")}bindEvents(){this.addEventListener(this.planetEarth,"click",a=>this.clickPlanet(a)),this.addEventListener(this.settingsBtn,"click",()=>this.openSettings()),this.addEventListener(this.mapBtn,"click",()=>this.openMap()),this.addEventListener(this.shopBtn,"click",()=>this.openShop()),this.addEventListener(this.friendsBtn,"click",()=>this.openFriends());const t=document.getElementById("buy-click"),e=document.getElementById("buy-auto");t&&this.addEventListener(t,"click",()=>this.buyUpgrade("click")),e&&this.addEventListener(e,"click",()=>this.buyUpgrade("auto"));const s=document.getElementById("watch-ad-btn");s&&this.addEventListener(s,"click",()=>this.watchAd());const i=document.getElementById("sound-toggle"),o=document.getElementById("music-toggle");i&&(i.checked=this.soundEnabled,this.addEventListener(i,"change",a=>{this.soundEnabled=a.target.checked,this.saveGame()})),o&&(o.checked=this.musicEnabled,this.addEventListener(o,"change",a=>{this.musicEnabled=a.target.checked,this.saveGame()}))}addEventListener(t,e,s){t&&(t.addEventListener(e,s),this.eventListeners.push({element:t,event:e,handler:s}))}initTabs(){const t=document.querySelectorAll(".shop-tab"),e=document.querySelectorAll(".shop-tab-content");t.forEach(i=>{this.addEventListener(i,"click",()=>{const o=i.dataset.tab;t.forEach(c=>c.classList.remove("active")),i.classList.add("active"),e.forEach(c=>c.classList.remove("active"));const a=document.getElementById(`${o}-tab`);a&&a.classList.add("active")})}),document.querySelectorAll(".donate-btn").forEach(i=>{this.addEventListener(i,"click",o=>{const a=parseInt(o.target.dataset.amount);isNaN(a)||this.buyDonation(a)})})}clickPlanet(t){this.clickDebounce||(this.clickDebounce=!0,setTimeout(()=>this.clickDebounce=!1,50),this.money+=this.clickValue,this.updateDisplay(),this.saveGame(),this.playSound("click"),this.showClickEffect(t),this.showMoneyPopup(t,this.clickValue))}showClickEffect(t){const e=document.createElement("div");e.className="click-effect",e.style.cssText=`
            position: absolute;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.7);
            pointer-events: none;
            transform: translate(-50%, -50%);
            animation: click-ripple 0.6s linear;
        `;const s=this.planetEarth.getBoundingClientRect(),i=t.clientX-s.left,o=t.clientY-s.top;e.style.left=i+"px",e.style.top=o+"px",this.planetEarth.appendChild(e),setTimeout(()=>e.remove(),600)}showMoneyPopup(t,e){const s=document.createElement("div");s.className="money-popup",s.textContent=`+${this.formatNumber(e)}`,s.style.cssText=`
            position: absolute;
            color: #4CAF50;
            font-weight: bold;
            font-size: 18px;
            pointer-events: none;
            animation: floatUp 1s ease-out forwards;
        `;const i=this.planetEarth.getBoundingClientRect(),o=t.clientX-i.left,a=t.clientY-i.top;s.style.left=o+"px",s.style.top=a+"px",this.planetEarth.appendChild(s),setTimeout(()=>s.remove(),1e3)}watchAd(){const t=document.getElementById("watch-ad-btn");if(!t)return;if(!this.adHandler){this.showNotification("Реклама недоступна","error");return}t.disabled=!0,t.textContent="Загрузка...";const e=`boost-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;(this.adPreloaded&&this.currentPreloadId?this.adHandler({ymid:this.currentPreloadId}):this.adHandler({ymid:e})).then(()=>{console.log("Ad watched successfully"),this.applyAdBoost(),this.showNotification("Буст x2 активирован на 30 секунд!","success"),this.adPreloaded=!1,this.currentPreloadId=null,this.preloadAd(),t.disabled=!1,t.textContent="Смотреть рекламу (x2 буст)"}).catch(i=>{console.log("Ad failed or was skipped:",i),this.showNotification("Реклама была пропущена","warning"),t.disabled=!1,t.textContent="Смотреть рекламу (x2 буст)",this.preloadAd()})}applyAdBoost(){this.adBoostTimeout&&(clearTimeout(this.adBoostTimeout),this.adBoostTimeout=null),this.isAdBoostActive=!0,this.updateBoostState(),this.playSound("boost"),this.showBoostTimer(),this.adBoostTimeout=setTimeout(()=>{this.isAdBoostActive=!1,this.updateBoostState(),this.showNotification("Буст закончился","info"),this.adBoostTimeout=null},this.boostDuration),this.timeouts.push(this.adBoostTimeout)}updateBoostState(){this.autoClickValue=this.isAdBoostActive?this.baseAutoClickValue*this.boostMultiplier:this.baseAutoClickValue,this.updateDisplay(),this.saveGame()}showBoostTimer(){const t=document.getElementById("boost-timer");t&&t.remove();const e=document.createElement("div");e.id="boost-timer",e.style.cssText=`
            position: fixed;
            top: 70px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            z-index: 1000;
            animation: pulse 1s infinite;
        `,document.body.appendChild(e);let s=30;const i=()=>{s>0?(e.textContent=`Буст x2: ${s}с`,s--,setTimeout(i,1e3)):e.remove()};i()}showNotification(t,e="info"){const s=document.createElement("div");s.className=`notification ${e}`,s.textContent=t;const i={success:"#4CAF50",error:"#f44336",warning:"#ff9800",info:"#2196F3"};s.style.cssText=`
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${i[e]};
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: bold;
            animation: slideDown 0.3s ease-out;
        `,document.body.appendChild(s),setTimeout(()=>{s.style.animation="slideUp 0.3s ease-out",setTimeout(()=>s.remove(),300)},3e3)}buyUpgrade(t){if(this.clickDebounce)return;this.clickDebounce=!0,setTimeout(()=>this.clickDebounce=!1,200);const e=this.upgradePrices[t];if(t==="click"&&this.money>=e){this.money-=e,this.clickValue+=1,this.upgradePrices.click=Math.floor(e*1.5),this.playSound("upgrade"),this.showNotification("Клик улучшен! +1 за клик","success");const s=document.getElementById("buy-click");s&&(s.textContent=`Улучшить клик (${this.formatNumber(this.upgradePrices.click)})`)}else if(t==="auto"&&this.money>=e){this.money-=e,this.baseAutoClickValue+=1,this.updateBoostState(),this.upgradePrices.auto=Math.floor(e*1.5),this.playSound("upgrade"),this.showNotification("Автоклик улучшен! +1/сек","success");const s=document.getElementById("buy-auto");s&&(s.textContent=`Улучшить автоклик (${this.formatNumber(this.upgradePrices.auto)})`)}else this.showNotification("Недостаточно денег!","error");this.updateDisplay(),this.saveGame()}buyPlanetFromMap(t,e){if(this.money>=e&&!this.unlockedPlanets.includes(t)){this.money-=e,this.unlockedPlanets.push(t);const s=document.querySelector(`.map-item[data-planet="${t}"]`);if(s){s.classList.remove("locked");const i=s.querySelector(".map-status");i&&(i.textContent="Доступна",i.classList.remove("locked"),i.classList.add("active"))}this.changePlanet(t),this.playSound("purchase"),this.showNotification(`Планета ${t} разблокирована!`,"success"),this.updateDisplay(),this.saveGame()}else this.unlockedPlanets.includes(t)?this.changePlanet(t):this.showNotification(`Недостаточно денег! Нужно ${this.formatNumber(e)}`,"error")}changePlanet(t){if(!this.unlockedPlanets.includes(t))return;this.currentPlanet=t;const e=this.planetEarth.querySelector(".planet-surface");e&&(e.style.backgroundImage=`url('/public/Planets/Sun System/${this.capitalizeFirstLetter(t)}.png')`);const s=this.planetEarth.querySelector(".planet-glow");if(s){const i={earth:"radial-gradient(circle, rgba(74, 144, 226, 0.3) 0%, transparent 70%)",mars:"radial-gradient(circle, rgba(255, 100, 100, 0.3) 0%, transparent 70%)",jupiter:"radial-gradient(circle, rgba(255, 150, 50, 0.3) 0%, transparent 70%)",saturn:"radial-gradient(circle, rgba(255, 200, 100, 0.3) 0%, transparent 70%)",uranus:"radial-gradient(circle, rgba(100, 200, 255, 0.3) 0%, transparent 70%)",neptune:"radial-gradient(circle, rgba(50, 100, 255, 0.3) 0%, transparent 70%)",sun:"radial-gradient(circle, rgba(255, 200, 0, 0.5) 0%, transparent 70%)"};s.style.background=i[t]||i.earth}this.saveGame()}buyDonation(t){this.money>=t?(this.money-=t,this.playSound("purchase"),this.showDonationEffect(),this.showNotification(`Спасибо за донат ${this.formatNumber(t)}!`,"success"),this.updateDisplay(),this.saveGame()):this.showNotification("Недостаточно денег для доната!","error")}showDonationEffect(){for(let e=0;e<20;e++)setTimeout(()=>{const s=document.createElement("div");s.innerHTML="⭐",s.style.cssText=`
                    position: fixed;
                    font-size: ${Math.random()*20+10}px;
                    left: ${Math.random()*100}%;
                    top: ${Math.random()*100}%;
                    animation: starFall 2s ease-out forwards;
                    pointer-events: none;
                    z-index: 9999;
                `,document.body.appendChild(s),setTimeout(()=>s.remove(),2e3)},e*50)}startAutoClicker(){const t=setInterval(()=>{if(this.autoClickValue>0){const e=this.money;this.money+=this.autoClickValue,e!==this.money&&(this.updateDisplay(),Math.floor(Date.now()/1e4)%1===0&&this.saveGame())}},1e3);this.intervals.push(t)}startAutoSave(){const t=setInterval(()=>{this.saveGame()},3e4);this.intervals.push(t)}openSettings(){this.showPanel("settings-panel")}openMap(){this.showPanel("map-panel"),this.updateMapDisplay()}openShop(){this.showPanel("shop-panel"),this.updateShopDisplay()}openFriends(){this.showPanel("friends-panel")}showPanel(t){const e=document.getElementById(t);if(!e)return;this.overlay.classList.add("active"),e.classList.add("panel-visible");const s=()=>this.hideAllPanels();this.overlay.onclick=s;const i=e.querySelector(".close-btn");i&&(i.onclick=s)}hideAllPanels(){this.overlay.classList.remove("active"),document.querySelectorAll(".settings-panel, .map-panel, .shop-panel, .friends-panel").forEach(e=>e.classList.remove("panel-visible")),this.overlay.onclick=null}updateMapDisplay(){document.querySelectorAll(".map-item").forEach(e=>{const s=e.dataset.planet,i=parseInt(e.dataset.price);if(this.unlockedPlanets.includes(s)){e.classList.remove("locked");const o=e.querySelector(".map-status");o&&(o.textContent=s===this.currentPlanet?"Активна":"Доступна",o.classList.remove("locked"),o.classList.add("active"))}else e.onclick=()=>this.buyPlanetFromMap(s,i)})}updateShopDisplay(){const t=document.getElementById("buy-click"),e=document.getElementById("buy-auto");t&&(t.textContent=`Улучшить клик (${this.formatNumber(this.upgradePrices.click)})`),e&&(e.textContent=`Улучшить автоклик (${this.formatNumber(this.upgradePrices.auto)})`)}updateDisplay(){if(this.moneyDisplay&&(this.moneyDisplay.textContent=this.formatNumber(Math.floor(this.money))),this.incomeDisplay){const t=this.formatNumber(this.autoClickValue);this.isAdBoostActive?this.incomeDisplay.innerHTML=`<span style="color: #4CAF50; font-weight: bold;">${t} (x2)</span>`:this.incomeDisplay.textContent=t}}formatNumber(t){return isNaN(t)||t===null||t===void 0?"0":(t=Math.floor(t),t<0?"-"+this.formatNumber(Math.abs(t)):t>=1e12?(t/1e12).toFixed(2)+"T":t>=1e9?(t/1e9).toFixed(2)+"B":t>=1e6?(t/1e6).toFixed(2)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toString())}capitalizeFirstLetter(t){return t.charAt(0).toUpperCase()+t.slice(1)}playSound(t){if(!(!this.soundEnabled||!this.sounds[t]))try{const e=this.sounds[t];e.currentTime=0,e.play().catch(()=>{})}catch(e){console.log("Sound play error:",e)}}saveGame(){const t={money:this.money,clickValue:this.clickValue,baseAutoClickValue:this.baseAutoClickValue,currentPlanet:this.currentPlanet,unlockedPlanets:this.unlockedPlanets,upgradePrices:this.upgradePrices,soundEnabled:this.soundEnabled,musicEnabled:this.musicEnabled,timestamp:Date.now()};try{localStorage.setItem("planetClickerSave",JSON.stringify(t))}catch(e){console.error("Failed to save game:",e)}}loadGame(){try{const t=localStorage.getItem("planetClickerSave");if(!t)return;const e=JSON.parse(t);if(this.money=e.money||0,this.clickValue=e.clickValue||1,this.baseAutoClickValue=e.baseAutoClickValue||0,this.currentPlanet=e.currentPlanet||"earth",this.unlockedPlanets=e.unlockedPlanets||["earth"],this.upgradePrices=e.upgradePrices||{click:10,auto:50},this.soundEnabled=e.soundEnabled!==void 0?e.soundEnabled:!0,this.musicEnabled=e.musicEnabled!==void 0?e.musicEnabled:!0,e.timestamp&&this.baseAutoClickValue>0){const s=Date.now(),i=Math.min((s-e.timestamp)/1e3,3600),o=Math.floor(this.baseAutoClickValue*i*.5);o>0&&(this.money+=o,setTimeout(()=>{this.showNotification(`Офлайн доход: +${this.formatNumber(o)}`,"info")},1e3))}this.updateBoostState(),console.log("Game loaded successfully")}catch(t){console.error("Failed to load game:",t)}}resetGame(){confirm("Вы уверены, что хотите сбросить весь прогресс?")&&(localStorage.removeItem("planetClickerSave"),location.reload())}destroy(){this.intervals.forEach(t=>clearInterval(t)),this.timeouts.forEach(t=>clearTimeout(t)),this.eventListeners.forEach(({element:t,event:e,handler:s})=>{t.removeEventListener(e,s)}),this.saveGame()}}const u=document.createElement("style");u.textContent=`
    @keyframes click-ripple {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 50px;
            height: 50px;
            opacity: 0;
        }
    }
    
    @keyframes floatUp {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px);
            opacity: 0;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    @keyframes starFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;document.head.appendChild(u);let n=null;document.addEventListener("DOMContentLoaded",()=>{n=new d,window.addEventListener("beforeunload",()=>{n&&n.saveGame()}),window.addEventListener("unload",()=>{n&&n.destroy()})});typeof r<"u"&&r.exports&&(r.exports=d)});export default p();
