
/* eslint-disable no-undef */
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

let environment = process.argv[2] || 'development';
let processPath = path.join('src', 'sysconfig', environment);
let targetPath = path.join('src', 'json_schemas');


fs.readdir(processPath, (err, files) => {
  if (err) {
    console.error('Cannot list the directory ', err);
    return;
  }

  files
    .filter(file => file.endsWith('.json'))
    .map(file => [path.join(processPath, file), path.parse(file).name + '.ts'])
    .forEach(([file, name]) => {
      const target = path.join(targetPath, name);
      const p = path.join('.', 'node_modules', '.bin', 'json-to-zod');
      exec(`${p} -s ${file} -t ${target}`, (error) => {
        if (error) {
          console.error(`${file} -> ${target} failed: ${error}`);
        } else {
          console.log(`${file} -> ${target} successful`);
        }
      });
    });
});

