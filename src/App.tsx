import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet
} from 'react-router-dom';
import './index.css';
import MergePDF from './pages/MergePDF';
import CompressPDF from './pages/CompressPDF';
import WordToPDF from './pages/WordToPDF';
import PDFToWord from './pages/PDFToWord';
import PDFToJPG from './pages/PDFToJPG';
import JPGToPDF from './pages/JPGToPDF';

const navItems = [
  {name: 'Home', path: '/'},
  {name: 'Merge PDF', path: '/merge-pdf'},
  {name: 'Split PDF', path: '/split-pdf'},
  {name: 'Compress PDF', path: '/compress-pdf'},
  {name: 'PDF to Word', path: '/pdf-to-word'},
  {name: 'PDF to PowerPoint', path: '/pdf-to-ppt'},
  {name: 'PDF to Excel', path: '/pdf-to-excel'},
  {name: 'Word to PDF', path: '/word-to-pdf'},
  {name: 'PowerPoint to PDF', path: '/ppt-to-pdf'},
  {name: 'Excel to PDF', path: '/excel-to-pdf'},
  {name: 'PDF to JPG', path: '/pdf-to-jpg'},
  {name: 'JPG to PDF', path: '/jpg-to-pdf'},
  {name: 'Edit PDF', path: '/edit-pdf'},
  {name: 'Rotate PDF', path: '/rotate-pdf'},
  {name: 'Sign PDF', path: '/sign-pdf'},
  {name: 'Watermark', path: '/watermark'},
  {name: 'HTML to PDF', path: '/html-to-pdf'},
  {name: 'Unlock PDF', path: '/unlock-pdf'},
  {name: 'Protect PDF', path: '/protect-pdf'},
  {name: 'Organize PDF', path: '/organize-pdf'},
  {name: 'PDF to PDF/A', path: '/pdf-to-pdfa'},
  {name: 'Repair PDF', path: '/repair-pdf'},
  {name: 'Page numbers', path: '/add-page-numbers'},
  {name: 'Scan to PDF', path: '/scan-to-pdf'},
  {name: 'OCR PDF', path: '/ocr-pdf'},
  {name: 'Compare PDF', path: '/compare-pdf'},
  {name: 'Redact PDF', path: '/redact-pdf'},
  {name: 'Crop PDF', path: '/crop-pdf'}
];

function Home() {
  return (
    <div>
      <section className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Fast, free, and privacy-focused. Merge, split, compress, convert, sign, edit, protect, and more — all in your browser, no uploads required.
        </p>
      </section>
      <section>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {navItems.slice(1).map(n => (
            <Link
              key={n.name}
              to={n.path}
              className="bg-white shadow group rounded-xl p-5 border border-gray-100 flex flex-col gap-3 hover:shadow-lg hover:border-[#f14d5d] transition"
            >
              <div className="h-10 w-10 rounded bg-[#f14d5d] flex items-center justify-center text-white text-lg font-bold">
                {n.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-base group-hover:text-[#f14d5d]">{n.name}</div>
                <p className="text-xs text-gray-600 mt-1">{n.name} PDF easily online.</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-30">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.svg" alt="PDF ProTools" className="h-9" />
      </Link>
      <nav className="hidden md:flex gap-4">
        {navItems.slice(1, 8).map(n => (
          <Link className="text-sm text-gray-700 hover:text-[#f14d5d]" key={n.name} to={n.path}>{n.name}</Link>
        ))}
        <div className="relative group">
          <button className="text-sm text-gray-700 hover:text-[#f14d5d]">All Tools ▾</button>
          <div className="absolute bg-white shadow border rounded mt-1 hidden group-hover:block z-50">
            {navItems.slice(8).map(n => (
              <Link className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100" key={n.name} to={n.path}>{n.name}</Link>
            ))}
          </div>
        </div>
      </nav>
      <Link className="bg-[#f14d5d] text-white px-5 py-2 rounded shadow hover:bg-[#d73746] transition" to="/merge-pdf">Start Now</Link>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#22223b] text-gray-200 py-8 px-2 mt-16">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" className="h-8" alt="PDF ProTools" />
          <span className="tracking-tight font-bold">PDF ProTools</span>
        </div>
        <p className="text-xs">© {new Date().getFullYear()} PDF ProTools.com – Free Online PDF Tools</p>
        <div className="flex gap-3">
          <a href="#" aria-label="Twitter" className="hover:text-[#f2c30a]">T</a>
          <a href="#" aria-label="Facebook" className="hover:text-[#4267B2]">F</a>
          <a href="#" aria-label="Instagram" className="hover:text-[#e1306c]">I</a>
        </div>
      </div>
    </footer>
  );
}

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc]">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/merge-pdf" element={<MergePDF />} />
          <Route path="/compress-pdf" element={<CompressPDF />} />
          <Route path="/word-to-pdf" element={<WordToPDF />} />
          <Route path="/pdf-to-word" element={<PDFToWord />} />
          <Route path="/pdf-to-jpg" element={<PDFToJPG />} />
          <Route path="/jpg-to-pdf" element={<JPGToPDF />} />
          {navItems.slice(2).filter(n => !['/compress-pdf','/word-to-pdf','/pdf-to-word','/pdf-to-jpg','/jpg-to-pdf'].includes(n.path)).map(n => (
            <Route key={n.name} path={n.path} element={<div className="py-10 text-center text-lg">{n.name} Page (Coming Soon)</div>} />
          ))}
        </Route>
      </Routes>
    </Router>
  );
}
