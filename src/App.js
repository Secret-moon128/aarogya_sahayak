import React, { useEffect, useMemo, useRef, useState } from "react";
/**
 * Aarogya Sahayak – Healthcare Mobile Application
 * Developed by CODE4CARE (C4C)
 * A comprehensive digital health solution for communities
 */

const storage = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  },
};

const encrypt = (text) => btoa(unescape(encodeURIComponent(text)));
const decrypt = (text) => {
  try { return decodeURIComponent(escape(atob(text))); } catch { return ""; }
};

const LANGS = {
  en: {
    app: "Aarogya Sahayak",
    tagline: "by CODE4CARE",
    consult: "Doctor Consult",
    medicine: "Medicine Finder",
    records: "Health Records",
    symptom: "Symptom Checker",
    speak: "Voice Navigation",
    sos: "EMERGENCY",
    offline: "Offline mode - actions will sync when connected",
    online: "Online",
    disasterOn: "Emergency Mode ON",
    disasterOff: "Emergency Mode OFF",
    voiceHint: "Say: 'Doctor', 'Medicine', 'Records', or 'Symptoms'",
    lastUpdated: "Last updated",
    refresh: "Refresh",
    noInternet: "No connection - showing cached data",
    queuePlaced: "Request queued. You'll be contacted when online.",
    startCall: "Video Call",
    startAudio: "Audio Call",
    schedule: "Schedule Later",
    confirm: "Confirm",
    queued: "Pending Requests",
    none: "None",
    addVisit: "Add Visit",
    doctorName: "Doctor name",
    notes: "Notes",
    save: "Save",
    sync: "Sync",
    synced: "Synced",
    otpLogin: "Login with Phone + OTP",
    phone: "Phone",
    sendOtp: "Send OTP",
    enterOtp: "Enter OTP",
    verify: "Verify",
    logout: "Logout",
    fever: "Do you have fever?",
    cough: "Do you have cough?",
    yes: "Yes",
    no: "No",
    advice1: "Likely viral fever. Rest, hydrate, consult if >3 days.",
    advice2: "Monitor symptoms. Consult if worsening.",
    emergencyHelp: "Emergency Help",
    callHelpline: "Call Helpline",
    smsOnly: "Sending emergency SMS",
  },
  hi: {
    app: "आरोग्य सहायक",
    consult: "डॉक्टर से बात करें",
    medicine: "दवाई",
    records: "स्वास्थ्य रिकॉर्ड",
    symptom: "लक्षण जाँच",
    speak: "आवाज नेविगेशन",
    sos: "आपातकाल",
    offline: "ऑफलाइन मोड - कनेक्शन आने पर सिंक होगा",
    online: "ऑनलाइन",
    disasterOn: "आपदा मोड चालू",
    disasterOff: "आपदा मोड बंद",
    voiceHint: "कहें: 'डॉक्टर', 'दवाई', 'रिकॉर्ड', 'लक्षण'",
    lastUpdated: "आखिरी अपडेट",
    refresh: "रिफ्रेश",
    noInternet: "नेट नहीं - कैश्ड डेटा दिख रहा है",
    queuePlaced: "अनुरोध कतार में। ऑनलाइन आने पर कॉल करेंगे।",
    startCall: "वीडियो कॉल",
    startAudio: "ऑडियो कॉल",
    schedule: "बाद में शेड्यूल",
    confirm: "कन्फर्म",
    queued: "लंबित अनुरोध",
    none: "कोई नहीं",
    addVisit: "विज़िट जोड़ें",
    doctorName: "डॉक्टर नाम",
    notes: "नोट्स",
    save: "सेव",
    sync: "सिंक",
    synced: "सिंक हो गया",
    otpLogin: "फोन + OTP से लॉगिन",
    phone: "फ़ोन",
    sendOtp: "OTP भेजें",
    enterOtp: "OTP डालें",
    verify: "वेरिफाई",
    logout: "लॉगआउट",
    fever: "क्या बुखार है?",
    cough: "क्या खाँसी है?",
    yes: "हाँ",
    no: "नहीं",
    advice1: "वायरल बुखार लगता है। आराम करें, पानी पिएं।",
    advice2: "लक्षण देखते रहें। बिगड़े तो डॉक्टर से मिलें।",
    emergencyHelp: "आपातकाल सहायता",
    callHelpline: "हेल्पलाइन कॉल",
    smsOnly: "आपातकाल SMS भेज रहे हैं",
  },
  pa: {         
    app: "ਆਰੋਗਿਆ ਸਹਾਇਕ",
    consult: "ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ",
    medicine: "ਦਵਾਈ ਲੱਭੋ",
    records: "ਸਿਹਤ ਰਿਕਾਰਡ",
    symptom: "ਲਛਣ ਜਾਂਚ",
    speak: "ਆਵਾਜ਼ ਨਾਲ ਨੇਵੀਗੇਸ਼ਨ",
    sos: "ਐਮਰਜੈਂਸੀ",
    offline: "ਆਫਲਾਈਨ ਮੋਡ - ਜੁੜਨ 'ਤੇ ਸਿੰਕ ਹੋਵੇਗਾ",
    online: "ਆਨਲਾਈਨ",
    disasterOn: "ਐਮਰਜੈਂਸੀ ਮੋਡ ਚਾਲੂ",
    disasterOff: "ਐਮਰਜੈਂਸੀ ਮੋਡ ਬੰਦ",
    voiceHint: "ਕਹੋ: 'ਡਾਕਟਰ', 'ਦਵਾਈ', 'ਰਿਕਾਰਡ', ਜਾਂ 'ਲਛਣ'",
    lastUpdated: "ਆਖਰੀ ਅੱਪਡੇਟ",
    refresh: "ਰੀਫਰੈਸ਼",
    noInternet: "ਕੋਈ ਕਨੈਕਸ਼ਨ ਨਹੀਂ - ਕੈਸ਼ਡ ਡਾਟਾ ਦਿਖਾਇਆ ਜਾ ਰਿਹਾ ਹੈ",
    queuePlaced: "ਰਿਕਵੇਸਟ ਕਤਾਰ ਵਿੱਚ। ਜੁੜਨ 'ਤੇ ਸੰਪਰਕ ਕੀਤਾ ਜਾਵੇਗਾ।",
    startCall: "ਵੀਡੀਓ ਕਾਲ",
    startAudio: "ਆਡੀਓ ਕਾਲ",
    schedule: "ਬਾਅਦ ਵਿੱਚ ਸ਼ਡਿਊਲ ਕਰੋ",
    confirm: "ਪੁਸ਼ਟੀ ਕਰੋ",
    queued: "ਬਕਾਇਆ ਬੇਨਤੀਆਂ",
    none: "ਕੋਈ ਨਹੀਂ",
    addVisit: "ਵਿਜ਼ਿਟ ਜੋੜੋ",
    doctorName: "ਡਾਕਟਰ ਦਾ ਨਾਂ",
    notes: "ਟਿੱਪਣੀਆਂ",
    save: "ਸੰਭਾਲੋ",
    sync: "ਸਿੰਕ ਕਰੋ",
    synced: "ਸਿੰਕ ਹੋ ਗਿਆ",
    otpLogin: "ਫੋਨ + ਓਟੀਪੀ ਨਾਲ ਲੌਗਇਨ ਕਰੋ",
    phone: "ਫ਼ੋਨ",
    sendOtp: "ਓਟੀਪੀ ਭੇਜੋ",
    enterOtp: "ਓਟੀਪੀ ਦਾਖਲ ਕਰੋ",
    verify: "ਤਸਦੀਕ ਕਰੋ",
    logout: "ਲੌਗਆਊਟ",
    fever: "ਕੀ ਤੁਹਾਨੂੰ ਬੁਖਾਰ ਹੈ?",
    cough: "ਕੀ ਤੁਹਾਨੂੰ ਖਾਂਸੀ ਹੈ?",
    yes: "ਹਾਂ",
    no: "ਨਹੀਂ",
    advice1: "ਸੰਭਵਤ: ਵਾਇਰਲ ਬੁਖਾਰ। ਆਰਾਮ ਕਰੋ, ਪਾਣੀ ਪੀਓ।",
    advice2: "ਲਛਣਾਂ 'ਤੇ ਨਿਗਰਾਨੀ ਕਰੋ। ਖਰਾਬ ਹੋਵੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।",
    emergencyHelp: "ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ",
    callHelpline: "ਹੈਲਪਲਾਈਨ ਕਾਲ ਕਰੋ",
    smsOnly: "ਐਮਰਜੈਂਸੀ SMS ਭੇਜ ਰਹੇ ਹਾਂ",
  },
};

const useOnline = () => {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);
  return online;
};

export default function App() {
  const [lang, setLang] = useState(storage.get("app_lang", "en"));
  const t = LANGS[lang];
  useEffect(() => storage.set("app_lang", lang), [lang]);

  const online = useOnline();
  const [screen, setScreen] = useState("home");
  const [disaster, setDisaster] = useState(storage.get("disaster_mode", false));
  useEffect(() => storage.set("disaster_mode", disaster), [disaster]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6">
        <Header lang={lang} setLang={setLang} t={t} online={online} disaster={disaster} setDisaster={setDisaster} />

        {screen === "home" && <Home t={t} goto={setScreen} />}
        {screen === "consult" && <Consult t={t} back={() => setScreen("home")} online={online} />}
        {screen === "medicine" && <Medicine t={t} back={() => setScreen("home")} online={online} />}
        {screen === "records" && <Records t={t} back={() => setScreen("home")} />}
        {screen === "symptom" && <Symptom t={t} back={() => setScreen("home")} />}
        {screen === "sos" && <SOS t={t} back={() => setScreen("home")} />}

        <VoiceNav t={t} onCommand={(cmd) => navigateByVoice(cmd, setScreen)} />
      </div>
    </div>
  );
}

function Header({ t, lang, setLang, online, disaster, setDisaster }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">C4C</span>
            <span className="text-green-500 text-xl ml-1">+</span>
          </div>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{t.app}</h1>
        </div>
        <p className="text-xs text-gray-500">
          {online ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {t.online}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              {t.offline}
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <select value={lang} onChange={(e)=>setLang(e.target.value)} className="rounded-xl border-2 border-gray-200 px-3 py-2 text-sm">
          <option value="en">EN</option>
          <option value="hi">हिं</option>
          <option value="pa">ਪੰ</option>
        </select>
        <button onClick={()=>setDisaster(!disaster)} className={`text-xs rounded-full px-3 py-2 font-medium ${disaster?"bg-red-100 text-red-700":"bg-green-100 text-green-700"}`}>
          {disaster ? t.disasterOn : t.disasterOff}
        </button>
      </div>
    </div>
  );
}

function Home({ t, goto }) {
  const Tile = ({ label, icon, to, colors }) => (
    <button onClick={()=>goto(to)} className={`rounded-2xl w-full h-32 bg-gradient-to-br ${colors} hover:scale-105 transition-all flex flex-col items-center justify-center gap-3 shadow-lg`}>
      <span className="text-4xl">{icon}</span>
      <span className="font-semibold text-white text-sm">{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Tile label={t.consult} icon="🩺" to="consult" colors="from-blue-500 to-blue-600" />
        <Tile label={t.medicine} icon="💊" to="medicine" colors="from-green-500 to-green-600" />
        <Tile label={t.records} icon="📋" to="records" colors="from-purple-500 to-purple-600" />
        <Tile label={t.symptom} icon="🤖" to="symptom" colors="from-orange-500 to-orange-600" />
      </div>

      <button onClick={()=>goto("sos")} className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-5 text-xl font-bold shadow-lg transition-all hover:scale-105">
        🚨 {t.sos}
      </button>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-l-4 border-amber-400">
        <p className="font-medium text-amber-800 mb-2">🎙️ {t.speak}</p>
        <p className="text-sm text-amber-700">{t.voiceHint}</p>
      </div>
    </div>
  );
}

function Consult({ t, back, online }) {
  const [queued, setQueued] = useState(storage.get("consult_queue", []));
  const [time, setTime] = useState("");

  const queue = (type) => {
    const item = { id: Date.now(), type, when: new Date().toISOString() };
    const updated = [...queued, item];
    setQueued(updated);
    storage.set("consult_queue", updated);
    alert(online ? `${type} scheduled!` : t.queuePlaced);
  };

  return (
    <Screen title={t.consult} back={back}>
      {!online && <Banner tone="amber" text={t.offline} />}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button onClick={()=>queue("Video")} className="rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white py-4 font-semibold">
          🎥 {t.startCall}
        </button>
        <button onClick={()=>queue("Audio")} className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 font-semibold">
          📞 {t.startAudio}
        </button>
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 mb-6">
        <p className="font-semibold mb-3">{t.schedule}</p>
        <input type="datetime-local" className="w-full rounded-xl border-2 border-gray-200 p-3" value={time} onChange={e=>setTime(e.target.value)} />
        <button onClick={()=>queue(`Scheduled ${time}`)} className="mt-3 w-full rounded-xl bg-gray-800 text-white px-4 py-2">
          {t.confirm}
        </button>
      </div>

      <div>
        <h3 className="font-semibold mb-3">{t.queued}</h3>
        {queued.length === 0 ? (
          <p className="text-sm text-gray-500">{t.none}</p>
        ) : (
          <ul className="space-y-3">
            {queued.map(q=> (
              <li key={q.id} className="bg-white rounded-xl border-2 border-gray-100 p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{q.type}</p>
                  <p className="text-xs text-gray-500">{new Date(q.when).toLocaleString()}</p>
                </div>
                <button onClick={()=>{
                  const next = queued.filter(x=>x.id!==q.id);
                  setQueued(next); storage.set("consult_queue", next);
                }} className="text-xs px-3 py-1 rounded-lg bg-gray-100">✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Screen>
  );
}

function Medicine({ t, back, online }) {
  const [cache, setCache] = useState(storage.get("meds_cache", { lastUpdated: 0, items: sampleMeds() }));

  const refresh = () => {
    const updated = { lastUpdated: Date.now(), items: sampleMeds() };
    setCache(updated);
    storage.set("meds_cache", updated);
  };

  return (
    <Screen title={t.medicine} back={back}>
      {!online && <Banner tone="blue" text={t.noInternet} />}

      <div className="flex justify-between items-center mb-4">
        <p className="text-xs text-gray-500">
          {t.lastUpdated}: {cache.lastUpdated ? new Date(cache.lastUpdated).toLocaleString() : "—"}
        </p>
        <button onClick={refresh} className="text-sm rounded-xl bg-gray-800 text-white px-3 py-1">
          {t.refresh}
        </button>
      </div>

      <ul className="space-y-3">
        {cache.items.map((p,i)=> (
          <li key={i} className="bg-white rounded-2xl border-2 border-gray-100 p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-gray-500">{p.place}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${p.available?"bg-green-100 text-green-800":"bg-red-100 text-red-700"}`}>
              {p.available?"✓ Available":"✗ Out of stock"}
            </span>
          </li>
        ))}
      </ul>
    </Screen>
  );
}

function sampleMeds(){
  return [
    { name: "Paracetamol 500mg", place: "City Hospital", available: true },
    { name: "ORS Sachet", place: "Medical Store", available: true },
    { name: "Amoxicillin 250mg", place: "Health Center", available: false },
  ];
}

function Records({ t, back }) {
  const [authed, setAuthed] = useState(storage.get("user_authed", false));
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const [patientName, setPatientName] = useState("");
  
  <input  
  name="patient"
  placeholder="Patient Name"
  className="w-full rounded-xl border-2 border-gray-200 px-3 py-2"
  required
  value={patientName}
  onChange={e => setPatientName(e.target.value)}
/>



  const [visits, setVisits] = useState(() => {
    const enc = storage.get("records_enc", null);
    if(!enc) return [];
    const plain = decrypt(enc);
    try { return JSON.parse(plain) } catch { return [] }
  });

  const [doctorName, setDoctorName] = useState("");

  const startVoiceInput = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input only works in Chrome/Edge.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-IN";
    rec.onresult = (e) => {
      const spokenText = e.results[0][0].transcript;
      setDoctorName(spokenText);
    };
    rec.start();
  };


  const persist = (data) => storage.set("records_enc", encrypt(JSON.stringify(data)));

  const addVisit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newVisit = {
      id: Date.now(),
      patient: patientName,
      doctor: doctorName,
      notes: form.get("notes"),
      date: new Date().toISOString(),
    };
    const next = [newVisit, ...visits];
    setVisits(next); persist(next);
    e.currentTarget.reset();
    setDoctorName("");
    setPatientName(""); 
  };

  if(!authed){
    return (
      <Screen title={t.records} back={back}>
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="font-semibold mb-3">{t.otpLogin}</p>
          <div className="flex gap-2 mb-3">
            <input placeholder={t.phone} value={phone} onChange={e=>setPhone(e.target.value)} className="flex-1 rounded-xl border-2 border-gray-200 px-3 py-2"/>
            <button onClick={()=>{ if(phone) setOtpSent(true); }} className="rounded-xl bg-gray-800 text-white px-4">
              {t.sendOtp}
            </button>
          </div>
          {otpSent && (
            <div className="flex gap-2">
              <input placeholder={t.enterOtp} value={otp} onChange={e=>setOtp(e.target.value)} className="flex-1 rounded-xl border-2 border-gray-200 px-3 py-2"/>
              <button onClick={()=>{ if(otp){ setAuthed(true); storage.set("user_authed", true); }}} className="rounded-xl bg-green-600 text-white px-4">
                {t.verify}
              </button>
            </div>
          )}
        </div>
      </Screen>
    );
  }

  return (
    <Screen title={t.records} back={back}>
      <form onSubmit={addVisit} className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-3">
        <p className="font-semibold">{t.addVisit}</p>
        <div className="flex items-center gap-2">
          <input
          name="doctor"
          placeholder={t.doctorName}
          className="flex-grow rounded-xl border-2 border-gray-200 px-3 py-2"
          required
          value={doctorName}
          onChange={e => setDoctorName(e.target.value)}
          />
          <button
          type="button"
          onClick={() => startVoiceInput()}
          className="rounded-xl bg-gray-200 px-3 py-2"
          title="Speak doctor name"
          >
            🎤
            </button>
            </div>
            <textarea name="notes" placeholder={t.notes} className="w-full rounded-xl border-2 border-gray-200 p-3" rows={3}></textarea>
            <button className="rounded-xl bg-gray-800 text-white px-4 py-2">{t.save}</button>
            </form>

      <div className="flex gap-2 mb-4">
        <button onClick={()=>alert(t.synced)} className="rounded-xl bg-green-600 text-white px-4 py-2">{t.sync}</button>
        <button onClick={()=>{ storage.set("user_authed", false); setAuthed(false); }} className="rounded-xl bg-gray-100 px-4 py-2">{t.logout}</button>
      </div>

      <ul className="space-y-3">
        {visits.length===0 && <p className="text-sm text-gray-500">{t.none}</p>}
        {visits.map(v=> (
          <li key={v.id} className="bg-white rounded-2xl border-2 border-gray-100 p-4">
            <p className="font-semibold">👨‍⚕️ {v.doctor}</p>
            <p className="text-xs text-gray-500">{new Date(v.date).toLocaleString()}</p>
            <p className="mt-2 whitespace-pre-wrap">{v.notes}</p>
          </li>
        ))}
      </ul>
    </Screen>
  );
}

function Symptom({ t, back }) {
  const [fever, setFever] = useState(null);
  const [cough, setCough] = useState(null);

  const advice = useMemo(() => {
    if (fever === true && cough === true) return t.advice1;
    if (fever !== null || cough !== null) return t.advice2;
    return null;
  }, [fever, cough, t]);

  return (
    <Screen title={t.symptom} back={back}>
      <Question text={t.fever} value={fever} set={setFever} t={t} />
      {fever !== null && <Question text={t.cough} value={cough} set={setCough} t={t} />}

      {advice && (
        <div className="bg-green-50 rounded-2xl border-2 border-green-200 p-4">
          <p className="font-semibold text-green-800">💡 {advice}</p>
        </div>
      )}
    </Screen>
  );
}

function Question({ text, value, set, t }){
  return (
    <div className="bg-gray-50 rounded-2xl p-4 mb-4">
      <p className="font-semibold mb-3">{text}</p>
      <div className="flex gap-3">
        <button onClick={()=>set(true)} className={`flex-1 rounded-xl py-3 font-medium ${value===true?"bg-green-600 text-white":"bg-white border-2 border-gray-200"}`}>
          {t.yes}
        </button>
        <button onClick={()=>set(false)} className={`flex-1 rounded-xl py-3 font-medium ${value===false?"bg-red-600 text-white":"bg-white border-2 border-gray-200"}`}>
          {t.no}
        </button>
      </div>
    </div>
  );
}

function SOS({ t, back }){
  const [log, setLog] = useState([]);
  const pushLog = (m) => setLog((x)=>[{ at: new Date().toLocaleTimeString(), m }, ...x]);

  const call = () => { pushLog(`${t.callHelpline}: 108`); window.location.href = "tel:108"; };
  const sms = () => { pushLog(t.smsOnly); };

  return (
    <Screen title={t.emergencyHelp} back={back}>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button onClick={call} className="rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white py-4 font-semibold">
          📞 {t.callHelpline}
        </button>
        <button onClick={sms} className="rounded-2xl bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 font-semibold">
          💬 SMS
        </button>
      </div>

      <div className="bg-gray-50 rounded-2xl p-4">
        <p className="font-semibold mb-3">Activity Log</p>
        {log.length===0 && <p className="text-sm text-gray-500">No activity</p>}
        <ul className="space-y-1">
          {log.map((l,i)=>(<li key={i} className="text-xs text-gray-600">[{l.at}] {l.m}</li>))}
        </ul>
      </div>
    </Screen>
  );
}


function VoiceNav({ t, onCommand }){
  const [active, setActive] = useState(false);

  const start = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ alert("Voice not supported"); return; }
    const rec = new SR();
    rec.lang = "en-IN";
    rec.onresult = (e)=>{
      const text = e.results[0][0].transcript.toLowerCase();
      onCommand(text);
      setActive(false);
    };
    rec.onend = ()=> setActive(false);
    rec.start();
    setActive(true);
  };

  return (
    <div className="mt-6 flex justify-between items-center">
      <p className="text-xs text-gray-500">{t.speak}</p>
      <button onClick={start} className={`rounded-full px-4 py-2 text-sm font-medium ${active?"bg-green-600 text-white":"bg-gray-100"}`}>
        🎙️
      </button>
    </div>
  );
}

function navigateByVoice(text, setScreen){
  const map = [
    [/doctor|consult/, "consult"],
    [/medicine|med/, "medicine"],
    [/record/, "records"],
    [/symptom/, "symptom"],
    [/sos|emergency/, "sos"],
  ];
  for(const [re, scr] of map){ if(re.test(text)) { setScreen(scr); return; } }
  alert("Try saying 'doctor', 'medicine', 'records', or 'symptoms'");
}

function Screen({ title, back, children }){
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={back} className="rounded-xl bg-gray-100 hover:bg-gray-200 px-3 py-2 transition-colors">←</button>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Banner({ tone = "amber", text }){
  const tones = {
    amber: "bg-amber-50 text-amber-900 border-amber-200",
    blue: "bg-blue-50 text-blue-900 border-blue-200",
    red: "bg-red-50 text-red-900 border-red-200",
  };
  return <div className={`mb-4 rounded-xl border-2 p-3 text-sm ${tones[tone]}`}>{text}</div>;
}