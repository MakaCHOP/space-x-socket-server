import {Socket} from 'socket.io';
import axios from 'axios';
import {clearTimeout} from 'node:timers';
const cors = require('cors');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const PORT = 8000;
const socketIO = require('socket.io')(http, {
  cors: {origin: ['https://app.spxswap.com', 'https://webtelegram.vercel.app']},
});

const submitUrl = 'https://api.spxswap.com/api/data/get-data';

app.use(cors());

interface UserData {
  id: number;
  limit: number;
  speed: number;
  energy: number;
  score: number;
  last: number;
  socket: Socket;
  energyCalculator?: NodeJS.Timeout;
  workSubmitter?: NodeJS.Timeout;
}

function newUser(
  id: number,
  socket: Socket,
  energy: number,
  limit: number,
  speed: number
): UserData {
  const userData: UserData = {
    id: id,
    limit: limit,
    speed: speed,
    energy: energy,
    socket: socket,
    score: 0,
    last: 0,
  };
  userData.energyCalculator = setInterval(
    energyTracker,
    1000 / speed,
    userData
  );
  userData.workSubmitter = setInterval(submitWork, 5000, userData);
  return userData;
}

interface SubmitData {
  id: number;
  click: number;
  time: number;
  energy_time: number;
  lastEnergy: number;
}

interface initialData {
  id?: number;
  energy?: number;
  limit?: number;
  speed?: number;
}

interface tapData {
  level: number;
}

async function emitter(socket: Socket, event: string, data: number) {
  socket.emit(event, data);
}

async function energyTracker(userData: UserData) {
  if (userData.energy < userData.limit) {
    userData.energy = userData.energy + 1;
    userData.socket.emit('energy', userData.energy);
  }
}

async function tap(userData: UserData, level: number) {
  userData.energy = userData.energy - level;
  emitter(userData.socket, 'energy', userData.energy);
  emitter(userData.socket, 'top', level);
}

async function updateClient(data: SubmitData) {
  await axios.post(submitUrl, data);
}

socketIO.on('connection', (socket: Socket) => {
  let userData: UserData;
  let flag = false;

  socket.on('id', (data: initialData) => {
    if (data?.id && data?.energy && data?.limit && data?.speed && !flag) {
      flag = true;
      userData = newUser(data.id, socket, data.energy, data.limit, data.speed);
    }
  });

  socket.on('tap', (data: tapData) => {
    if (userData.energy >= data.level) {
      tap(userData, data.level).then(() => {
        userData.last = Date.now();
        userData.score = userData.score + data.level;
      });
    } else {
      emitter(socket, 'top', 0).then(() => {});
    }
  });

  socket.on('submit', () => {
    submitWork(userData);
  });

  socket.on('disconnect', () => {
    submitWork(userData);
    clearTimeout(userData.energyCalculator);
    clearTimeout(userData.workSubmitter);
    socket.disconnect();
  });
});

function submitWork(userData: UserData) {
  const nowTime = Math.trunc(Date.now() / 1000);
  if (userData?.last) {
    updateClient({
      id: userData.id,
      click: userData.score,
      time: Math.trunc(userData.last / 1000),
      energy_time: nowTime,
      lastEnergy: userData.energy,
    }).then(() => {
      userData.score = 0;
    });
  } else if (userData?.id) {
    updateClient({
      id: userData.id,
      click: userData.score,
      time: nowTime,
      energy_time: nowTime,
      lastEnergy: userData.energy,
    }).then(() => {
      userData.score = 0;
    });
  }
}

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
