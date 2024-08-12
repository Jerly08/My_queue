import React, { useState, useEffect } from 'react';

const loadQZTray = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/qz-tray.js'; // Pastikan path ini sesuai dengan lokasi file qz-tray.js di folder public
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load QZ Tray'));
    document.head.appendChild(script);
  });
};

const TakeTicket: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [ticketTaken, setTicketTaken] = useState<boolean>(false);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number | null>(null);
  const cooldownTime = 30; // Cooldown time in seconds

  useEffect(() => {
    if (cooldown !== null) {
      const timer = setInterval(() => {
        setCooldown((prev) => (prev && prev > 0 ? prev - 1 : null));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    if (cooldown === 0) {
      setTicketTaken(false); // Allow taking ticket again after cooldown
      setTicketNumber(null);
    }
  }, [cooldown]);

  const handleTakeTicket = async () => {
    if (cooldown !== null) {
      setError(`Harap tunggu ${cooldown} detik sebelum mengambil tiket lagi.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await loadQZTray();

      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        console.error('API response not OK:', response.statusText);
        throw new Error('Gagal mengambil tiket');
      }

      const data = await response.json();
      console.log('Data tiket diterima:', data);

      setTicketNumber(data.ticketNumber);
      setTicketTaken(true);
      setCooldown(cooldownTime);

      // Cetak tiket langsung menggunakan QZ Tray
      const printData = {
        type: 'raw',
        format: 'plain',
        data: `Nomor Antrian: ${data.ticketNumber}\nTerima kasih atas kesabaran Anda.`,
      };

      const qz = (window as any).qz; // Gunakan type assertion untuk akses qz
      if (qz) {
        try {
          const printer = await qz.printers.find('HP LaserJet Pro MFP M125-M126 PCLmS'); // Ganti dengan nama printer yang sesuai
          if (!printer) {
            throw new Error('Printer tidak ditemukan.');
          }
          await qz.print(printer, [printData]);
          console.log('Tiket berhasil dicetak.');
        } catch (printerError) {
          console.error('Kesalahan saat mencetak tiket:', printerError);
          setError('Printer tidak terhubung atau tidak ditemukan.');
        }
      } else {
        console.error('QZ Tray tidak tersedia.');
        setError('QZ Tray tidak tersedia.');
      }
    } catch (err) {
      console.error('Terjadi kesalahan:', err);
      setError('Gagal mengambil tiket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800">Ambil Tiket</h2>
        {ticketTaken && ticketNumber ? (
          <div>
            <p className="mt-4 text-green-500 text-center">
              Tiket berhasil diambil! Nomor tiket Anda: {ticketNumber}
            </p>
            <div id="ticket-content" className="mt-4 text-center">
              <p>Nomor Antrian: <strong>{ticketNumber}</strong></p>
              <p>Terima kasih telah mengambil tiket!</p>
            </div>
          </div>
        ) : (
          <button
            onClick={handleTakeTicket}
            className={`mt-4 px-4 py-2 w-full rounded ${
              loading || cooldown !== null ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
            disabled={loading || cooldown !== null}
          >
            {loading ? 'Mengambil...' : 'Ambil Tiket'}
          </button>
        )}
        {error && <p className="mt-2 text-red-500 text-center">{error}</p>}
        {cooldown !== null && (
          <p className="mt-2 text-gray-500 text-center">
            Anda dapat mengambil tiket lagi dalam {cooldown} detik.
          </p>
        )}
      </div>
    </div>
  );
};

export default TakeTicket;
