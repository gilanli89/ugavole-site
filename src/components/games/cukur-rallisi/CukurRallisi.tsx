'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Flag, Gauge, Heart, MapPin, Pause, Play, RotateCcw, Route, ShieldCheck, Sun, TriangleAlert, Volume2, VolumeX, Wrench, X, Trophy } from 'lucide-react';
import styles from './cukur-rallisi.module.css';
import { DrivingSound } from './sound';
import DrivingControls, { type Pedal } from './DrivingControls';
import Leaderboard from './Leaderboard';
import { FIXED_STEP, MAX_FRAMES, MAX_INPUTS, seededRandom, parseNickname, totalScore, type Action, type ReplayInput } from './replay';
import { fresh, move, render, difficulty, stageIndex, stages, step, type GameState } from './game';

export default function CukurRallisi(){
 const canvas=useRef<HTMLCanvasElement>(null);const game=useRef(fresh());const [ui,setUi]=useState<GameState>(fresh());const [muted,setMuted]=useState(false);const [best,setBest]=useState(0);const bestRef=useRef(0);const touch=useRef<{id:number;x:number}|null>(null);const audio=useRef<DrivingSound|null>(null);const mutedRef=useRef(false);
 const [session,setSession]=useState(false);
 const [nickname,setNickname]=useState('');const [nameError,setNameError]=useState('');const [starting,setStarting]=useState(false);const [scoresOpen,setScoresOpen]=useState(false);
 const [saveStatus,setSaveStatus]=useState<'idle'|'offline'|'saving'|'saved'|'error'>('idle');
 const runId=useRef<string|null>(null);const inputs=useRef<ReplayInput[]>([]);const frameCount=useRef(0);const random=useRef(seededRandom(1));const replayOverflow=useRef(false);
 const record=useCallback((action:Action)=>{if(game.current.status!=='playing')return;if(inputs.current.length<MAX_INPUTS)inputs.current.push([frameCount.current,action]);else replayOverflow.current=true;},[]);
 const submitScore=useCallback(async()=>{
   const id=runId.current;if(!id||replayOverflow.current){setSaveStatus('offline');return;}
   setSaveStatus('saving');
   try{const r=await fetch('/api/oyunlar/cukur-rallisi/finish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:id,frames:frameCount.current,inputs:inputs.current}),signal:AbortSignal.timeout(12000)});if(!r.ok)throw new Error('save_failed');if(runId.current===id)setSaveStatus('saved');}
   catch{if(runId.current===id)setSaveStatus('error');}
 },[]);
 const heldPedals=useRef({brake:new Set<string>(),throttle:new Set<string>()});
 const [audioState,setAudioState]=useState('ready');const [audioLevel,setAudioLevel]=useState(0);const [updateAvailable,setUpdateAvailable]=useState(false);
 const snapshot=useCallback(()=>setUi({...game.current,objects:[...game.current.objects]}),[]);
 const unlockSound=useCallback(()=>{try{if(!audio.current)audio.current=new DrivingSound();audio.current.setMuted(mutedRef.current);audio.current.resume();}catch{setMuted(true);mutedRef.current=true;}},[]);
 const toggleSound=()=>{const playing=audio.current?.status().state==='running'&&!mutedRef.current;mutedRef.current=playing;setMuted(playing);if(!playing){unlockSound();audio.current?.effect('start');}else audio.current?.setMuted(true);};
 const releaseControls=useCallback(()=>{if(game.current.brake)record('brake-off');if(game.current.throttle)record('gas-off');heldPedals.current.brake.clear();heldPedals.current.throttle.clear();game.current.brake=false;game.current.throttle=false;touch.current=null;},[record]);
 const start=async()=>{
   if(starting)return;
   const name=parseNickname(nickname);if(!name){setNameError('2–20 karakterlik bir takma ad yaz.');return;}
   setNameError('');setStarting(true);unlockSound();audio.current?.effect('start');releaseControls();
   let seed=crypto.getRandomValues(new Uint32Array(1))[0];runId.current=null;setSaveStatus('idle');
   try{const r=await fetch('/api/oyunlar/cukur-rallisi/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nickname:name}),signal:AbortSignal.timeout(6000)});const data=await r.json();if(!r.ok)throw new Error('start_failed');runId.current=data.id;seed=data.seed;}
   catch{setSaveStatus('offline');}
   inputs.current=[];frameCount.current=0;replayOverflow.current=false;random.current=seededRandom(seed);
   game.current={...fresh(),status:'playing'};setNickname(name);setSession(true);setStarting(false);
   if(document.activeElement instanceof HTMLElement)document.activeElement.blur();
   try{localStorage.setItem('cukur-nickname',name);}catch{}snapshot();
 };
 const leave=()=>{releaseControls();game.current=fresh();runId.current=null;audio.current?.quiet();setSession(false);snapshot();};
 const pause=useCallback(()=>{const s=game.current;if(s.status==='playing'||s.status==='paused'){releaseControls();s.status=s.status==='playing'?'paused':'playing';if(s.status==='playing')unlockSound();else audio.current?.quiet();snapshot();}},[snapshot,unlockSound,releaseControls]);
 const steer=useCallback((d:number)=>{if(game.current.status!=='playing')return;record(d<0?'left':'right');move(game.current,d);snapshot();},[snapshot,record]);
 const pedal=useCallback((name:Pedal,pressed:boolean,source:string)=>{
   const held=heldPedals.current[name];
   if(pressed&&game.current.status==='playing')held.add(source);else held.delete(source);
   const next=game.current.status==='playing'&&held.size>0;if(next!==game.current[name])record(name==='brake'?(next?'brake-on':'brake-off'):(next?'gas-on':'gas-off'));
   game.current[name]=next;snapshot();
 },[snapshot,record]);
 useEffect(()=>{
   if(!session)return;
   const viewport=window.matchMedia('(max-width: 767px), (max-height: 520px) and (max-width: 960px)');
   const previous=document.documentElement.style.overflow;
   const sync=()=>{document.documentElement.style.overflow=viewport.matches?'hidden':previous;};
   sync();viewport.addEventListener('change',sync);
   return()=>{document.documentElement.style.overflow=previous;viewport.removeEventListener('change',sync);};
 },[session]);
 useEffect(()=>{const check=()=>{void fetch('/oyunlar/cukur-rallisi/build.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(v=>{if(v&&typeof v==='object'&&'release' in v&&typeof v.release==='string'&&v.release!=='ugavole-2026-09-06.3')setUpdateAvailable(true);}).catch(()=>{});};const timer=setInterval(check,45000);window.addEventListener('focus',check);return()=>{clearInterval(timer);window.removeEventListener('focus',check);};},[]);
 useEffect(()=>{
   const restoreName=requestAnimationFrame(()=>{try{setNickname(parseNickname(localStorage.getItem('cukur-nickname'))||'');}catch{}});
   try{const saved=Number(localStorage.getItem('cukur-best')||0);if(Number.isFinite(saved)){bestRef.current=saved;}}catch{}
   const bg=new Image();bg.src='/oyunlar/cukur-rallisi/landscape.png';const c=canvas.current;if(!c)return;const ctx=c.getContext('2d');if(!ctx)return;
   let width=1000,height=650,last=0,raf=0,uiTime=0,accumulator=0;
   const resize=()=>{const rect=c.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(2,window.devicePixelRatio||1);c.width=width*dpr;c.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);};
   const observer=new ResizeObserver(resize);observer.observe(c);resize();
   const frame=(t:number)=>{const dt=Math.min(.04,(t-last)/1000||0);last=t;const s=game.current;const hp=s.health,points=s.score,checks=s.checkpoints;const old=s.status;if(s.status==='playing'){accumulator+=dt;while(accumulator>=FIXED_STEP&&s.status==='playing'){step(s,FIXED_STEP,random.current);frameCount.current++;accumulator-=FIXED_STEP;if(frameCount.current>=MAX_FRAMES&&s.status==='playing'){s.status='over';replayOverflow.current=true;}}}else accumulator=0;audio.current?.update(s);if(s.health<hp)audio.current?.effect('hit');else if(s.checkpoints>checks)audio.current?.effect('checkpoint');else if(s.score-points===75)audio.current?.effect('repair');if(old==='playing'&&s.status==='won')audio.current?.effect('win');if(old==='playing'&&s.status==='over')audio.current?.effect('lose');
     if(old==='playing'&&(s.status==='over'||s.status==='won')){void submitScore();const score=Math.floor(s.score+s.distance*100);if(score>bestRef.current){bestRef.current=score;setBest(score);try{localStorage.setItem('cukur-best',String(score));}catch{}}}
     render(ctx,width,height,s,bg,t/1000);if(t-uiTime>90){uiTime=t;setBest(bestRef.current);const sound=audio.current?.status();setAudioState(sound?.state||'ready');setAudioLevel(sound?.level||0);snapshot();}raf=requestAnimationFrame(frame);
   };raf=requestAnimationFrame(frame);
   const keydown=(e:KeyboardEvent)=>{
     const target=e.target;
     if(target instanceof HTMLElement&&(target.closest('dialog')||target.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(target.tagName)))return;
     if(game.current.status!=='playing'&&game.current.status!=='paused')return;
     const key=e.key.toLowerCase();
     if(!['arrowleft','arrowright','arrowup','arrowdown',' ','a','d','w','s','p','escape'].includes(key))return;
     if(target instanceof HTMLButtonElement&&key===' ')return;
     e.preventDefault();
     if(['arrowup','w'].includes(key))pedal('throttle',true,`key:${e.code}`);
     if(['arrowdown',' ','s'].includes(key))pedal('brake',true,`key:${e.code}`);
     if(e.repeat)return;
     if(key==='arrowleft'||key==='a')steer(-1);
     if(key==='arrowright'||key==='d')steer(1);
     if(key==='p'||key==='escape')pause();
   };
   const keyup=(e:KeyboardEvent)=>{pedal('brake',false,`key:${e.code}`);pedal('throttle',false,`key:${e.code}`);};
   const hide=()=>{releaseControls();audio.current?.quiet();if(game.current.status==='playing'){game.current.status='paused';snapshot();}};
   const visibility=()=>{if(document.hidden)hide();};
   window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',hide);document.addEventListener('visibilitychange',visibility);
   return()=>{cancelAnimationFrame(restoreName);cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',hide);document.removeEventListener('visibilitychange',visibility);audio.current?.close();audio.current=null;};
 },[pause,steer,pedal,releaseControls,snapshot,submitScore]);
 const active=ui.status==='playing';const ended=ui.status==='over'||ui.status==='won';const stage=stageIndex(ui.distance);const police=ui.objects.some(o=>o.type==='police'&&!o.done&&o.z<.8);const score=totalScore(ui);const level=difficulty(ui.distance).level;
 return <div id="cukur-rallisi" className={styles.root} data-session={session} data-status={ui.status}>
   <header className="topbar">{session&&<button className="exit-game" aria-label="Oyundan çık" onClick={leave}><X size={22}/></button>}<a href="#cukur-rallisi" className="brand" aria-label="Çukur Rallisi"><span className="brand-mark"><Route size={24}/></span><span>ÇUKUR<span className="brand-light"> RALLİSİ</span><small>KUZEY KIBRIS YOL MACERASI</small></span></a><div className="header-route"><span>GİRNE</span><span className="route-dashes">······ <ArrowRight size={17}/> ······</span><span>LEFKOŞA</span></div><div className="header-right"><span className="weather"><Sun size={18}/> Hava güzel. Yol, tartışılır.</span><button className="icon-button sound" data-audio-state={audioState} data-audio-level={audioLevel.toFixed(5)} aria-label={audioState==='running'&&!muted?'Sesi kapat':'Sesi aç ve dene'} aria-pressed={audioState==='running'&&!muted} onClick={toggleSound}>{muted?<VolumeX size={20}/>:<Volume2 size={20}/>}<span>{muted?'Ses kapalı':audioState==='running'?'Ses açık':'Sesi aç'}</span></button></div></header>
   {updateAvailable&&<div className="update-notice" role="status">Oyunun yeni sürümü hazır.<button onClick={()=>window.location.reload()}>Güncelle ve yeniden başla</button></div>}
   <section className={`game-shell ${active?'is-playing':''}`} aria-label="Çukur Rallisi oyun alanı">
    <canvas ref={canvas} aria-label="Girne Lefkoşa yolunda üç şeritli sürüş oyunu"
      onPointerDown={e=>{if(!active)return;touch.current={id:e.pointerId,x:e.clientX};e.currentTarget.setPointerCapture(e.pointerId);}}
      onPointerMove={e=>{const origin=touch.current;if(!origin||origin.id!==e.pointerId)return;const d=e.clientX-origin.x;if(Math.abs(d)>30){steer(d>0?1:-1);touch.current={id:e.pointerId,x:e.clientX};}}}
      onPointerUp={()=>{touch.current=null;}} onPointerCancel={()=>{touch.current=null;}} onLostPointerCapture={()=>{touch.current=null;}}/>

    <div className="hud"><div className="location-chip"><span className="live-dot"/><div><small>ŞU AN BURADASIN</small><strong>{stages[stage]}</strong></div></div><div className="hud-right"><div className="score"><small>PUAN</small><strong>{score.toLocaleString('tr-TR').padStart(5,'0')}</strong></div><div className="health" aria-label={`${ui.health} can kaldı`}><small>ARACIN KEYFİ</small><div>{[0,1,2].map(n=><Heart key={n} size={21} fill={n<ui.health?'#e6b342':'transparent'} color={n<ui.health?'#e6b342':'#73837a'}/>)}</div></div><button className="icon-button pause" aria-label={ui.status==='paused'?'Devam et':'Duraklat'} disabled={ui.status==='ready'||ended} onClick={pause}>{ui.status==='paused'?<Play size={19}/>:<Pause size={19}/>}</button></div></div>
    {ui.status==='ready'&&<div className="start-panel"><div className="eyebrow"><span/> 3 ŞERİT. BOL SÜRPRİZ.</div><h2 className="game-title">Manzara güzel.<br/>Yola <em>dikkat.</em></h2><p>Girne’den Lefkoşa’ya küçük bir yolculuk.<br className="desktop-br"/> Çukurlara rağmen, keyfin yerinde kalsın.</p><div className="start-features"><span><TriangleAlert size={17}/> Çukurları atlat</span><span><ShieldCheck size={17}/> Çevirmede yavaşla</span><span><Wrench size={17}/> Aracını koru</span></div><form className="driver-form" onSubmit={e=>{e.preventDefault();void start();}}><label htmlFor="driver-nickname">Direksiyonda kim var?</label><input id="driver-nickname" name="nickname" value={nickname} onChange={e=>{setNickname(e.target.value);setNameError('');}} placeholder="Takma adın" minLength={2} maxLength={20} required autoComplete="nickname" enterKeyHint="go" aria-describedby="nickname-note"/><small id="nickname-note">Adın en iyi skorlar tablosunda görünecek.</small>{nameError&&<p className="name-error" role="alert">{nameError}</p>}<button className="start-button" type="submit" disabled={starting}>{starting?'YOL HAZIRLANIYOR…':'YOLA ÇIK'} <ArrowUpRight size={23}/></button></form><button className="leaderboard-link" onClick={()=>setScoresOpen(true)}><Trophy size={17}/> En iyi sürücüler</button><div className="sound-note"><Volume2 size={13}/> Gazı basılı tut. Yol ilerledikçe zorlaşır.</div><div className="start-bottom"><span><kbd>←</kbd> <kbd>→</kbd> şerit değiştir</span><span><kbd>↑</kbd> gaz · <kbd>↓</kbd> fren</span></div>{best>0&&<div className="best">Kişisel rekorun · {best.toLocaleString('tr-TR')} puan</div>}</div>}
    {ui.status==='paused'&&<div className="shade"><div className="result-panel"><span className="result-icon"><Pause/></span><div className="eyebrow">KISA BİR MOLA</div><h2>Bir nefes al.</h2><p>Çukurlar bir yere gitmiyor.<br/>Hazır olunca kaldığın yerden devam et.</p><button className="start-button" onClick={pause}>DEVAM ET <Play size={20}/></button><button className="text-button" disabled={starting} onClick={()=>void start()}><RotateCcw size={16}/> Baştan başla</button></div></div>}
    {ended&&<div className="shade"><div className="result-panel"><span className="result-icon">{ui.status==='won'?<Flag/>:<Wrench/>}</span><div className="eyebrow">{ui.status==='won'?'LEFKOŞA’YA HOŞ GELDİN':'SANAYİ MOLASI'}</div><h2>{ui.status==='won'?'Yol bitti. Tebrikler!':'Yol 1, amortisör 0.'}</h2><p>{ui.status==='won'?'Bu yolculuğun en güzel yanı, varabilmek.':'Araba pes etti. Sen etme.'}</p><strong className="result-score">{score.toLocaleString('tr-TR')} <small>PUAN</small></strong><div className="score-save" role="status">{saveStatus==='saving'?'Skorun kaydediliyor…':saveStatus==='saved'?`${nickname}, skorun kaydedildi.`:saveStatus==='offline'?'Bu tur çevrimdışı oynandı; skor tablosuna eklenemedi.':saveStatus==='error'?<button className="text-button" onClick={()=>void submitScore()}>Skoru kaydetmeyi tekrar dene</button>:null}</div><button className="leaderboard-link" onClick={()=>setScoresOpen(true)}><Trophy size={16}/> Skor tablosu</button><div className="result-stats"><span><b>{ui.distance.toFixed(1)}</b> km yol</span><span><b>{ui.dodged}</b> engel aşıldı</span><span><b>{ui.checkpoints}</b> güvenli kontrol</span></div><p className="result-message">Gerçek hayatta iyi bir yol,<br/>reflekslerinden daha çok şey kurtarır.</p><button className="start-button" disabled={starting} onClick={()=>void start()}>{starting?'HAZIRLANIYOR…':'BİR TUR DAHA'} <RotateCcw size={20}/></button></div></div>}
    {active&&ui.speed<1&&!ui.throttle&&!ui.brake&&<div className="gas-hint"><Gauge size={18}/><span>Hareket etmek için <b>GAZ</b> tuşunu basılı tut</span></div>}
    {active&&police&&<div className={`police-alert ${ui.speed<=35?'safe':''}`} role="status"><ShieldCheck size={21}/><span>{ui.speed<=35?'Hızın uygun. Böyle devam!':'Polis kontrolü! Frene basılı tut.'}<small>35 km/sa veya altıyla geç</small></span></div>}
    {active&&ui.messageTime>0&&<div className="game-message" role="status">{ui.message}</div>}
    <div className="scene-bottom"><span className="edition"><span/> ADA YOLLARI · BÖLÜM 01</span><span className="difficulty-badge">SEVİYE {level}<small>{['Isınma turu','Yol hızlanıyor','Dikkat kesil','Son düzlük'][level-1]}</small></span><div className={`speedometer ${ui.brake?'braking':''}`}><Gauge size={21}/><strong>{Math.round(ui.speed)}</strong><span>KM/SA<small>{ui.brake?'FREN':ui.throttle?'GAZ':ui.speed<1?'HAZIR':'SÜZÜLÜYOR'}</small></span></div></div>
   </section>
   <div className="journey"><div className="journey-title"><MapPin size={18}/><span>YOLCULUĞUN</span><strong>{ui.distance.toFixed(1)} <small>/ 30 km</small></strong></div><progress className="compact-progress" max={30} value={ui.distance} aria-label="Lefkoşa yolculuğu"/><div className="route-track"><div className="track-line"><div style={{width:`${ui.distance/30*100}%`}}/></div>{['Girne','Boğaz','Gönyeli','Lefkoşa'].map((name,i)=><div className={`track-stop ${i<=stage?'passed':''}`} key={name}><span>{i===3?<Flag size={11}/>:null}</span><small>{name}</small></div>)}</div></div>
   <DrivingControls state={ui} onSteer={steer} onPedal={pedal}/>
   {scoresOpen&&<Leaderboard onClose={()=>setScoresOpen(false)} player={nickname}/>}
   <footer data-release="ugavole-2026-09-06.3"><span>Çukurları oyunda atlatıyoruz. Gerçekte çözülmesini istiyoruz.</span><span>Güzergâhtan esinlenildi; mesafe, üç şerit ve olaylar oyunlaştırıldı. <a href="https://bub.gov.ct.tr/DA%C4%B0RE-VE-KURUMLAR/G%C4%B0RNE-L%C4%B0MAN-BA%C5%9EKANLI%C4%9EI/lefko%C5%9Fa-g%C4%B0rne-yolu-%C4%B0le-lefko%C5%9Fa-kuzey-199evre-yolunun-kes%C4%B0%C5%9Ft%C4%B0%C4%9F%C4%B0-noktada-%C4%B0n%C5%9Fa-ed%C4%B0lecek-olan-yonca-kav%C5%9Fa%C4%9Fin-yapim-199ali%C5%9Fmalari-ba%C5%9Fliyor" target="_blank" rel="noreferrer">Güzergâh kaynağı ↗</a></span></footer>
 </div>;
}
