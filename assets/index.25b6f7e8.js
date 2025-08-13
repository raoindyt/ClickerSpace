var m=(c,t)=>()=>(t||c((t={exports:{}}).exports,t),t.exports);var p=m((y,l)=>{(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();class d{constructor(){this.money=0,this.clickValue=1,this.baseAutoClickValue=0,this.autoClickValue=0,this.currentPlanet="earth",this.isAdBoostActive=!1,this.adBoostTimeout=null,this.boostDuration=3e4,this.boostMultiplier=2,this.soundEnabled=!0,this.musicEnabled=!0,this.intervals=[],this.timeouts=[],this.eventListeners=[],this.clickDebounce=!1,this.unlockedPlanets=["earth"],this.planetPrices={mars:1e3,jupiter:5e3,saturn:1e4,uranus:25e3,neptune:5e4,sun:1e5},this.upgradePrices={click:10,auto:50},this.adState={handler:null,isReady:!1,isLoading:!1,lastAttempt:0,cooldownTime:5e3,retryCount:0,maxRetries:3},this.init()}init(){this.loadGame(),this.initAudio(),this.initElements(),this.bindEvents(),this.initTabs(),this.startAutoClicker(),this.startAutoSave(),this.updateDisplay(),setTimeout(()=>this.initAdvertising(),1e3)}initAdvertising(){console.log("Initializing advertising system..."),this.detectAdSDK(),this.createFreeBoostButton(),this.updateAdUI()}detectAdSDK(){const t=[window.show_9701900,window.showAd,window.monetagAds,window.adHandler,window.MonetagAds];for(const e of t)if(e&&typeof e=="function"){this.adState.handler=e,this.adState.isReady=!0,console.log("Ad SDK detected successfully");return}if(typeof show_9701900<"u"&&typeof show_9701900=="function"){this.adState.handler=show_9701900,this.adState.isReady=!0,console.log("Ad SDK detected via global function");return}console.warn("Ad SDK not detected. Ad features will be limited."),this.adState.isReady=!1}createFreeBoostButton(){if(!document.getElementById("shop-panel"))return;const e=document.getElementById("boosts-tab");if(!e||document.getElementById("free-boost-btn"))return;const s=document.createElement("button");s.id="free-boost-btn",s.className="shop-button free-boost",s.innerHTML=`
            <span class="button-icon">🎁</span>
            <span class="button-text">Бесплатный буст x1.5 (15 сек)</span>
            <span class="button-timer"></span>
        `,e.appendChild(s),this.addEventListener(s,"click",()=>this.useFreeBoost()),this.updateFreeBoostTimer()}updateAdUI(){const t=document.getElementById("watch-ad-btn"),e=document.getElementById("free-boost-btn");this.adState.isReady?(t&&(t.style.display="block"),e&&(e.style.display="block")):(t&&(t.style.display="none"),e&&(e.style.display="block"))}watchAd(){const t=document.getElementById("watch-ad-btn");if(!t)return;const e=Date.now();if(this.adState.lastAttempt&&e-this.adState.lastAttempt<this.adState.cooldownTime){const i=Math.ceil((this.adState.cooldownTime-(e-this.adState.lastAttempt))/1e3);this.showNotification(`Подождите ${i} секунд`,"warning");return}if(!this.adState.isReady||!this.adState.handler){this.showNotification("Реклама недоступна. Используйте бесплатный буст!","info"),this.detectAdSDK();return}if(this.adState.isLoading){this.showNotification("Реклама уже загружается...","info");return}this.adState.isLoading=!0,this.adState.lastAttempt=e,t.disabled=!0,t.textContent="Загрузка рекламы...",new Promise((i,o)=>{const a=setTimeout(()=>{o(new Error("Ad timeout"))},15e3);try{const n=this.adState.handler();Promise.resolve(n).then(()=>{clearTimeout(a),i()}).catch(h=>{clearTimeout(a),o(h)})}catch(n){clearTimeout(a),o(n)}}).then(()=>{console.log("Ad shown successfully"),this.onAdSuccess(t)}).catch(i=>{console.error("Ad error:",i),this.onAdError(i,t)}).finally(()=>{this.adState.isLoading=!1})}onAdSuccess(t){this.applyAdBoost(),this.adState.retryCount=0,t&&(t.disabled=!1,t.textContent="Смотреть рекламу (x2 буст)"),this.showNotification("Буст x2 активирован на 30 секунд!","success"),this.playSound("boost")}onAdError(t,e){this.adState.retryCount++;let s="Не удалось загрузить рекламу",i=!1;t.message&&(t.message.includes("Network")||t.message.includes("network")?(s="Проблема с сетью. Проверьте интернет-соединение",i=!0):t.message.includes("timeout")?(s="Время загрузки истекло",i=!0):(t.message.includes("block")||t.message.includes("Block"))&&(s="Реклама заблокирована. Отключите AdBlock")),this.showNotification(s,"error"),e&&(e.disabled=!1,e.textContent="Смотреть рекламу (x2 буст)"),this.adState.retryCount>=this.adState.maxRetries&&(this.adState.cooldownTime=3e4,this.showNotification("Слишком много ошибок. Попробуйте позже","warning"),setTimeout(()=>{this.adState.retryCount=0,this.adState.cooldownTime=5e3,this.detectAdSDK()},6e4)),i&&setTimeout(()=>{this.showNotification("Попробуйте бесплатный буст!","info")},2e3)}useFreeBoost(){const t=localStorage.getItem("lastFreeBoost"),e=Date.now(),s=18e5;if(t&&e-parseInt(t)<s){const i=Math.ceil((s-(e-parseInt(t)))/6e4);this.showNotification(`Бесплатный буст будет доступен через ${i} мин`,"info");return}localStorage.setItem("lastFreeBoost",e.toString()),this.applyFreeBoost(),this.updateFreeBoostTimer()}applyFreeBoost(){this.adBoostTimeout&&(clearTimeout(this.adBoostTimeout),this.adBoostTimeout=null);const t=1.5,e=15e3;this.isAdBoostActive=!0;const s=this.boostMultiplier,i=this.boostDuration;this.boostMultiplier=t,this.boostDuration=e,this.updateBoostState(),this.playSound("boost"),this.showBoostTimer(15,"x1.5"),this.showNotification("Бесплатный буст x1.5 активирован на 15 секунд!","success"),this.adBoostTimeout=setTimeout(()=>{this.isAdBoostActive=!1,this.boostMultiplier=s,this.boostDuration=i,this.updateBoostState(),this.showNotification("Буст закончился","info"),this.adBoostTimeout=null},e),this.timeouts.push(this.adBoostTimeout)}applyAdBoost(){this.adBoostTimeout&&(clearTimeout(this.adBoostTimeout),this.adBoostTimeout=null),this.isAdBoostActive=!0,this.updateBoostState(),this.showBoostTimer(30,"x2"),this.adBoostTimeout=setTimeout(()=>{this.isAdBoostActive=!1,this.updateBoostState(),this.showNotification("Буст закончился","info"),this.adBoostTimeout=null},this.boostDuration),this.timeouts.push(this.adBoostTimeout)}updateFreeBoostTimer(){const t=document.getElementById("free-boost-btn");if(!t)return;const e=t.querySelector(".button-timer");if(!e)return;const s=localStorage.getItem("lastFreeBoost");if(!s){e.textContent="Доступно",t.disabled=!1;return}const a=18e5-(Date.now()-parseInt(s));if(a<=0)e.textContent="Доступно",t.disabled=!1;else{const n=Math.ceil(a/6e4);e.textContent=`(${n} мин)`,t.disabled=!0,setTimeout(()=>this.updateFreeBoostTimer(),3e4)}}showBoostTimer(t=30,e="x2"){const s=document.getElementById("boost-timer");s&&s.remove();const i=document.createElement("div");i.id="boost-timer",i.className="boost-timer-display",i.style.cssText=`
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
            font-size: 14px;
        `,document.body.appendChild(i);let o=t;const a=()=>{o>0?(i.textContent=`Буст ${e}: ${o}с`,o--,setTimeout(a,1e3)):(i.style.animation="fadeOut 0.5s ease-out",setTimeout(()=>i.remove(),500))};a()}initAudio(){this.sounds={click:null,purchase:null,upgrade:null,boost:null};try{const t={click:"data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+0Oy9diMFl2+z5yUCnQAAS5oAAABjAA",purchase:"data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+0Oy9diMFl2+z5yUCnQAAS5oAAABjAA",upgrade:"data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+0Oy9diMFl2+z5yUCnQAAS5oAAABjAA",boost:"data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+0Oy9diMFl2+z5yUCnQAAS5oAAABjAA"};for(const[e,s]of Object.entries(t)){const i=new Audio(s);i.volume=.3,this.sounds[e]=i}}catch(t){console.log("Audio initialization failed:",t)}}initElements(){this.moneyDisplay=document.getElementById("money-amount"),this.incomeDisplay=document.getElementById("income-amount"),this.planetEarth=document.getElementById("planet-earth"),this.settingsBtn=document.getElementById("settings-btn"),this.mapBtn=document.getElementById("map-btn"),this.shopBtn=document.getElementById("shop-btn"),this.friendsBtn=document.getElementById("friends-btn"),this.overlay=document.getElementById("overlay")}bindEvents(){this.addEventListener(this.planetEarth,"click",a=>this.clickPlanet(a)),this.addEventListener(this.settingsBtn,"click",()=>this.openSettings()),this.addEventListener(this.mapBtn,"click",()=>this.openMap()),this.addEventListener(this.shopBtn,"click",()=>this.openShop()),this.addEventListener(this.friendsBtn,"click",()=>this.openFriends());const t=document.getElementById("buy-click"),e=document.getElementById("buy-auto");t&&this.addEventListener(t,"click",()=>this.buyUpgrade("click")),e&&this.addEventListener(e,"click",()=>this.buyUpgrade("auto"));const s=document.getElementById("watch-ad-btn");s&&this.addEventListener(s,"click",()=>this.watchAd());const i=document.getElementById("sound-toggle"),o=document.getElementById("music-toggle");i&&(i.checked=this.soundEnabled,this.addEventListener(i,"change",a=>{this.soundEnabled=a.target.checked,this.saveGame()})),o&&(o.checked=this.musicEnabled,this.addEventListener(o,"change",a=>{this.musicEnabled=a.target.checked,this.saveGame()}))}addEventListener(t,e,s){t&&(t.addEventListener(e,s),this.eventListeners.push({element:t,event:e,handler:s}))}initTabs(){const t=document.querySelectorAll(".shop-tab"),e=document.querySelectorAll(".shop-tab-content");t.forEach(i=>{this.addEventListener(i,"click",()=>{const o=i.dataset.tab;t.forEach(n=>n.classList.remove("active")),i.classList.add("active"),e.forEach(n=>n.classList.remove("active"));const a=document.getElementById(`${o}-tab`);a&&a.classList.add("active")})}),document.querySelectorAll(".donate-btn").forEach(i=>{this.addEventListener(i,"click",o=>{const a=parseInt(o.target.dataset.amount);isNaN(a)||this.buyDonation(a)})})}clickPlanet(t){this.clickDebounce||(this.clickDebounce=!0,setTimeout(()=>this.clickDebounce=!1,50),this.money+=this.clickValue,this.updateDisplay(),this.saveGame(),this.playSound("click"),this.showClickEffect(t),this.showMoneyPopup(t,this.clickValue))}showClickEffect(t){const e=document.createElement("div");e.className="click-effect",e.style.cssText=`
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
            z-index: 10;
        `;const i=this.planetEarth.getBoundingClientRect(),o=t.clientX-i.left,a=t.clientY-i.top;s.style.left=o+"px",s.style.top=a+"px",this.planetEarth.appendChild(s),setTimeout(()=>s.remove(),1e3)}buyUpgrade(t){if(this.clickDebounce)return;this.clickDebounce=!0,setTimeout(()=>this.clickDebounce=!1,200);const e=this.upgradePrices[t];if(t==="click"&&this.money>=e){this.money-=e,this.clickValue+=1,this.upgradePrices.click=Math.floor(e*1.5),this.playSound("upgrade"),this.showNotification("Клик улучшен! +1 за клик","success");const s=document.getElementById("buy-click");s&&(s.textContent=`Улучшить клик (${this.formatNumber(this.upgradePrices.click)})`)}else if(t==="auto"&&this.money>=e){this.money-=e,this.baseAutoClickValue+=1,this.updateBoostState(),this.upgradePrices.auto=Math.floor(e*1.5),this.playSound("upgrade"),this.showNotification("Автоклик улучшен! +1/сек","success");const s=document.getElementById("buy-auto");s&&(s.textContent=`Улучшить автоклик (${this.formatNumber(this.upgradePrices.auto)})`)}else this.showNotification("Недостаточно денег!","error");this.updateDisplay(),this.saveGame()}updateBoostState(){this.autoClickValue=this.isAdBoostActive?this.baseAutoClickValue*this.boostMultiplier:this.baseAutoClickValue,this.updateDisplay(),this.saveGame()}buyPlanetFromMap(t,e){if(this.money>=e&&!this.unlockedPlanets.includes(t)){this.money-=e,this.unlockedPlanets.push(t);const s=document.querySelector(`.map-item[data-planet="${t}"]`);if(s){s.classList.remove("locked");const i=s.querySelector(".map-status");i&&(i.textContent="Доступна",i.classList.remove("locked"),i.classList.add("active"))}this.changePlanet(t),this.playSound("purchase"),this.showNotification(`Планета ${t} разблокирована!`,"success"),this.updateDisplay(),this.saveGame()}else this.unlockedPlanets.includes(t)?this.changePlanet(t):this.showNotification(`Недостаточно денег! Нужно ${this.formatNumber(e)}`,"error")}changePlanet(t){if(!this.unlockedPlanets.includes(t))return;this.currentPlanet=t;const e=this.planetEarth.querySelector(".planet-surface");e&&(e.style.backgroundImage=`url('/public/Planets/Sun System/${this.capitalizeFirstLetter(t)}.png')`);const s=this.planetEarth.querySelector(".planet-glow");if(s){const i={earth:"radial-gradient(circle, rgba(74, 144, 226, 0.3) 0%, transparent 70%)",mars:"radial-gradient(circle, rgba(255, 100, 100, 0.3) 0%, transparent 70%)",jupiter:"radial-gradient(circle, rgba(255, 150, 50, 0.3) 0%, transparent 70%)",saturn:"radial-gradient(circle, rgba(255, 200, 100, 0.3) 0%, transparent 70%)",uranus:"radial-gradient(circle, rgba(100, 200, 255, 0.3) 0%, transparent 70%)",neptune:"radial-gradient(circle, rgba(50, 100, 255, 0.3) 0%, transparent 70%)",sun:"radial-gradient(circle, rgba(255, 200, 0, 0.5) 0%, transparent 70%)"};s.style.background=i[t]||i.earth}this.saveGame()}buyDonation(t){this.money>=t?(this.money-=t,this.playSound("purchase"),this.showDonationEffect(),this.showNotification(`Спасибо за донат ${this.formatNumber(t)}!`,"success"),this.updateDisplay(),this.saveGame()):this.showNotification("Недостаточно денег для доната!","error")}showDonationEffect(){for(let e=0;e<20;e++)setTimeout(()=>{const s=document.createElement("div");s.innerHTML="⭐",s.style.cssText=`
                    position: fixed;
                    font-size: ${Math.random()*20+10}px;
                    left: ${Math.random()*100}%;
                    top: ${Math.random()*100}%;
                    animation: starFall 2s ease-out forwards;
                    pointer-events: none;
                    z-index: 9999;
                `,document.body.appendChild(s),setTimeout(()=>s.remove(),2e3)},e*50)}startAutoClicker(){const t=setInterval(()=>{if(this.autoClickValue>0){const e=this.money;this.money+=this.autoClickValue,e!==this.money&&(this.updateDisplay(),Math.floor(Date.now()/1e4)%1===0&&this.saveGame())}},1e3);this.intervals.push(t)}startAutoSave(){const t=setInterval(()=>{this.saveGame()},3e4);this.intervals.push(t)}openSettings(){this.showPanel("settings-panel")}openMap(){this.showPanel("map-panel"),this.updateMapDisplay()}openShop(){this.showPanel("shop-panel"),this.updateShopDisplay()}openFriends(){this.showPanel("friends-panel")}showPanel(t){const e=document.getElementById(t);if(!e)return;this.overlay.classList.add("active"),e.classList.add("panel-visible");const s=()=>this.hideAllPanels();this.overlay.onclick=s;const i=e.querySelector(".close-btn");i&&(i.onclick=s)}hideAllPanels(){this.overlay.classList.remove("active"),document.querySelectorAll(".settings-panel, .map-panel, .shop-panel, .friends-panel").forEach(e=>e.classList.remove("panel-visible")),this.overlay.onclick=null}updateMapDisplay(){document.querySelectorAll(".map-item").forEach(e=>{const s=e.dataset.planet,i=parseInt(e.dataset.price);if(this.unlockedPlanets.includes(s)){e.classList.remove("locked");const o=e.querySelector(".map-status");o&&(o.textContent=s===this.currentPlanet?"Активна":"Доступна",o.classList.remove("locked"),o.classList.add("active"))}else e.onclick=()=>this.buyPlanetFromMap(s,i)})}updateShopDisplay(){const t=document.getElementById("buy-click"),e=document.getElementById("buy-auto");t&&(t.textContent=`Улучшить клик (${this.formatNumber(this.upgradePrices.click)})`),e&&(e.textContent=`Улучшить автоклик (${this.formatNumber(this.upgradePrices.auto)})`),this.updateFreeBoostTimer()}updateDisplay(){if(this.moneyDisplay&&(this.moneyDisplay.textContent=this.formatNumber(Math.floor(this.money))),this.incomeDisplay){const t=this.formatNumber(this.autoClickValue);this.isAdBoostActive?this.incomeDisplay.innerHTML=`<span style="color: #4CAF50; font-weight: bold;">${t} (x${this.boostMultiplier})</span>`:this.incomeDisplay.textContent=t}}formatNumber(t){return isNaN(t)||t===null||t===void 0?"0":(t=Math.floor(t),t<0?"-"+this.formatNumber(Math.abs(t)):t>=1e12?(t/1e12).toFixed(2)+"T":t>=1e9?(t/1e9).toFixed(2)+"B":t>=1e6?(t/1e6).toFixed(2)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toString())}capitalizeFirstLetter(t){return t.charAt(0).toUpperCase()+t.slice(1)}playSound(t){if(!(!this.soundEnabled||!this.sounds[t]))try{const e=this.sounds[t];e.currentTime=0,e.play().catch(()=>{})}catch(e){console.log("Sound play error:",e)}}showNotification(t,e="info"){const s=document.createElement("div");s.className=`notification ${e}`,s.textContent=t;const i={success:"#4CAF50",error:"#f44336",warning:"#ff9800",info:"#2196F3"};s.style.cssText=`
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
        `,document.body.appendChild(s),setTimeout(()=>{s.style.animation="slideUp 0.3s ease-out",setTimeout(()=>s.remove(),300)},3e3)}saveGame(){const t={money:this.money,clickValue:this.clickValue,baseAutoClickValue:this.baseAutoClickValue,currentPlanet:this.currentPlanet,unlockedPlanets:this.unlockedPlanets,upgradePrices:this.upgradePrices,soundEnabled:this.soundEnabled,musicEnabled:this.musicEnabled,timestamp:Date.now()};try{localStorage.setItem("planetClickerSave",JSON.stringify(t))}catch(e){console.error("Failed to save game:",e)}}loadGame(){try{const t=localStorage.getItem("planetClickerSave");if(!t)return;const e=JSON.parse(t);if(this.money=e.money||0,this.clickValue=e.clickValue||1,this.baseAutoClickValue=e.baseAutoClickValue||0,this.currentPlanet=e.currentPlanet||"earth",this.unlockedPlanets=e.unlockedPlanets||["earth"],this.upgradePrices=e.upgradePrices||{click:10,auto:50},this.soundEnabled=e.soundEnabled!==void 0?e.soundEnabled:!0,this.musicEnabled=e.musicEnabled!==void 0?e.musicEnabled:!0,e.timestamp&&this.baseAutoClickValue>0){const s=Date.now(),i=Math.min((s-e.timestamp)/1e3,3600),o=Math.floor(this.baseAutoClickValue*i*.5);o>0&&(this.money+=o,setTimeout(()=>{this.showNotification(`Офлайн доход: +${this.formatNumber(o)}`,"info")},1e3))}this.updateBoostState(),console.log("Game loaded successfully")}catch(t){console.error("Failed to load game:",t)}}resetGame(){confirm("Вы уверены, что хотите сбросить весь прогресс?")&&(localStorage.removeItem("planetClickerSave"),localStorage.removeItem("lastFreeBoost"),location.reload())}destroy(){this.intervals.forEach(t=>clearInterval(t)),this.timeouts.forEach(t=>clearTimeout(t)),this.eventListeners.forEach(({element:t,event:e,handler:s})=>{t.removeEventListener(e,s)}),this.saveGame()}}const u=document.createElement("style");u.textContent=`
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
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    .free-boost {
        background: linear-gradient(135deg, #9c27b0, #7b1fa2);
        margin-top: 10px;
    }
    
    .free-boost:hover:not(:disabled) {
        background: linear-gradient(135deg, #ab47bc, #8e24aa);
    }
    
    .free-boost:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .button-timer {
        display: block;
        font-size: 12px;
        margin-top: 5px;
        opacity: 0.8;
    }
`;document.head.appendChild(u);let r=null;document.addEventListener("DOMContentLoaded",()=>{r=new d,window.addEventListener("beforeunload",()=>{r&&r.saveGame()}),window.addEventListener("unload",()=>{r&&r.destroy()})});typeof l<"u"&&l.exports&&(l.exports=d)});export default p();
