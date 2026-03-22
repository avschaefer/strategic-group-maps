import { useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';

export function SessionBackup() {
  const exportSession = useAppStore((s) => s.exportSession);
  const importSession = useAppStore((s) => s.importSession);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    const json = exportSession();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strategic-group-maps-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => fileRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importSession(reader.result as string);
      } catch {
        alert('Could not load file — the JSON format is invalid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <section>
      <h2 className="text-[11px] font-medium text-[#8c8475] uppercase tracking-wider mb-2.5">
        Backup
      </h2>
      <div className="flex gap-1.5">
        <button
          onClick={handleDownload}
          className="flex-1 px-3 py-1.5 text-[12px] font-medium text-[#3d3929] border border-[#ddd8cf] rounded-lg hover:bg-[#e8e4dd] transition-colors"
        >
          ↓ Download
        </button>
        <button
          onClick={handleUpload}
          className="flex-1 px-3 py-1.5 text-[12px] font-medium text-[#3d3929] border border-[#ddd8cf] rounded-lg hover:bg-[#e8e4dd] transition-colors"
        >
          ↑ Upload
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleFile}
        className="hidden"
      />
    </section>
  );
}
