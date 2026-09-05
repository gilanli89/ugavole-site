import type { GameState } from './game';

/** Audio is created only from a user's play / unmute gesture. */
export class DrivingSound {
 readonly context: AudioContext;
 private master: GainNode;
 private meter: AnalyserNode;
 private samples = new Float32Array(512);
 private engine: OscillatorNode[] = [];
 private engineGain: GainNode;
 private roadGain: GainNode;
 private brakeGain: GainNode;
 private siren: OscillatorNode;
 private sirenGain: GainNode;
 private noise: AudioBuffer;
 private sources: AudioScheduledSourceNode[] = [];
 private muted = false;
 constructor() {
  const a=this.context=new AudioContext();
  this.master=a.createGain();this.master.gain.value=.6;this.meter=a.createAnalyser();this.meter.fftSize=512;this.master.connect(this.meter);this.meter.connect(a.destination);
  this.engineGain=a.createGain();this.engineGain.gain.value=0;
  const filter=a.createBiquadFilter();filter.type='lowpass';filter.frequency.value=420;this.engineGain.connect(filter);filter.connect(this.master);
  for(const harmonic of [1,2,3]){const o=a.createOscillator();o.type=harmonic===1?'triangle':'sawtooth';o.frequency.value=40*harmonic;const g=a.createGain();g.gain.value=.24/harmonic;o.connect(g);g.connect(this.engineGain);o.start();this.engine.push(o);this.sources.push(o);}
  this.noise=a.createBuffer(1,a.sampleRate*2,a.sampleRate);const data=this.noise.getChannelData(0);let brown=0;for(let i=0;i<data.length;i++){brown=(brown+.025*(Math.random()*2-1))/1.025;data[i]=brown*4;}
  const bed=(frequency:number)=>{const src=a.createBufferSource();src.buffer=this.noise;src.loop=true;const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=frequency;f.Q.value=.6;const gain=a.createGain();gain.gain.value=0;src.connect(f);f.connect(gain);gain.connect(this.master);src.start();this.sources.push(src);return gain;};
  this.roadGain=bed(600);this.brakeGain=bed(1900);
  this.siren=a.createOscillator();this.siren.type='sine';this.siren.frequency.value=600;this.sirenGain=a.createGain();this.sirenGain.gain.value=0;this.siren.connect(this.sirenGain);this.sirenGain.connect(this.master);this.siren.start();this.sources.push(this.siren);
 }
 status(){this.meter.getFloatTimeDomainData(this.samples);let energy=0;for(const sample of this.samples)energy+=sample*sample;return {state:this.muted?'muted':this.context.state,level:Math.sqrt(energy/this.samples.length)};}
 resume(){void this.context.resume().catch(()=>{});}
 setMuted(muted:boolean){this.muted=muted;this.master.gain.setTargetAtTime(muted?0:.6,this.context.currentTime,.035);if(!muted)this.resume();}
 quiet(){const t=this.context.currentTime;for(const gain of [this.engineGain,this.roadGain,this.brakeGain,this.sirenGain])gain.gain.setTargetAtTime(0,t,.025);}
 update(s:GameState){
  if(s.status!=='playing'){this.quiet();return;}
  const t=this.context.currentTime;const speed=s.speed/110;const rpm=34+speed*55+(s.brake?0:Math.sin(s.elapsed*9)*1.3);
  this.engine.forEach((o,i)=>o.frequency.setTargetAtTime(rpm*(i+1),t,.1));this.engineGain.gain.setTargetAtTime(.22+speed*.35,t,.1);
  this.roadGain.gain.setTargetAtTime(speed*.32,t,.1);this.brakeGain.gain.setTargetAtTime(s.brake&&s.speed>32?.18:0,t,.09);
  const checkpoint=s.objects.find(o=>o.type==='police'&&!o.done&&o.z<.65);this.sirenGain.gain.setTargetAtTime(checkpoint?.025:0,t,.15);this.siren.frequency.setTargetAtTime(630+Math.sin(s.elapsed*7)*150,t,.035);
 }
 effect(kind:'hit'|'repair'|'win'|'lose'|'start'|'checkpoint'){
  if(this.muted)return;const a=this.context,t=a.currentTime;
  if(kind==='hit'){
   const n=a.createBufferSource();n.buffer=this.noise;const g=a.createGain();g.gain.setValueAtTime(.8,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);n.connect(g);g.connect(this.master);n.start();n.stop(t+.31);n.onended=()=>{n.disconnect();g.disconnect();};
  }
  const notes=kind==='win'?[392,494,587,784]:kind==='repair'?[660,880]:kind==='checkpoint'?[440,660]:kind==='lose'?[220,165,110]:kind==='hit'?[75,42]:[196,294,392];
  notes.forEach((f,i)=>{const o=a.createOscillator(),g=a.createGain(),at=t+i*.11;o.type=kind==='hit'?'triangle':'sine';o.frequency.value=f;g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(kind==='hit'?.4:.14,at+.012);g.gain.exponentialRampToValueAtTime(.001,at+.26);o.connect(g);g.connect(this.master);o.start(at);o.stop(at+.28);o.onended=()=>{o.disconnect();g.disconnect();};});
 }
 close(){for(const source of this.sources){try{source.stop();source.disconnect();}catch{}}void this.context.close().catch(()=>{});}
}
