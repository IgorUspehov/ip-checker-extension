async function getPublicIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
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
      if (match) {
        resolve(match[1]);
        pc.close();
      }
    };
    setTimeout(() => resolve('Not available'), 3000);
  });
}

async function update() {
  const dot = document.getElementById('dot');
  const status = document.getElementById('status');
  const publicIP = document.getElementById('public-ip');
  const localIP = document.getElementById('local-ip');

  const online = navigator.onLine;
  dot.className = 'status-dot ' + (online ? 'online' : 'offline');
  status.textContent = online ? 'Online' : 'Offline';

  if (online) {
    const ip = await getPublicIP();
    publicIP.textContent = ip || 'Failed to load';
    publicIP.className = 'card-value';
  } else {
    publicIP.textContent = 'No connection';
    publicIP.className = 'card-value';
  }

  const lip = await getLocalIP();
  localIP.textContent = lip;
}

document.getElementById('refresh').addEventListener('click', update);
update();
