'use client';

import React, { useState, useEffect } from 'react';
import BottomNavigation from '../../../components/BottomNavigation';

interface SavedProduct {
  id: number;
  name: string;
  price: string;
  store: string;
  rating: number;
  description: string;
  image: string;
}

const categories = ['all', 'makanan', 'minuman'];

export default function DisimpanPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedProducts');
    if (saved) {
      setSavedProducts(JSON.parse(saved));
    }
  }, []);

  const filteredProducts = savedProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.name.toLowerCase().includes(selectedCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const removeProduct = (id: number) => {
    const updated = savedProducts.filter(p => p.id !== id);
    setSavedProducts(updated);
    localStorage.setItem('savedProducts', JSON.stringify(updated));
  };

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        {/* Header Card */}
        <div className="mb-4 rounded-2xl border border-black/10 bg-white/70 shadow-lg ring-1 ring-black/5 backdrop-blur">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 -z-10 opacity-50 [background:radial-gradient(120%_100%_at_0%_0%,#ef4444,transparent_60%)]" />
            <div className="flex items-center justify-between px-4 py-2">
              <a href="/masyarakat/e-umkm" className="text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </a>
              <div className="text-base font-bold text-gray-900">Disimpan</div>
              <div className="text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 p-4 shadow-xl ring-1 ring-red-200 backdrop-blur-sm">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/50"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 p-4 shadow-xl ring-1 ring-red-200 backdrop-blur-sm">
            <div className="flex space-x-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                    selectedCategory === category
                      ? 'bg-red-100 text-red-600 border border-red-200'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 p-6 shadow-xl ring-1 ring-red-200 backdrop-blur-sm">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p className="text-gray-500">Belum ada produk yang disimpan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-lg p-4 ring-1 ring-red-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center shadow-inner flex-shrink-0">
                        <span className="text-red-600 text-xs font-medium">Foto Produk</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-1">{product.description}</p>
                            <p className="text-red-600 font-bold mb-1">{product.price}</p>
                            <p className="text-gray-500 text-sm mb-2">{product.store}</p>
                            <div className="flex items-center">
                              <span className="text-yellow-400 text-sm">★</span>
                              <span className="text-gray-600 text-sm ml-1">Rating</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm hover:bg-red-200 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Hapus</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm hover:bg-green-200 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>Hubungi Penjual</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Navigation Bar */}
      <BottomNavigation />
    </main>
  );
}
