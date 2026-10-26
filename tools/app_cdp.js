'use strict';
const path = require('path');
const { spawnSync } = require('child_process');
const script = path.resolve(__dirname, '..', 'presentacion-web', 'ntp330', '0', 'pruebas', 'verificar-cdp.js');
const result = spawnSync(process.execPath, [script, ...process.argv.slice(2)], { stdio: 'inherit' });
if (result.error) console.error(result.error.message);
process.exit(result.status === null ? 1 : result.status);
