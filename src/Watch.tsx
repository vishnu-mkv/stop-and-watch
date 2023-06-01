import React, { useState, useEffect } from "react";

interface Lap {
  time: number;
  difference: number;
}

const Stopwatch: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [laps, setLaps] = useState<Lap[]>([]);

  useEffect(() => {
    if (running) {
      const id = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
      setIntervalId(id);
    } else {
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [running]);

  const handleStart = () => {
    setRunning(true);
    setLaps([]);
  };

  const handlePause = () => {
    setRunning(false);
  };

  const handleStop = () => {
    setRunning(false);
    setTime(0);
  };

  const handleReset = () => {
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    const lastLapTime = laps.length > 0 ? laps[laps.length - 1].time : 0;
    const lapTime = time - lastLapTime;
    setLaps((prevLaps) => [
      ...prevLaps,
      { time: lapTime, difference: lapTime - lastLapTime },
    ]);
  };

  return (
    <div className="h-screen flex bg-slate-800 flex-col justify-center items-center">
      <div className="p-4 rounded-md bg-gray-900 max-w-[600px] text-white w-full">
        <div className="text-4xl mb-8 text-center">{formatTime(time)}</div>
        <div className="space-x-4 flex justify-around">
          <button
            className="btn-primary"
            onClick={handleStart}
            disabled={running}
          >
            Start
          </button>
          <button
            className="btn-primary"
            onClick={handlePause}
            disabled={!running}
          >
            Pause
          </button>
          <button
            className="btn-primary"
            onClick={handleStop}
            disabled={!running}
          >
            Stop
          </button>
          <button className="btn-secondary" onClick={handleReset}>
            Reset
          </button>
          <button
            className="btn-secondary"
            onClick={handleLap}
            disabled={!running}
          >
            Lap
          </button>
        </div>
        {laps.length > 0 && (
          <ul className="mt-10 space-y-3">
            {laps.reverse().map((lap, index) => (
              <li
                key={index}
                className="flex justify-between w-100 p-2 rounded-md bg-gray-800 text-white"
              >
                <span>{(laps.length - index).toString().padStart(2, "0")}</span>
                <span>+{formatTime(lap.time)}</span>
                <span>{formatTime(lap.difference)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const formatTime = (time: number): string => {
  const milliseconds = (time % 1000)
    .toString()
    .padStart(3, "0")
    .substring(0, 2);
  const seconds = Math.floor((time / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time / (1000 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  const hours = Math.floor(time / (1000 * 60 * 60))
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

export default Stopwatch;
