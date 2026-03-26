const fs = require('fs');

const path = 'src/App.tsx';
const code = fs.readFileSync(path, 'utf-8');
const lines = code.split('\n');

// Line 40 is 1-indexed, so 0-indexed is 39
// Line 681 is 1-indexed, so 0-indexed is 680
// We want to delete indices 39 to 680 inclusive.
// Count to delete = 680 - 39 + 1 = 642

lines.splice(39, 642);

// Inject imports around line 39 (which was index 39)
const imports = `import SectionHeading from './components/SectionHeading';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';

`;

lines.splice(39, 0, imports);

// We should also replace the `<SectionHeading` inside `Infrastructure`, `HsnCodes`, `HowItWorks`, `EnquiryForm`, `Footer` ?
// Wait, we just imported `SectionHeading`, so the existing usages in `Infrastructure` etc will work perfectly!

fs.writeFileSync(path, lines.join('\n'));
console.log('App.tsx updated successfully.');
