import { firebaseConfig, ownerUid } from "./firebase-config.js";
const status = document.getElementById("cloud-status");
const box = document.getElementById("cloud-controls");
const btn = document.getElementById("cloud-login");
const signout = document.getElementById("cloud-logout");
const KEY = "sls-thanksgiving-2026-github-v1";
const enabled = firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.authDomain && firebaseConfig.appId && ownerUid;
if (!enabled) {
  status.textContent = "클라우드 동기화 미설정 · 이 기기에서만 저장됩니다";
  btn.hidden = true; signout.hidden = true;
} else {
  try {
    const [{initializeApp},{getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut},
      {getFirestore,doc,getDoc,setDoc}] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js")
    ]);
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app), db = getFirestore(app);
    const ref = doc(db, "thanksgiving", "dashboard-2026");
    let loggedIn = false, busy = false, pending = null, saveTimer = null, remoteVersion = "";
    status.textContent = "클라우드 로그인 필요 · 아직 기기 간 동기화되지 않습니다";
    btn.onclick = async () => { try { await signInWithPopup(auth,new GoogleAuthProvider()); }
      catch(e){status.textContent="로그인 실패: "+e.message;} };
    signout.onclick = async () => {await signOut(auth);};
    function valid(value) {return value && Array.isArray(value.items) && Array.isArray(value.plans);}
    function local(){try{return JSON.parse(localStorage.getItem(KEY))}catch{return null}}
    async function save(value){
      if(!loggedIn || !valid(value)) return;
      if(busy){pending=value;return;}
      busy=true;status.textContent="클라우드 저장 중…";
      try { await setDoc(ref,{data:value,updatedAt:new Date().toISOString()});
        status.textContent="클라우드 저장 완료 · "+new Date().toLocaleTimeString("ko-KR");
      } catch(e){status.textContent="클라우드 저장 실패 · 이 기기 백업만 유지: "+e.message;}
      finally{busy=false;if(pending){const next=pending;pending=null;await save(next)}}
    }
    window.addEventListener("thanksgiving-data-saved",e=>{
      if(!loggedIn || !valid(e.detail))return;
      window.clearTimeout(saveTimer);
      saveTimer=window.setTimeout(()=>save(e.detail),650);
    });
    onAuthStateChanged(auth,async user=>{
      loggedIn=false;
      if(!user){btn.hidden=false;signout.hidden=true;status.textContent="클라우드 로그인 필요 · 기기 간 동기화 안 됨";return;}
      if(user.uid!==ownerUid){status.textContent="허용된 관리자 계정이 아닙니다";btn.hidden=true;signout.hidden=false;return;}
      btn.hidden=true;signout.hidden=false;status.textContent="클라우드 기록 확인 중…";
      try {
        const snapshot=await getDoc(ref), current=local();
        if(snapshot.exists()){
          const remote=snapshot.data().data;
          if(!valid(remote)) throw Error("클라우드 데이터 형식 오류");
          const remoteDate=Date.parse(remote.updatedAt||"1970-01-01");
          const localDate=Date.parse(current?.updatedAt||"1970-01-01");
          if(remoteDate>localDate && JSON.stringify(remote)!==JSON.stringify(current)){
            localStorage.setItem(KEY,JSON.stringify(remote));
            status.textContent="최신 기록 복원 · 화면 다시 여는 중";
            location.reload();return;
          }
          if(localDate>remoteDate && valid(current)) {
            // Do not silently overwrite a newer remote record that this session has not inspected.
            status.textContent="기기 기록이 더 최신입니다 · 백업 후 확인이 필요합니다";
            loggedIn=true;return;
          }
        }else if(valid(current)){
          await setDoc(ref,{data:current,updatedAt:new Date().toISOString()});
        }
        loggedIn=true;status.textContent="클라우드 동기화 연결됨";
      }catch(e){status.textContent="클라우드 기록 불러오기 실패: "+e.message;}
    });
  } catch(e) {status.textContent="클라우드 기능 로드 실패: "+e.message;}
}
