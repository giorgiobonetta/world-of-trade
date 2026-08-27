import fs from 'node:fs';
global.window={}; new Function(fs.readFileSync('./curriculum.js','utf8'))();
let ls=0, ex=0; for(const u of window.CURRICULUM){ls+=u.lessons.length; for(const l of u.lessons) ex+=l.exercises.length;}
console.log(window.CURRICULUM.length,ls,ex,window.CURRICULUM.map(u=>[u.id,u.title,u.lessons.length]));
