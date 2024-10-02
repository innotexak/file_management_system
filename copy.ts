import fs from 'fs'
import path from 'path'

// Specify the source and destination directories
const sourceDir = 'src/templates';
const destDir = 'dist/src/templates';

// Copy the files
const copyFiles = (source:string, destination:string) => {
    if (fs.existsSync(source)) {
        fs.mkdirSync(destination, { recursive: true });

        fs.readdirSync(source).forEach(file => {
            const sourcePath = path.join(source, file);
            const destPath = path.join(destination, file);

            if (fs.lstatSync(sourcePath).isDirectory()) {
                copyFiles(sourcePath, destPath);
            } else {
                fs.copyFileSync(sourcePath, destPath);
            }
        });
    }
};

copyFiles(sourceDir, destDir);
// console.log('Files copied successfully!');
