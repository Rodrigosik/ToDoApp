const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Limpiando archivos...\n');

// Eliminar package-lock.json
const lockFile = path.join(__dirname, '..', 'package-lock.json');
if (fs.existsSync(lockFile)) {
  fs.unlinkSync(lockFile);
  console.log('✓ package-lock.json eliminado');
} else {
  console.log('⚠ package-lock.json no encontrado');
}

// Eliminar carpeta freya en node_modules
const freyaPath = path.join(__dirname, '..', 'node_modules', 'freya');
if (fs.existsSync(freyaPath)) {
  fs.rmSync(freyaPath, { recursive: true, force: true });
  console.log('✓ node_modules/freya eliminado');
} else {
  console.log('⚠ node_modules/freya no encontrado');
}

console.log('\n📦 Instalando dependencias...\n');

// Ejecutar npm install
try {
  execSync('npm i --legacy-peer-deps', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });
  console.log('\n✅ Instalación completada');
} catch (error) {
  console.error('\n❌ Error en la instalación:', error.message);
  process.exit(1);
}
