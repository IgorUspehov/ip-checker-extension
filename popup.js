async function getIPInfo() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}
 
function getLocalIP() {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    pc.createOffer().then(o => pc.setLocalDescription(o));
    pc.onicecandidate = (e) => {
      if (!e || !e.candidate) return;
      const match = e.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
      if (match) { resolve(match[1]); pc.close(); }
    };
    setTimeout(() => resolve('N/A'), 3000);
  });
}
 
async function update() {
  const dot = document.getElementById('dot');
  const status = document.getElementById('status');
  const publicIP = document.getElementById('public-ip');
  const country = document.getElementById('country');
  const localIP = document.getElementById('local-ip');
 
  const online = navigator.onLine;
  dot.className = 'status-dot ' + (online ? 'online' : 'offline');
  status.textContent = online ? 'Online' : 'Offline';
 
  if (online) {
    const info = await getIPInfo();
    if (info) {
      publicIP.textContent = info.ip || 'N/A';
      country.textContent = (info.country_name || 'Unknown') + ' / ' + (info.city || '');
    } else {
      publicIP.textContent = 'Failed';
      country.textContent = 'Unknown';
    }
  }
 
  const lip = await getLocalIP();
  localIP.textContent = lip;
}
 
document.getElementById('refresh').addEventListener('click', update);
update();
 
