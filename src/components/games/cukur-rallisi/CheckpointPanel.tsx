import {
  FileCheck2,
  Phone,
  ShieldCheck,
  Wind,
  Check,
  LockKeyhole,
  Coins,
} from "lucide-react";
import {
  DOCUMENTS,
  checkpointVariant,
  canShowDocuments,
  isExpired,
  type GameState,
} from "./game";
import { totalScore, type Action } from "./replay";

export default function CheckpointPanel({
  state: s,
  onAction,
}: {
  state: GameState;
  onAction: (action: Action) => void;
}) {
  const variant = checkpointVariant(s);
  const busy = s.police !== "documents";
  const calling = s.police === "calling";
  const ready = canShowDocuments(s);
  const requiredExpired = variant.required.some((id) => isExpired(s, id));
  return (
    <div className="shade checkpoint-shade">
      <section
        className="checkpoint-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkpoint-title"
      >
        <header className="checkpoint-header">
          <span className="checkpoint-emblem">
            <ShieldCheck size={24} />
          </span>
          <span>
            <small>
              KONTROL {s.checkpoints + 1} / {s.plan.checkpoints.length}
            </small>
            <h2 id="checkpoint-title">
              {calling ? "Amed abi aranıyor…" : variant.name}
            </h2>
          </span>
          <span className="checkpoint-wallet">
            <Coins size={16} />
            {totalScore(s).toLocaleString("tr-TR")}
            <small>PUAN</small>
          </span>
        </header>
        <p className="officer-quote">
          “
          {calling
            ? "Memur bey, bir saniye. Telefonu size vereyim…"
            : variant.quote}
          ”
        </p>
        {busy ? (
          <div
            className={`inspection-progress ${calling ? "is-calling" : ""}`}
            role="status"
          >
            {calling ? (
              <Phone size={36} />
            ) : s.police === "task" && variant.task === "breath" ? (
              <Wind size={36} />
            ) : (
              <FileCheck2 size={36} />
            )}
            <strong>
              {calling
                ? "Çalıyor… Açtı. ‘Ver memura.’"
                : s.police === "checking"
                  ? "Evraklar inceleniyor…"
                  : variant.task === "breath"
                    ? "Üfleniyor…"
                    : "Kemer takılıyor…"}
            </strong>
            <progress
              aria-label="Kontrol ilerlemesi"
              value={s.checkTime}
              max={calling ? 2.4 : s.police === "task" ? 1.6 : variant.duration}
            />
            <small>
              {calling
                ? "Telefon jokeri kullanıldı · Bu tur bir kez"
                : "Birazdan yola devam."}
            </small>
          </div>
        ) : (
          <>
            <div className="paperwork-heading">
              <span>EVRAK CÜZDANI</span>
              <small>Süreler bu turdaki km’ye göre işler.</small>
            </div>
            <div className="paperwork-list">
              {DOCUMENTS.map((doc) => {
                const expired = isExpired(s, doc.id);
                const required = variant.required.includes(doc.id);
                return (
                  <div
                    className="paperwork-item"
                    key={doc.id}
                    data-expired={expired}
                  >
                    <span className="paperwork-icon">
                      <FileCheck2 size={19} />
                    </span>
                    <span className="paperwork-detail">
                      <strong>
                        {doc.name}
                        {required && <i>İSTENİYOR</i>}
                      </strong>
                      <small>
                        {expired
                          ? "Süresi doldu · Yenileme gerekli"
                          : `${(s.documents[doc.id] - s.distance).toFixed(1)} km daha geçerli`}
                      </small>
                    </span>
                    {expired ? (
                      <button
                        type="button"
                        className="renew-button"
                        onClick={() => onAction(`renew-${doc.id}`)}
                        aria-label={`${doc.name} yenile, ${doc.price} puan`}
                      >
                        <b>{doc.price} puan</b>
                        <span>YENİLE</span>
                      </button>
                    ) : (
                      <span className="valid-document">
                        <Check size={16} /> Geçerli
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <small className="paperwork-note">
              Yenilemeler oyun puanıyla alınır. Puanın yetmezse kalan bedel bu
              turdaki kazancından düşülür.
            </small>
            {variant.task && (
              <button
                type="button"
                className="inspection-task"
                disabled={s.taskDone}
                onClick={() => onAction("inspection")}
              >
                {s.taskDone ? (
                  <Check size={18} />
                ) : variant.task === "breath" ? (
                  <Wind size={18} />
                ) : (
                  <LockKeyhole size={18} />
                )}
                {s.taskDone
                  ? variant.task === "breath"
                    ? "0.00 promil · Kontrol tamam"
                    : "Kemer takılı · Kontrol tamam"
                  : variant.task === "breath"
                    ? "Üfle · Alkol kontrolünü tamamla"
                    : "Emniyet kemerini tak"}
              </button>
            )}
            <button
              className="start-button paperwork-submit"
              disabled={!ready}
              onClick={() => onAction("documents")}
            >
              {ready
                ? "EVRAKLARI GÖSTER · +250"
                : requiredExpired
                  ? "İSTENEN EVRAKLARI YENİLE"
                  : "ÖNCE KONTROLÜ TAMAMLA"}
              <FileCheck2 size={19} />
            </button>
            <div className="phone-joker-row">
              <button
                className="phone-joker"
                disabled={s.phoneUsed}
                onClick={() => onAction("call-friend")}
              >
                <Phone size={20} />
                <span>
                  <strong>amed abiyi tanıng?</strong>
                  <small>
                    {s.phoneUsed
                      ? "Bu turdaki hakkın kullanıldı"
                      : "Ara, kontrolü geç · 1 telefon jokeri"}
                  </small>
                </span>
                <b>{s.phoneUsed ? "0/1" : "1/1"}</b>
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
