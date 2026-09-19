const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // Hero Gradients and dark backgrounds
  { from: /#1e0e0e/g, to: '#000000' },
  { from: /#2a1010/g, to: '#111111' },
  { from: /#3d1a1a/g, to: '#222222' },
  
  // Creams / Light Backgrounds -> Whites / Light Grays
  { from: /#f5f0e8/g, to: '#ffffff' },
  { from: /#ddd6c8/g, to: '#eaeaea' },
  { from: /#fdfaf5/g, to: '#fafafa' },
  { from: /rgba\(245,240,232/g, to: 'rgba(255,255,255' },
  
  // Gold/Brown accents -> Monochrome (Grays/Blacks)
  { from: /#b89a5e/g, to: '#777777' }, // Accents
  { from: /#7a6a50/g, to: '#666666' }, // Subtext
  { from: /#5a4a30/g, to: '#000000' }, // Bold text
  { from: /#8a8070/g, to: '#888888' }, // Subtle text
  { from: /#8a6a30/g, to: '#333333' }, // Links hover
  { from: /#e8e0d0/g, to: '#cccccc' }, // Light borders/tags
  
  // RGBA browns/creams
  { from: /rgba\(184,154,94/g, to: 'rgba(150,150,150' }, // Gold rgb
  { from: /rgba\(138,128,112/g, to: 'rgba(128,128,128' }, // Brownish text rgb
  { from: /rgba\(26,24,20/g, to: 'rgba(0,0,0' }, // Brownish overlays -> Black
  { from: /rgba\(240,235,224/g, to: 'rgba(255,255,255' }, // Creamish text rgb

  // Nav link hover background adjustment
  { from: /'#f5f0e8'/g, to: "'#ffffff'" },
  { from: /'#1e0e0e'/g, to: "'#000000'" }
];

replacements.forEach(({ from, to }) => {
  content = content.replace(from, to);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Theme successfully switched to Black & White!');
