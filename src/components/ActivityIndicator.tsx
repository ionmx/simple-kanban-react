export const ActivityIndicator = () => {
  return (
    <div className="flex h-3 w-3">
      <div id="activity-ping" className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
      <div id="activity-dot" className="relative inline-flex rounded-full h-3 w-3 bg-gray-200"></div>
    </div>
  );
}

export const activityIndicatorOn = () => {
  const ping = document.getElementById('activity-ping');
  const dot = document.getElementById('activity-dot');
  
  dot?.classList.remove('bg-gray-200');
  dot?.classList.add('bg-green-400');
  ping?.classList.add('animate-ping');
}

export const activityIndicatorOff = () => {
  const ping = document.getElementById('activity-ping');
  const dot = document.getElementById('activity-dot');

  ping?.classList.remove('animate-ping');
  dot?.classList.remove('bg-green-400');
  dot?.classList.add('bg-gray-200');
}