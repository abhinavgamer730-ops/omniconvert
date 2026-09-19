'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Database, Copy, Download, RefreshCw, FileText, Sliders } from 'lucide-react';

export default function DummyDataClient() {
  const [datasetType, setDatasetType] = useState<'users' | 'products' | 'orders'>('users');
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [recordCount, setRecordCount] = useState<number>(10);
  const [outputData, setOutputData] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateData = useCallback(() => {
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Sam', 'Chris', 'Pat', 'Riley', 'Jamie', 'Casey'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'techcorp.io', 'acme.org'];
    const cities = ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Sydney', 'Toronto'];
    const productNames = ['Wireless Headphones', 'Mechanical Keyboard', 'Ergonomic Desk Chair', '4K Monitor', 'Smart Watch', 'USB-C Dock', 'Laptop Stand'];
    const categories = ['Electronics', 'Office', 'Furniture', 'Accessories', 'Gadgets'];

    let records: any[] = [];

    for (let i = 1; i <= recordCount; i++) {
      if (datasetType === 'users') {
        const fn = firstNames[i % firstNames.length];
        const ln = lastNames[i % lastNames.length];
        records.push({
          id: i,
          name: `${fn} ${ln}`,
          email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${domains[i % domains.length]}`,
          role: i % 3 === 0 ? 'Admin' : i % 2 === 0 ? 'Developer' : 'User',
          city: cities[i % cities.length],
          isActive: i % 4 !== 0,
          createdAt: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
        });
      } else if (datasetType === 'products') {
        records.push({
          id: i,
          title: `${productNames[i % productNames.length]} Pro v${i}`,
          category: categories[i % categories.length],
          price: parseFloat((29.99 + (i * 15.5)).toFixed(2)),
          stock: (i * 7) % 150,
          sku: `SKU-${1000 + i}`,
          inStock: i % 5 !== 0,
        });
      } else if (datasetType === 'orders') {
        records.push({
          orderId: `ORD-${5000 + i}`,
          customerName: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
          totalAmount: parseFloat((49.00 + (i * 22.4)).toFixed(2)),
          status: i % 3 === 0 ? 'Delivered' : i % 2 === 0 ? 'Processing' : 'Shipped',
          itemCount: (i % 4) + 1,
          orderDate: new Date(Date.now() - i * 43200000).toISOString().slice(0, 10),
        });
      }
    }

    if (format === 'json') {
      setOutputData(JSON.stringify(records, null, 2));
    } else {
      // CSV Format conversion
      if (records.length === 0) {
        setOutputData('');
        return;
      }
      const headers = Object.keys(records[0]).join(',');
      const rows = records.map((r) => Object.values(r).map((v) => `"${v}"`).join(','));
      setOutputData([headers, ...rows].join('\n'));
    }
  }, [datasetType, format, recordCount]);

  useEffect(() => {
    generateData();
  }, [generateData]);

  const copyData = () => {
    navigator.clipboard.writeText(outputData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([outputData], {
      type: format === 'json' ? 'application/json' : 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock-${datasetType}.${format}`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Dummy Data Generator</h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Developer Tool
              </span>
            </div>
            <p className="text-xs text-zinc-400">Generate realistic mock JSON or CSV datasets for developer testing and API prototyping.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Code Output */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-mono font-semibold text-teal-400">
                Generated {datasetType.toUpperCase()} ({recordCount} records, {format.toUpperCase()})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyData}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={downloadFile}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-500 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .{format}</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto max-h-[460px] leading-relaxed select-all">
              {outputData}
            </pre>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              <span>Dataset Configuration</span>
            </h3>

            {/* Dataset Type */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">Schema Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['users', 'products', 'orders'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setDatasetType(type)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                      datasetType === type
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500 shadow-glow-sm'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Format Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2">Export Format</label>
              <div className="grid grid-cols-2 gap-2">
                {(['json', 'csv'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                      format === fmt
                        ? 'bg-teal-600 text-white border-teal-500 shadow-glow-sm'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Record Count Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-2">
                <span>Record Count</span>
                <span className="text-teal-400 font-mono font-bold">{recordCount} records</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={recordCount}
                onChange={(e) => setRecordCount(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            <button
              onClick={generateData}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-zinc-950 font-bold text-xs shadow-glow-sm hover:shadow-glow-md transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Regenerate Dataset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
