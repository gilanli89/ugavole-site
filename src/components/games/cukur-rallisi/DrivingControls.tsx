import { ArrowLeft, ArrowRight, ChevronsUp, Square } from 'lucide-react';
import type { GameState } from './game';

export type Pedal = 'brake' | 'throttle';

type Props = {
  state: GameState;
  onSteer: (direction: number) => void;
  onPedal: (pedal: Pedal, pressed: boolean, source: string) => void;
};

export default function DrivingControls({ state, onSteer, onPedal }: Props) {
  const active = state.status === 'playing';
  return (
    <div className="controls-row" aria-label="Sürüş kontrolleri">
      <div className="steering-group" role="group" aria-label="Direksiyon">
        <div className="control-caption">
          <span>DİREKSİYON</span>
          <span className="lane-indicator" aria-label={`${state.lane + 1}. şerit`}>
            {[0, 1, 2].map(lane => <i key={lane} data-current={state.lane === lane} />)}
          </span>
        </div>
        <div className="steering-buttons">
          {([-1, 1] as const).map(direction => (
            <button
              key={direction}
              className="steer-button"
              aria-label={direction < 0 ? 'Sola geç' : 'Sağa geç'}
              aria-keyshortcuts={direction < 0 ? 'ArrowLeft A' : 'ArrowRight D'}
              disabled={!active}
              onPointerDown={event => {
                if (event.pointerType === 'mouse' && event.button !== 0) return;
                event.preventDefault();
                event.currentTarget.setPointerCapture(event.pointerId);
                onSteer(direction);
              }}
              // Assistive technology and keyboard activation still use a click.
              onClick={event => { if (event.detail === 0) onSteer(direction); }}
              onContextMenu={event => event.preventDefault()}
            >
              {direction < 0 ? <ArrowLeft size={30} strokeWidth={2.6} /> : <ArrowRight size={30} strokeWidth={2.6} />}
              <span>{direction < 0 ? 'SOL' : 'SAĞ'}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="pedal-group" role="group" aria-label="Hız ve durma">
        <div className="control-caption"><span>HIZ KONTROLÜ</span><small>Basılı tut</small></div>
        <div className="pedal-buttons">
          {(['brake', 'throttle'] as const).map(pedal => (
            <button
              key={pedal}
              className={`pedal-button ${pedal === 'brake' ? 'brake-button' : 'gas-button'}`}
              aria-label={pedal === 'brake' ? 'Fren yap ve dur' : 'Gaz ver ve hızlan'}
              aria-keyshortcuts={pedal === 'brake' ? 'ArrowDown S Space' : 'ArrowUp W'}
              aria-pressed={state[pedal]}
              disabled={!active}
              onPointerDown={event => {
                if (event.pointerType === 'mouse' && event.button !== 0) return;
                event.preventDefault();
                event.currentTarget.setPointerCapture(event.pointerId);
                onPedal(pedal, true, `pointer:${event.pointerId}`);
              }}
              onPointerUp={event => onPedal(pedal, false, `pointer:${event.pointerId}`)}
              onPointerCancel={event => onPedal(pedal, false, `pointer:${event.pointerId}`)}
              onLostPointerCapture={event => onPedal(pedal, false, `pointer:${event.pointerId}`)}
              onKeyDown={event => {
                if (event.key !== ' ' && event.key !== 'Enter') return;
                event.preventDefault();
                event.stopPropagation();
                onPedal(pedal, true, `key:${event.code}`);
              }}
              onKeyUp={event => {
                if (event.key !== ' ' && event.key !== 'Enter') return;
                event.preventDefault();
                onPedal(pedal, false, `key:${event.code}`);
              }}
              onBlur={() => {
                onPedal(pedal, false, 'key:Space');
                onPedal(pedal, false, 'key:Enter');
              }}
              onClick={event => {
                // Screen readers activate controls with a synthetic click.
                if (event.detail === 0) onPedal(pedal, !state[pedal], 'assistive');
              }}
              onContextMenu={event => event.preventDefault()}
            >
              {pedal === 'brake' ? <Square size={22} fill="currentColor" /> : <ChevronsUp size={30} strokeWidth={2.8} />}
              <strong>{pedal === 'brake' ? 'DUR' : 'GAZ'}</strong>
              <small>{pedal === 'brake' ? 'FREN' : 'HIZLAN'}</small>
            </button>
          ))}
        </div>
      </div>
      <p className="keyboard-hint"><kbd>←</kbd><kbd>→</kbd> yön <kbd>↑</kbd> gaz <kbd>↓</kbd> / <kbd>BOŞLUK</kbd> fren</p>
    </div>
  );
}
