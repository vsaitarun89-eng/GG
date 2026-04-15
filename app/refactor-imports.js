import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function refactorImports(filePath) {
  if (!filePath.endsWith('.jsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Replace relative imports looking for components, ui, contexts, assets
  // Examples: '../components/' -> '@/components/', '../../components' -> '@/components'
  // './components' isn't problematic if it exists locally, but replacing it globally usually works if we want absolute.
  
  content = content.replace(/from\s+['"](?:\.\.\/)+components\/(.*?)['"]/g, "from '@/components/$1'");
  content = content.replace(/from\s+['"](?:\.\.\/)+ui\/(.*?)['"]/g, "from '@/components/ui/$1'");
  content = content.replace(/from\s+['"](?:\.\.\/)+assets\/(.*?)['"]/g, "from '@/assets/$1'");
  content = content.replace(/from\s+['"]\.\.\/\.\.\/components\/(.*?)['"]/g, "from '@/components/$1'");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${filePath}`);
  }
}

walkDir(path.resolve('./src/features'), refactorImports);
console.log('Import refactoring completed.');
