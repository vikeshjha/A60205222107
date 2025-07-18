export function logEvent(eventType, details = {}) {
  const logEntry = {
    eventType,
    ...details,
    timestamp: new Date().toISOString(),
  };
  
  let logs = [];
  try {
    logs = JSON.parse(localStorage.getItem('affordmedLogs') || '[]');
    if (!Array.isArray(logs)) logs = [];
  } catch (err) {
    logs = [];
  }
  
  logs.push(logEntry);
  localStorage.setItem('affordmedLogs', JSON.stringify(logs));
}

export function getLogs() {
  try {
    return JSON.parse(localStorage.getItem('affordmedLogs') || '[]');
  } catch (err) {
    return [];
  }
}

export function clearLogs() {
  localStorage.removeItem('affordmedLogs');
}
