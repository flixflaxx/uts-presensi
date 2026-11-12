import { useState } from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PASTEL_VARIANTS } from '../config/theme';

export default function LibraryPage() {
  const { state, searchQuery, toggleBorrowBook } = useApp();
  const [cat, setCat] = useState('Semua');
  const q = searchQuery.trim().toLowerCase();

  const categories = ['Semua', ...new Set(state.libraryBooks.map((b) => b.category))];

  const books = state.libraryBooks.filter((b) => {
    if (cat !== 'Semua' && b.category !== cat) return false;
    if (q && !b.title.toLowerCase().includes(q) && !b.author.toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Perpustakaan Digital & Buku Paket</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pinjam buku ajar, modul praktikum, dan referensi kejuruan SMK
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              cat === c
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => {
          const variant = PASTEL_VARIANTS[book.coverColor] || PASTEL_VARIANTS.purple;
          return (
            <div
              key={book.id}
              className={`rounded-2xl border p-4 shadow-sm flex flex-col justify-between gap-4 ${variant.card}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-14 rounded-xl ${variant.iconBg} text-white flex items-center justify-center shrink-0 shadow-sm`}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${variant.softBg}`}>
                    {book.category}
                  </span>
                  <h3 className="mt-1 text-sm font-extrabold text-slate-900 leading-snug">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{book.author}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-black/5">
                <div className="text-[11px] font-semibold text-slate-600">
                  {book.borrowedByUser ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dipinjam (s/d {book.dueDate})
                    </span>
                  ) : (
                    <span>Tersedia: {book.stock} eksemplar</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleBorrowBook(book.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    book.borrowedByUser
                      ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {book.borrowedByUser ? 'Kembalikan' : 'Pinjam'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

