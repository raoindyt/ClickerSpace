var f=(r,t)=>()=>(t||r((t={exports:{}}).exports,t),t.exports);var A=f((w,c)=>{(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();class g{constructor(){var t;this.tg=(t=window.Telegram)==null?void 0:t.WebApp,this.isInitialized=!1,this.user=null,this.init()}init(){var t;this.tg?(this.tg.ready(),this.tg.expand(),this.user=(t=this.tg.initDataUnsafe)==null?void 0:t.user,this.isInitialized=!0,console.log("Telegram SDK initialized",this.user)):(console.warn("Telegram WebApp not available"),this.user={id:123456789,first_name:"Test",last_name:"User",username:"testuser",photo_url:null})}getUser(){return this.user}getUserName(){return this.user?this.user.username?"@"+this.user.username:this.user.first_name+(this.user.last_name?" "+this.user.last_name:""):"Гость"}getUserPhoto(){var t;return((t=this.user)==null?void 0:t.photo_url)||null}getUserId(){var t;return((t=this.user)==null?void 0:t.id)||null}getReferralCode(){const t=new URLSearchParams(window.location.search);return t.get("ref")||t.get("start")}createReferralLink(t){return`https://t.me/your_bot_username?start=${t}`}sendData(t){this.tg&&this.tg.sendData(JSON.stringify(t))}showMainButton(t,e){this.tg&&(this.tg.MainButton.text=t,this.tg.MainButton.show(),this.tg.MainButton.onClick(e))}hideMainButton(){this.tg&&this.tg.MainButton.hide()}showAlert(t){this.tg?this.tg.showAlert(t):alert(t)}showConfirm(t,e){if(this.tg)this.tg.showConfirm(t,e);else{const s=confirm(t);e(s)}}hapticFeedback(t="impact",e="medium"){var s;(s=this.tg)!=null&&s.HapticFeedback&&(t==="impact"?this.tg.HapticFeedback.impactOccurred(e):t==="notification"?this.tg.HapticFeedback.notificationOccurred(e):t==="selection"&&this.tg.HapticFeedback.selectionChanged())}close(){this.tg&&this.tg.close()}}class y{constructor(t){this.tg=t,this.referrals=[],this.referralEarnings=0,this.referralPercentage=.02,this.init()}init(){this.loadReferralData(),this.checkReferralCode()}checkReferralCode(){const t=this.tg.getReferralCode(),e=this.tg.getUserId();t&&e&&t!==e.toString()&&this.registerReferral(t,e)}registerReferral(t,e){if(this.getReferralData(e))return console.log("User already has a referrer"),!1;const i={referrerId:t,referredUserId:e,timestamp:Date.now(),totalEarnings:0};return localStorage.setItem(`referral_${e}`,JSON.stringify(i)),this.showReferralWelcome(t),!0}getReferralData(t){try{const e=localStorage.getItem(`referral_${t}`);return e?JSON.parse(e):null}catch(e){return console.error("Error loading referral data:",e),null}}addReferralEarning(t,e){const s=this.getReferralData(t);if(!s)return 0;const i=Math.floor(e*this.referralPercentage);return s.totalEarnings+=e,localStorage.setItem(`referral_${t}`,JSON.stringify(s)),this.addReferrerBonus(s.referrerId,i),i}addReferrerBonus(t,e){const s=this.tg.getUserId();t===(s==null?void 0:s.toString())&&(this.referralEarnings+=e,this.saveReferralData(),e>0&&this.showReferralBonus(e))}getUserReferrals(){const t=this.tg.getUserId();if(!t)return[];const e=[];for(let s=0;s<localStorage.length;s++){const i=localStorage.key(s);if(i&&i.startsWith("referral_"))try{const o=JSON.parse(localStorage.getItem(i));o.referrerId===t.toString()&&e.push({userId:o.referredUserId,timestamp:o.timestamp,totalEarnings:o.totalEarnings,bonus:Math.floor(o.totalEarnings*this.referralPercentage)})}catch(o){console.error("Error parsing referral data:",o)}}return e.sort((s,i)=>i.timestamp-s.timestamp)}getReferralLink(){const t=this.tg.getUserId();return t?this.tg.createReferralLink(t):null}copyReferralLink(){const t=this.getReferralLink();return t?(navigator.clipboard?navigator.clipboard.writeText(t).then(()=>{this.showNotification("Реферальная ссылка скопирована!","success")}).catch(()=>{this.fallbackCopyTextToClipboard(t)}):this.fallbackCopyTextToClipboard(t),!0):!1}fallbackCopyTextToClipboard(t){const e=document.createElement("textarea");e.value=t,e.style.top="0",e.style.left="0",e.style.position="fixed",document.body.appendChild(e),e.focus(),e.select();try{document.execCommand("copy"),this.showNotification("Реферальная ссылка скопирована!","success")}catch(s){console.error("Fallback: Oops, unable to copy",s),this.showNotification("Не удалось скопировать ссылку","error")}document.body.removeChild(e)}showReferralWelcome(t){this.showNotification(`Добро пожаловать! Вас пригласил пользователь ${t}`,"success")}showReferralBonus(t){this.showNotification(`Реферальный бонус: +${this.formatNumber(t)}`,"success")}getReferralStats(){const t=this.getUserReferrals(),e=t.length,s=t.reduce((o,a)=>o+a.totalEarnings,0),i=t.reduce((o,a)=>o+a.bonus,0);return{totalReferrals:e,totalEarnings:s,totalBonus:i,referralEarnings:this.referralEarnings}}saveReferralData(){const t={referralEarnings:this.referralEarnings,timestamp:Date.now()};localStorage.setItem("referralSystemData",JSON.stringify(t))}loadReferralData(){try{const t=localStorage.getItem("referralSystemData");if(t){const e=JSON.parse(t);this.referralEarnings=e.referralEarnings||0}}catch(t){console.error("Error loading referral system data:",t)}}formatNumber(t){return isNaN(t)||t===null||t===void 0?"0":(t=Math.floor(t),t<0?"-"+this.formatNumber(Math.abs(t)):t>=1e12?(t/1e12).toFixed(2)+"T":t>=1e9?(t/1e9).toFixed(2)+"B":t>=1e6?(t/1e6).toFixed(2)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toString())}showNotification(t,e="info"){const s=document.createElement("div");s.className=`notification ${e}`,s.textContent=t;const i={success:"#4CAF50",error:"#f44336",warning:"#ff9800",info:"#2196F3"};s.style.cssText=`
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
        `,document.body.appendChild(s),setTimeout(()=>{s.style.animation="slideUp 0.3s ease-out",setTimeout(()=>s.remove(),300)},3e3)}}class b{constructor(){this.planets=this.initializePlanets(),this.currentPlanet="earth",this.unlockedPlanets=["earth"]}initializePlanets(){return{earth:{name:"Земля",description:"Наш родной дом",price:0,boost:1,image:"/public/Plantes/Sun System/Earth.png",glow:"radial-gradient(circle, rgba(74, 144, 226, 0.3) 0%, transparent 70%)",unlocked:!0},mars:{name:"Марс",description:"Красная планета воинов",price:1e3,boost:1.5,image:"/public/Plantes/Sun System/Mars.png",glow:"radial-gradient(circle, rgba(255, 100, 100, 0.3) 0%, transparent 70%)",unlocked:!1},jupiter:{name:"Юпитер",description:"Газовый гигант богатства",price:5e3,boost:1.5,image:"/public/Plantes/Sun System/Jupiter.png",glow:"radial-gradient(circle, rgba(255, 150, 50, 0.3) 0%, transparent 70%)",unlocked:!1},saturn:{name:"Сатурн",description:"Планета с кольцами",price:1e4,boost:1.5,image:"/public/Plantes/Sun System/Jupiter.png",glow:"radial-gradient(circle, rgba(255, 200, 100, 0.3) 0%, transparent 70%)",unlocked:!1},uranus:{name:"Уран",description:"Ледяной гигант мудрости",price:25e3,boost:1.5,image:"/public/Plantes/Sun System/Jupiter.png",glow:"radial-gradient(circle, rgba(100, 200, 255, 0.3) 0%, transparent 70%)",unlocked:!1},neptune:{name:"Нептун",description:"Далекий страж океанов",price:5e4,boost:1.5,image:"/public/Plantes/Sun System/Jupiter.png",glow:"radial-gradient(circle, rgba(50, 100, 255, 0.3) 0%, transparent 70%)",unlocked:!1},sun:{name:"Солнце",description:"Источник всей энергии",price:1e5,boost:1.5,image:"/public/Plantes/Sun System/sun.png",glow:"radial-gradient(circle, rgba(255, 200, 0, 0.5) 0%, transparent 70%)",unlocked:!1}}}addPlanet(t,e){this.planets[t]={name:e.name,description:e.description,price:e.price,boost:e.boost,image:e.image,glow:e.glow||"radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",unlocked:!1}}getPlanet(t){return this.planets[t]||null}getAllPlanets(){return this.planets}getUnlockedPlanets(){return this.unlockedPlanets}isPlanetUnlocked(t){return this.unlockedPlanets.includes(t)}unlockPlanet(t){return this.planets[t]?this.unlockedPlanets.includes(t)?!1:(this.unlockedPlanets.push(t),this.planets[t].unlocked=!0,!0):(console.error(`Planet ${t} does not exist`),!1)}changePlanet(t){return this.isPlanetUnlocked(t)?(this.currentPlanet=t,this.updatePlanetVisual(t),!0):(console.error(`Planet ${t} is not unlocked`),!1)}updatePlanetVisual(t){const e=this.planets[t];if(!e)return;const s=document.getElementById("planet-earth");if(!s)return;const i=s.querySelector(".planet-surface"),o=s.querySelector(".planet-glow");i&&(i.style.backgroundImage=`url('${e.image}')`),o&&(o.style.background=e.glow)}getCurrentPlanet(){return this.currentPlanet}getCurrentPlanetBoost(){const t=this.planets[this.currentPlanet];return t?t.boost:1}getTotalPlanetBoost(){let t=1;return this.unlockedPlanets.forEach(e=>{const s=this.planets[e];s&&e!=="earth"&&(t+=s.boost-1)}),t}buyPlanet(t,e){const s=this.planets[t];return s?this.isPlanetUnlocked(t)?(this.changePlanet(t),{success:!0,message:`Переключились на планету ${s.name}`,cost:0}):e<s.price?{success:!1,message:`Недостаточно денег! Нужно ${this.formatNumber(s.price)}`}:(this.unlockPlanet(t),this.changePlanet(t),{success:!0,message:`Планета ${s.name} разблокирована!`,cost:s.price}):{success:!1,message:"Планета не найдена"}}getMapData(){return Object.keys(this.planets).map(t=>{const e=this.planets[t];return{id:t,name:e.name,description:e.description,price:e.price,boost:e.boost,image:e.image,unlocked:this.isPlanetUnlocked(t),current:t===this.currentPlanet}})}saveState(){return{currentPlanet:this.currentPlanet,unlockedPlanets:[...this.unlockedPlanets]}}loadState(t){t.currentPlanet&&(this.currentPlanet=t.currentPlanet),t.unlockedPlanets&&(this.unlockedPlanets=[...t.unlockedPlanets],this.unlockedPlanets.forEach(e=>{this.planets[e]&&(this.planets[e].unlocked=!0)})),this.updatePlanetVisual(this.currentPlanet)}formatNumber(t){return isNaN(t)||t===null||t===void 0?"0":(t=Math.floor(t),t<0?"-"+this.formatNumber(Math.abs(t)):t>=1e12?(t/1e12).toFixed(2)+"T":t>=1e9?(t/1e9).toFixed(2)+"B":t>=1e6?(t/1e6).toFixed(2)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toString())}}class S{constructor(){this.activeBoosts=new Map,this.boostHistory=[],this.init()}init(){this.loadBoostData(),this.startBoostTimer()}applyBoost(t,e,s,i="unknown"){const o=this.generateBoostId(),a={id:o,type:t,multiplier:e,duration:s,source:i,startTime:Date.now(),endTime:Date.now()+s};return this.activeBoosts.set(o,a),this.boostHistory.push({...a,applied:!0}),this.showBoostNotification(a),this.updateBoostDisplay(),setTimeout(()=>{this.removeBoost(o)},s),o}removeBoost(t){const e=this.activeBoosts.get(t);e&&(this.activeBoosts.delete(t),this.showBoostEndNotification(e),this.updateBoostDisplay())}getActiveBoosts(){const t=Date.now();for(const[e,s]of this.activeBoosts)t>=s.endTime&&this.activeBoosts.delete(e);return Array.from(this.activeBoosts.values())}getClickMultiplier(){let t=1;return this.getActiveBoosts().forEach(s=>{(s.type==="click"||s.type==="all")&&(t*=s.multiplier)}),t}getAutoMultiplier(){let t=1;return this.getActiveBoosts().forEach(s=>{(s.type==="auto"||s.type==="all")&&(t*=s.multiplier)}),t}applyAdBoost(){return this.applyBoost("all",2,6e4,"advertisement")}applyFreeBoost(){const t=localStorage.getItem("lastFreeBoost"),e=Date.now(),s=18e5;return t&&e-parseInt(t)<s?{success:!1,message:`Бесплатный буст будет доступен через ${Math.ceil((s-(e-parseInt(t)))/6e4)} мин`}:(localStorage.setItem("lastFreeBoost",e.toString()),{success:!0,message:"Бесплатный буст x1.5 активирован на 15 секунд!",boostId:this.applyBoost("all",1.5,15e3,"free")})}isFreeBoostAvailable(){const t=localStorage.getItem("lastFreeBoost");if(!t)return!0;const e=Date.now(),s=18e5;return e-parseInt(t)>=s}getFreeBoostCooldown(){const t=localStorage.getItem("lastFreeBoost");if(!t)return 0;const i=18e5-(Date.now()-parseInt(t));return Math.max(0,i)}generateBoostId(){return"boost_"+Date.now()+"_"+Math.random().toString(36).substr(2,9)}showBoostNotification(t){const e=`Буст x${t.multiplier} активирован на ${Math.ceil(t.duration/1e3)} сек!`;this.showNotification(e,"success")}showBoostEndNotification(t){this.showNotification("Буст закончился","info")}updateBoostDisplay(){this.updateBoostTimer(),this.updateFreeBoostButton()}updateBoostTimer(){const t=this.getActiveBoosts(),e=document.getElementById("boost-timer");if(t.length===0){e&&e.remove();return}const s=t.reduce((a,n)=>n.multiplier>a.multiplier?n:a),i=Math.ceil((s.endTime-Date.now())/1e3);if(i<=0){e&&e.remove();return}let o=e;o||(o=document.createElement("div"),o.id="boost-timer",o.className="boost-timer-display",o.style.cssText=`
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
            `,document.body.appendChild(o)),o.textContent=`Буст x${s.multiplier}: ${i}с`}updateFreeBoostButton(){const t=document.getElementById("free-boost-btn");if(!t)return;const e=t.querySelector(".button-timer");if(e)if(this.isFreeBoostAvailable())e.textContent="Доступно",t.disabled=!1,t.classList.remove("disabled");else{const s=this.getFreeBoostCooldown(),i=Math.ceil(s/6e4);e.textContent=`(${i} мин)`,t.disabled=!0,t.classList.add("disabled")}}startBoostTimer(){setInterval(()=>{this.updateBoostDisplay()},1e3)}getBoostStats(){const t=this.getActiveBoosts(),e=this.boostHistory.length,s=this.getClickMultiplier(),i=this.getAutoMultiplier();return{activeBoosts:t.length,totalBoosts:e,clickMultiplier:s,autoMultiplier:i,freeBoostAvailable:this.isFreeBoostAvailable(),freeBoostCooldown:this.getFreeBoostCooldown()}}saveBoostData(){const t={boostHistory:this.boostHistory.slice(-100),timestamp:Date.now()};localStorage.setItem("boostSystemData",JSON.stringify(t))}loadBoostData(){try{const t=localStorage.getItem("boostSystemData");if(t){const e=JSON.parse(t);this.boostHistory=e.boostHistory||[]}}catch(t){console.error("Error loading boost system data:",t)}}showNotification(t,e="info"){const s=document.createElement("div");s.className=`notification ${e}`,s.textContent=t;const i={success:"#4CAF50",error:"#f44336",warning:"#ff9800",info:"#2196F3"};s.style.cssText=`
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
        `,document.body.appendChild(s),setTimeout(()=>{s.style.animation="slideUp 0.3s ease-out",setTimeout(()=>s.remove(),300)},3e3)}}class x{constructor(){this.sounds={},this.soundEnabled=!0,this.musicEnabled=!0,this.volume=.3,this.init()}init(){this.loadSettings(),this.initSounds()}initSounds(){const t={click:{frequency:800,duration:.1,type:"sine",volume:.2},purchase:{frequency:600,duration:.3,type:"square",volume:.3},upgrade:{frequency:1e3,duration:.4,type:"sawtooth",volume:.25},boost:{frequency:1200,duration:.5,type:"triangle",volume:.3},unlock:{frequency:1500,duration:.6,type:"sine",volume:.35},error:{frequency:300,duration:.2,type:"square",volume:.2},notification:{frequency:900,duration:.3,type:"sine",volume:.25}};this.audioContext=null;try{this.audioContext=new(window.AudioContext||window.webkitAudioContext),Object.keys(t).forEach(e=>{this.sounds[e]=t[e]}),console.log("Sound system initialized successfully")}catch{console.warn("Web Audio API not supported, using fallback sounds"),this.initFallbackSounds()}}initFallbackSounds(){const t={click:"data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+0Oy9diMFl2+z5yUCnQAAS5oAAABjAA",purchase:"data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+0Oy9diMFl2+z5yUCnQAAS5oAAABjAA",upgrade:"data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+0Oy9diMFl2+z5yUCnQAAS5oAAABjAA",boost:"data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+0Oy9diMFl2+z5yUCnQAAS5oAAABjAA"};try{for(const[e,s]of Object.entries(t)){const i=new Audio(s);i.volume=this.volume,this.sounds[e]={audio:i}}}catch(e){console.log("Audio initialization failed:",e)}}playSound(t){if(!(!this.soundEnabled||!this.sounds[t]))try{this.audioContext?this.playWebAudioSound(t):this.sounds[t].audio&&this.playFallbackSound(t)}catch(e){console.log("Sound play error:",e)}}playWebAudioSound(t){const e=this.sounds[t];if(!e)return;const s=this.audioContext.createOscillator(),i=this.audioContext.createGain();s.connect(i),i.connect(this.audioContext.destination),s.frequency.setValueAtTime(e.frequency,this.audioContext.currentTime),s.type=e.type,i.gain.setValueAtTime(0,this.audioContext.currentTime),i.gain.linearRampToValueAtTime(e.volume*this.volume,this.audioContext.currentTime+.01),i.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+e.duration),s.start(this.audioContext.currentTime),s.stop(this.audioContext.currentTime+e.duration)}playFallbackSound(t){const e=this.sounds[t].audio;e&&(e.currentTime=0,e.volume=this.volume,e.play().catch(()=>{}))}setSoundEnabled(t){this.soundEnabled=t,this.saveSettings()}setMusicEnabled(t){this.musicEnabled=t,this.saveSettings()}setVolume(t){this.volume=Math.max(0,Math.min(1,t)),this.saveSettings()}getSettings(){return{soundEnabled:this.soundEnabled,musicEnabled:this.musicEnabled,volume:this.volume}}saveSettings(){const t={soundEnabled:this.soundEnabled,musicEnabled:this.musicEnabled,volume:this.volume};localStorage.setItem("soundSettings",JSON.stringify(t))}loadSettings(){try{const t=localStorage.getItem("soundSettings");if(t){const e=JSON.parse(t);this.soundEnabled=e.soundEnabled!==void 0?e.soundEnabled:!0,this.musicEnabled=e.musicEnabled!==void 0?e.musicEnabled:!0,this.volume=e.volume!==void 0?e.volume:.3}}catch(t){console.error("Error loading sound settings:",t)}}playClickSound(){this.playSound("click")}playPurchaseSound(){this.playSound("purchase")}playUpgradeSound(){this.playSound("upgrade")}playBoostSound(){this.playSound("boost")}playUnlockSound(){this.playSound("unlock")}playErrorSound(){this.playSound("error")}playNotificationSound(){this.playSound("notification")}createClickEffect(t=800){if(!(!this.soundEnabled||!this.audioContext))try{const e=this.audioContext.createOscillator(),s=this.audioContext.createGain(),i=this.audioContext.createBiquadFilter();e.connect(i),i.connect(s),s.connect(this.audioContext.destination),e.frequency.setValueAtTime(t,this.audioContext.currentTime),e.frequency.exponentialRampToValueAtTime(t*.5,this.audioContext.currentTime+.1),e.type="sine",i.type="lowpass",i.frequency.setValueAtTime(2e3,this.audioContext.currentTime),s.gain.setValueAtTime(0,this.audioContext.currentTime),s.gain.linearRampToValueAtTime(this.volume*.3,this.audioContext.currentTime+.01),s.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+.15),e.start(this.audioContext.currentTime),e.stop(this.audioContext.currentTime+.15)}catch(e){console.log("Click effect error:",e)}}createMoneyEffect(){if(!(!this.soundEnabled||!this.audioContext))try{[523.25,659.25,783.99].forEach((e,s)=>{setTimeout(()=>{const i=this.audioContext.createOscillator(),o=this.audioContext.createGain();i.connect(o),o.connect(this.audioContext.destination),i.frequency.setValueAtTime(e,this.audioContext.currentTime),i.type="sine",o.gain.setValueAtTime(0,this.audioContext.currentTime),o.gain.linearRampToValueAtTime(this.volume*.2,this.audioContext.currentTime+.01),o.gain.exponentialRampToValueAtTime(.001,this.audioContext.currentTime+.3),i.start(this.audioContext.currentTime),i.stop(this.audioContext.currentTime+.3)},s*50)})}catch(t){console.log("Money effect error:",t)}}destroy(){this.audioContext&&this.audioContext.close(),this.sounds={}}}class h{constructor(){this.money=0,this.clickValue=1,this.baseAutoClickValue=0,this.autoClickValue=0,this.intervals=[],this.timeouts=[],this.eventListeners=[],this.clickDebounce=!1,this.upgradePrices={click:10,auto:50},this.adState={handler:null,isReady:!1,isLoading:!1,lastAttempt:0,cooldownTime:5e3,retryCount:0,maxRetries:3},this.telegramSDK=new g,this.soundSystem=new x,this.planetSystem=new b,this.boostSystem=new S,this.referralSystem=new y(this.telegramSDK),this.init()}init(){this.loadGame(),this.initElements(),this.bindEvents(),this.initTabs(),this.createUserProfile(),this.startAutoClicker(),this.startAutoSave(),this.updateDisplay(),setTimeout(()=>this.initAdvertising(),1e3)}initAdvertising(){console.log("Initializing advertising system..."),this.detectAdSDK(),this.createFreeBoostButton(),this.updateAdUI()}detectAdSDK(){const t=[window.show_9701900,window.showAd,window.monetagAds,window.adHandler,window.MonetagAds];for(const e of t)if(e&&typeof e=="function"){this.adState.handler=e,this.adState.isReady=!0,console.log("Ad SDK detected successfully");return}if(typeof show_9701900<"u"&&typeof show_9701900=="function"){this.adState.handler=show_9701900,this.adState.isReady=!0,console.log("Ad SDK detected via global function");return}console.warn("Ad SDK not detected. Ad features will be limited."),this.adState.isReady=!1}createFreeBoostButton(){if(!document.getElementById("shop-panel"))return;const e=document.getElementById("boosts-tab");if(!e||document.getElementById("free-boost-btn"))return;const s=document.createElement("button");s.id="free-boost-btn",s.className="shop-button free-boost",s.innerHTML=`
            <span class="button-icon">🎁</span>
            <span class="button-text">Бесплатный буст x1.5 (15 сек)</span>
            <span class="button-timer"></span>
        `,e.appendChild(s),this.addEventListener(s,"click",()=>this.useFreeBoost()),this.boostSystem.updateFreeBoostButton()}updateAdUI(){const t=document.getElementById("watch-ad-btn"),e=document.getElementById("free-boost-btn");this.adState.isReady?(t&&(t.style.display="block"),e&&(e.style.display="block")):(t&&(t.style.display="none"),e&&(e.style.display="block"))}watchAd(){const t=document.getElementById("watch-ad-btn");if(!t)return;const e=Date.now();if(this.adState.lastAttempt&&e-this.adState.lastAttempt<this.adState.cooldownTime){const i=Math.ceil((this.adState.cooldownTime-(e-this.adState.lastAttempt))/1e3);this.showNotification(`Подождите ${i} секунд`,"warning");return}if(!this.adState.isReady||!this.adState.handler){this.showNotification("Реклама недоступна. Используйте бесплатный буст!","info"),this.detectAdSDK();return}if(this.adState.isLoading){this.showNotification("Реклама уже загружается...","info");return}this.adState.isLoading=!0,this.adState.lastAttempt=e,t.disabled=!0,t.textContent="Загрузка рекламы...",new Promise((i,o)=>{const a=setTimeout(()=>{o(new Error("Ad timeout"))},15e3);try{const n=this.adState.handler();Promise.resolve(n).then(()=>{clearTimeout(a),i()}).catch(d=>{clearTimeout(a),o(d)})}catch(n){clearTimeout(a),o(n)}}).then(()=>{console.log("Ad shown successfully"),this.onAdSuccess(t)}).catch(i=>{console.error("Ad error:",i),this.onAdError(i,t)}).finally(()=>{this.adState.isLoading=!1})}onAdSuccess(t){this.applyAdBoost(),this.adState.retryCount=0,t&&(t.disabled=!1,t.textContent="Смотреть рекламу (x2 буст)"),this.showNotification("Буст x2 активирован на 30 секунд!","success"),this.playSound("boost")}onAdError(t,e){this.adState.retryCount++;let s="Не удалось загрузить рекламу",i=!1;t.message&&(t.message.includes("Network")||t.message.includes("network")?(s="Проблема с сетью. Проверьте интернет-соединение",i=!0):t.message.includes("timeout")?(s="Время загрузки истекло",i=!0):(t.message.includes("block")||t.message.includes("Block"))&&(s="Реклама заблокирована. Отключите AdBlock")),this.showNotification(s,"error"),e&&(e.disabled=!1,e.textContent="Смотреть рекламу (x2 буст)"),this.adState.retryCount>=this.adState.maxRetries&&(this.adState.cooldownTime=3e4,this.showNotification("Слишком много ошибок. Попробуйте позже","warning"),setTimeout(()=>{this.adState.retryCount=0,this.adState.cooldownTime=5e3,this.detectAdSDK()},6e4)),i&&setTimeout(()=>{this.showNotification("Попробуйте бесплатный буст!","info")},2e3)}useFreeBoost(){const t=this.boostSystem.applyFreeBoost();t.success?(this.soundSystem.playBoostSound(),this.telegramSDK.hapticFeedback("notification","success"),this.updateBoostState()):(this.soundSystem.playErrorSound(),this.telegramSDK.hapticFeedback("notification","error")),this.showNotification(t.message,t.success?"success":"info")}applyAdBoost(){const t=this.boostSystem.applyAdBoost();return this.soundSystem.playBoostSound(),this.telegramSDK.hapticFeedback("notification","success"),this.updateBoostState(),t}createUserProfile(){if(!document.querySelector(".top-panel"))return;const e=document.createElement("div");e.className="user-profile",e.style.cssText=`
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 8px 16px;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            margin-left: 15px;
        `;const s=this.telegramSDK.getUserName(),i=this.telegramSDK.getUserPhoto();if(i){const n=document.createElement("img");n.src=i,n.style.cssText=`
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin-right: 10px;
                border: 2px solid rgba(255, 255, 255, 0.3);
            `,e.appendChild(n)}else{const n=document.createElement("div");n.innerHTML="👤",n.style.cssText=`
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                margin-right: 10px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
            `,e.appendChild(n)}const o=document.createElement("span");o.textContent=s,o.style.cssText=`
            color: white;
            font-size: 14px;
            font-weight: 600;
        `,e.appendChild(o);const a=document.getElementById("income-display");a&&a.parentNode.insertBefore(e,a.nextSibling)}initElements(){this.moneyDisplay=document.getElementById("money-amount"),this.incomeDisplay=document.getElementById("income-amount"),this.planetEarth=document.getElementById("planet-earth"),this.settingsBtn=document.getElementById("settings-btn"),this.mapBtn=document.getElementById("map-btn"),this.shopBtn=document.getElementById("shop-btn"),this.friendsBtn=document.getElementById("friends-btn"),this.planetEarth||console.error("CRITICAL: Planet element not found! Game will not work.")}bindEvents(){this.addEventListener(this.planetEarth,"click",a=>this.clickPlanet(a)),this.addEventListener(this.settingsBtn,"click",()=>this.openSettings()),this.addEventListener(this.mapBtn,"click",()=>this.openMap()),this.addEventListener(this.shopBtn,"click",()=>this.openShop()),this.addEventListener(this.friendsBtn,"click",()=>this.openFriends()),document.addEventListener("click",a=>{const n=document.querySelectorAll(".settings-panel, .map-panel, .shop-panel, .friends-panel"),d=Array.from(n).some(u=>u.contains(a.target)&&u.classList.contains("panel-visible")),m=a.target.closest(".action-btn, .settings-btn");!d&&!m&&this.hideAllPanels()});const t=document.getElementById("buy-click"),e=document.getElementById("buy-auto");t&&this.addEventListener(t,"click",()=>this.buyUpgrade("click")),e&&this.addEventListener(e,"click",()=>this.buyUpgrade("auto"));const s=document.getElementById("watch-ad-btn");s&&this.addEventListener(s,"click",()=>this.watchAd());const i=document.getElementById("sound-toggle"),o=document.getElementById("music-toggle");i&&(i.checked=this.soundSystem.getSettings().soundEnabled,this.addEventListener(i,"change",a=>{this.soundSystem.setSoundEnabled(a.target.checked)})),o&&(o.checked=this.soundSystem.getSettings().musicEnabled,this.addEventListener(o,"change",a=>{this.soundSystem.setMusicEnabled(a.target.checked)}))}addEventListener(t,e,s){t&&(t.addEventListener(e,s),this.eventListeners.push({element:t,event:e,handler:s}))}initTabs(){const t=document.querySelectorAll(".shop-tab"),e=document.querySelectorAll(".shop-tab-content");t.forEach(i=>{this.addEventListener(i,"click",()=>{const o=i.dataset.tab;t.forEach(n=>n.classList.remove("active")),i.classList.add("active"),e.forEach(n=>n.classList.remove("active"));const a=document.getElementById(`${o}-tab`);a&&a.classList.add("active")})}),document.querySelectorAll(".donate-btn").forEach(i=>{this.addEventListener(i,"click",o=>{const a=parseInt(o.target.dataset.amount);isNaN(a)||this.buyDonation(a)})})}clickPlanet(t){if(this.clickDebounce)return;this.clickDebounce=!0,setTimeout(()=>this.clickDebounce=!1,50);const e=this.planetSystem.getTotalPlanetBoost(),s=this.boostSystem.getClickMultiplier(),i=Math.floor(this.clickValue*e*s);this.money+=i;const o=this.telegramSDK.getUserId();o&&this.referralSystem.addReferralEarning(o,i),this.updateDisplay(),this.saveGame(),this.soundSystem.playClickSound(),this.soundSystem.createClickEffect(),this.telegramSDK.hapticFeedback("impact","light"),this.showClickEffect(t),this.showMoneyPopup(t,i)}showClickEffect(t){const e=document.createElement("div");e.className="click-effect",e.style.cssText=`
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
        `;const i=this.planetEarth.getBoundingClientRect(),o=t.clientX-i.left,a=t.clientY-i.top;s.style.left=o+"px",s.style.top=a+"px",this.planetEarth.appendChild(s),setTimeout(()=>s.remove(),1e3)}buyUpgrade(t){if(this.clickDebounce)return;this.clickDebounce=!0,setTimeout(()=>this.clickDebounce=!1,200);const e=this.upgradePrices[t];if(t==="click"&&this.money>=e){this.money-=e,this.clickValue+=1,this.upgradePrices.click=Math.floor(e*1.5),this.soundSystem.playUpgradeSound(),this.telegramSDK.hapticFeedback("notification","success"),this.showNotification("Клик улучшен! +1 за клик","success");const s=document.getElementById("buy-click");s&&(s.textContent=`Улучшить клик (${this.formatNumber(this.upgradePrices.click)})`)}else if(t==="auto"&&this.money>=e){this.money-=e,this.baseAutoClickValue+=1,this.updateBoostState(),this.upgradePrices.auto=Math.floor(e*1.5),this.soundSystem.playUpgradeSound(),this.telegramSDK.hapticFeedback("notification","success"),this.showNotification("Автоклик улучшен! +1/сек","success");const s=document.getElementById("buy-auto");s&&(s.textContent=`Улучшить автоклик (${this.formatNumber(this.upgradePrices.auto)})`)}else this.soundSystem.playErrorSound(),this.telegramSDK.hapticFeedback("notification","error"),this.showNotification("Недостаточно денег!","error");this.updateDisplay(),this.saveGame()}updateBoostState(){const t=this.planetSystem.getTotalPlanetBoost(),e=this.boostSystem.getAutoMultiplier();this.autoClickValue=Math.floor(this.baseAutoClickValue*t*e),this.updateDisplay(),this.saveGame()}buyPlanetFromMap(t,e){const s=this.planetSystem.buyPlanet(t,this.money);if(s.success){this.money-=s.cost;const i=document.querySelector(`.map-item[data-planet="${t}"]`);if(i&&s.cost>0){i.classList.remove("locked");const o=i.querySelector(".map-status");o&&(o.textContent="Доступна",o.classList.remove("locked"),o.classList.add("active"))}this.soundSystem.playUnlockSound(),this.telegramSDK.hapticFeedback("notification","success"),this.showNotification(s.message,"success"),this.updateDisplay(),this.saveGame()}else this.soundSystem.playErrorSound(),this.telegramSDK.hapticFeedback("notification","error"),this.showNotification(s.message,"error")}buyDonation(t){this.money>=t?(this.money-=t,this.soundSystem.playPurchaseSound(),this.telegramSDK.hapticFeedback("notification","success"),this.showDonationEffect(),this.showNotification(`Спасибо за донат ${this.formatNumber(t)}!`,"success"),this.updateDisplay(),this.saveGame()):(this.soundSystem.playErrorSound(),this.telegramSDK.hapticFeedback("notification","error"),this.showNotification("Недостаточно денег для доната!","error"))}showDonationEffect(){for(let e=0;e<20;e++)setTimeout(()=>{const s=document.createElement("div");s.innerHTML="⭐",s.style.cssText=`
                    position: fixed;
                    font-size: ${Math.random()*20+10}px;
                    left: ${Math.random()*100}%;
                    top: ${Math.random()*100}%;
                    animation: starFall 2s ease-out forwards;
                    pointer-events: none;
                    z-index: 9999;
                `,document.body.appendChild(s),setTimeout(()=>s.remove(),2e3)},e*50)}startAutoClicker(){const t=setInterval(()=>{if(this.autoClickValue>0){const e=this.money;this.money+=this.autoClickValue;const s=this.telegramSDK.getUserId();s&&this.referralSystem.addReferralEarning(s,this.autoClickValue),e!==this.money&&(this.updateDisplay(),Math.floor(Date.now()/1e4)%1===0&&this.saveGame())}},1e3);this.intervals.push(t)}startAutoSave(){const t=setInterval(()=>{this.saveGame()},3e4);this.intervals.push(t)}openSettings(){this.showPanel("settings-panel")}openMap(){this.showPanel("map-panel"),this.updateMapDisplay()}openShop(){this.showPanel("shop-panel"),this.updateShopDisplay()}openFriends(){this.showPanel("friends-panel"),this.updateFriendsDisplay()}showPanel(t){const e=document.getElementById(t);if(!e){console.error(`Panel ${t} not found`);return}e.classList.add("panel-visible");const s=()=>this.hideAllPanels(),i=e.querySelector(".close-btn");i&&(i.onclick=s)}hideAllPanels(){document.querySelectorAll(".settings-panel, .map-panel, .shop-panel, .friends-panel").forEach(e=>e.classList.remove("panel-visible"))}updateMapDisplay(){const t=this.planetSystem.getMapData(),e=document.querySelector("#map-panel .panel-content");e&&(e.innerHTML="",t.forEach(s=>{const i=document.createElement("div");i.className=`map-item ${s.unlocked?"":"locked"}`,i.dataset.planet=s.id,i.dataset.price=s.price,i.innerHTML=`
                <div class="map-planet">
                    <div class="planet-image" style="background-image: url('${s.image}')"></div>
                </div>
                <div class="map-info">
                    <h4>${s.name}</h4>
                    <p>${s.description}</p>
                    <p class="planet-boost">Буст: +${((s.boost-1)*100).toFixed(0)}% к заработку</p>
                </div>
                <div class="map-status ${s.unlocked?"active":"locked"}">
                    ${s.current?"Активна":s.unlocked?"Доступна":`💰 ${this.formatNumber(s.price)}`}
                </div>
            `,s.unlocked?i.onclick=()=>{this.planetSystem.changePlanet(s.id),this.updateMapDisplay(),this.updateDisplay()}:i.onclick=()=>this.buyPlanetFromMap(s.id,s.price),e.appendChild(i)}))}updateShopDisplay(){const t=document.getElementById("buy-click"),e=document.getElementById("buy-auto");t&&(t.textContent=`Улучшить клик (${this.formatNumber(this.upgradePrices.click)})`),e&&(e.textContent=`Улучшить автоклик (${this.formatNumber(this.upgradePrices.auto)})`),this.boostSystem.updateFreeBoostButton()}updateDisplay(){if(this.moneyDisplay&&(this.moneyDisplay.textContent=this.formatNumber(Math.floor(this.money))),this.incomeDisplay){const t=this.formatNumber(this.autoClickValue);if(this.boostSystem.getActiveBoosts().length>0){const s=this.boostSystem.getAutoMultiplier();this.incomeDisplay.innerHTML=`<span style="color: #4CAF50; font-weight: bold;">${t} (x${s.toFixed(1)})</span>`}else this.incomeDisplay.textContent=t}}formatNumber(t){return isNaN(t)||t===null||t===void 0?"0":(t=Math.floor(t),t<0?"-"+this.formatNumber(Math.abs(t)):t>=1e12?(t/1e12).toFixed(2)+"T":t>=1e9?(t/1e9).toFixed(2)+"B":t>=1e6?(t/1e6).toFixed(2)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toString())}capitalizeFirstLetter(t){return t.charAt(0).toUpperCase()+t.slice(1)}buyRocketBoost(){this.money>=100?(this.money-=100,this.clickValue*=2,this.soundSystem.playUpgradeSound(),this.telegramSDK.hapticFeedback("notification","success"),this.showNotification("Ракетный ускоритель установлен! Клик x2","success"),this.updateDisplay(),this.saveGame()):(this.soundSystem.playErrorSound(),this.showNotification("Недостаточно денег!","error"))}buySatellite(){if(this.money>=100){this.money-=100,this.clickValue+=2,this.soundSystem.playUpgradeSound(),this.telegramSDK.hapticFeedback("notification","success"),this.showNotification("Спутник запущен! Клик +2","success");const e=document.getElementById("satellite-price");if(e){const s=Math.floor(150);e.textContent=s}this.updateDisplay(),this.saveGame()}else this.soundSystem.playErrorSound(),this.telegramSDK.hapticFeedback("notification","error"),this.showNotification("Недостаточно денег!","error")}buySpaceship(){if(this.money>=500){this.money-=500,this.baseAutoClickValue+=1,this.updateBoostState(),this.soundSystem.playUpgradeSound(),this.telegramSDK.hapticFeedback("notification","success"),this.showNotification("Космический корабль запущен! +1/сек","success");const e=document.getElementById("spaceship-price");if(e){const s=Math.floor(750);e.textContent=s}this.updateDisplay(),this.saveGame()}else this.soundSystem.playErrorSound(),this.telegramSDK.hapticFeedback("notification","error"),this.showNotification("Недостаточно денег!","error")}buyWithStars(){this.telegramSDK.tg?this.telegramSDK.showAlert("Функция покупки за звезды будет доступна в следующем обновлении!"):this.showNotification("Доступно только в Telegram","info")}updateFriendsDisplay(){const t=document.getElementById("friends-panel");if(!t)return;const e=t.querySelector(".panel-content");if(!e)return;const s=this.referralSystem.getReferralStats(),i=this.referralSystem.getUserReferrals(),o=this.referralSystem.getReferralLink();e.innerHTML=`
            <div class="referral-stats" style="
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 20px;
                text-align: center;
            ">
                <h3 style="margin: 0 0 15px 0; color: #4CAF50;">Реферальная система</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px;">
                    <div style="background: rgba(76, 175, 80, 0.2); padding: 10px; border-radius: 10px;">
                        <div style="font-size: 24px; font-weight: bold; color: #4CAF50;">${s.totalReferrals}</div>
                        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">Рефералов</div>
                    </div>
                    <div style="background: rgba(255, 193, 7, 0.2); padding: 10px; border-radius: 10px;">
                        <div style="font-size: 24px; font-weight: bold; color: #FFC107;">${this.formatNumber(s.totalBonus)}</div>
                        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">Заработано</div>
                    </div>
                </div>
                <p style="margin: 0; font-size: 14px; color: rgba(255, 255, 255, 0.8);">
                    Получайте 2% с заработка каждого приглашенного друга!
                </p>
            </div>

            <div class="referral-link" style="
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 20px;
            ">
                <h4 style="margin: 0 0 10px 0; color: white;">Ваша реферальная ссылка:</h4>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="text" value="${o||"Недоступно"}" readonly style="
                        flex: 1;
                        padding: 10px;
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 10px;
                        color: white;
                        font-size: 12px;
                    ">
                    <button onclick="gameInstance.referralSystem.copyReferralLink()" style="
                        background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
                        border: none;
                        color: white;
                        padding: 10px 15px;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: bold;
                    ">Копировать</button>
                </div>
            </div>

            <div class="referrals-list">
                <h4 style="margin: 0 0 15px 0; color: white;">Ваши рефералы:</h4>
                ${i.length===0?'<p style="text-align: center; color: rgba(255, 255, 255, 0.5); padding: 20px;">Пока нет рефералов</p>':i.map(a=>`
                        <div class="referral-item" style="
                            display: flex;
                            align-items: center;
                            padding: 15px;
                            margin-bottom: 10px;
                            background: rgba(255, 255, 255, 0.05);
                            border-radius: 10px;
                            border: 1px solid rgba(255, 255, 255, 0.1);
                        ">
                            <div class="referral-avatar" style="
                                font-size: 24px;
                                width: 40px;
                                height: 40px;
                                background: rgba(255, 255, 255, 0.1);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                margin-right: 15px;
                            ">👤</div>
                            <div class="referral-info" style="flex: 1;">
                                <h5 style="margin: 0 0 5px 0; font-size: 14px; color: white;">Пользователь ${a.userId}</h5>
                                <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.7);">
                                    Заработал: ${this.formatNumber(a.totalEarnings)} • 
                                    Ваш бонус: ${this.formatNumber(a.bonus)}
                                </p>
                            </div>
                            <div class="referral-bonus" style="
                                background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
                                color: white;
                                padding: 5px 10px;
                                border-radius: 15px;
                                font-size: 12px;
                                font-weight: bold;
                            ">+${this.formatNumber(a.bonus)}</div>
                        </div>
                    `).join("")}
            </div>
        `}showNotification(t,e="info"){const s=document.createElement("div");s.className=`notification ${e}`,s.textContent=t;const i={success:"#4CAF50",error:"#f44336",warning:"#ff9800",info:"#2196F3"};s.style.cssText=`
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
        `,document.body.appendChild(s),setTimeout(()=>{s.style.animation="slideUp 0.3s ease-out",setTimeout(()=>s.remove(),300)},3e3)}saveGame(){const t={money:this.money,clickValue:this.clickValue,baseAutoClickValue:this.baseAutoClickValue,upgradePrices:this.upgradePrices,planetSystem:this.planetSystem.saveState(),timestamp:Date.now()};try{localStorage.setItem("planetClickerSave",JSON.stringify(t)),this.boostSystem.saveBoostData(),this.referralSystem.saveReferralData()}catch(e){console.error("Failed to save game:",e)}}loadGame(){try{const t=localStorage.getItem("planetClickerSave");if(!t)return;const e=JSON.parse(t);if(this.money=e.money||0,this.clickValue=e.clickValue||1,this.baseAutoClickValue=e.baseAutoClickValue||0,this.upgradePrices=e.upgradePrices||{click:10,auto:50},e.planetSystem&&this.planetSystem.loadState(e.planetSystem),e.timestamp&&this.baseAutoClickValue>0){const s=Date.now(),i=Math.min((s-e.timestamp)/1e3,3600),o=this.planetSystem.getTotalPlanetBoost(),a=Math.floor(this.baseAutoClickValue*o*i*.5);a>0&&(this.money+=a,setTimeout(()=>{this.showNotification(`Офлайн доход: +${this.formatNumber(a)}`,"info")},1e3))}this.updateBoostState(),console.log("Game loaded successfully")}catch(t){console.error("Failed to load game:",t)}}resetGame(){confirm("Вы уверены, что хотите сбросить весь прогресс?")&&(localStorage.removeItem("planetClickerSave"),localStorage.removeItem("lastFreeBoost"),location.reload())}destroy(){this.intervals.forEach(t=>clearInterval(t)),this.timeouts.forEach(t=>clearTimeout(t)),this.eventListeners.forEach(({element:t,event:e,handler:s})=>{t.removeEventListener(e,s)}),this.saveGame()}}const p=document.createElement("style");p.textContent=`
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
`;document.head.appendChild(p);"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(r=>{console.log("SW registered: ",r)}).catch(r=>{console.log("SW registration failed: ",r)})});let l=null;document.addEventListener("DOMContentLoaded",()=>{l=new h,window.addEventListener("beforeunload",()=>{l&&l.saveGame()}),window.addEventListener("unload",()=>{l&&l.destroy()})});typeof c<"u"&&c.exports&&(c.exports=h)});export default A();
