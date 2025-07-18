

export function logEvent(eventType , details = {}){
    const logRecord = {
        eventType,
        ...details,
        timestamp: new Date().toISOString(),
    };
    let currentLogs = [];
    try{
        currentLogs = JSON.parse(localStorage.getItem('logs') || '[]');
        if(!Array.isArray(currentLogs)) currentLogs = [];
    } catch(err){
        currentLogs = [];
    }
    currentLogs.push(logRecord);
    localStorage.setItem('logs', JSON.stringify(currentLogs));
}