import React, { useState, useEffect } from 'react';

const TakeTicket: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [ticketTaken, setTicketTaken] = useState(false);
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
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to take ticket');
      }

      const data = await response.json();
      setTicketNumber(data.ticketNumber);
      setTicketTaken(true);
      setCooldown(cooldownTime);

      setTimeout(() => {
        window.print(); // Trigger print dialog
      }, 500); // Small delay to ensure UI updates before printing
    } catch (err) {
      setError('Gagal mengambil tiket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center">Ambil Tiket</h2>
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
              loading || cooldown !== null ? 'bg-gray-500' : 'bg-blue-500'
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

      {/* Konten untuk tampilan cetak */}
      {ticketTaken && ticketNumber && (
        <div id="printable-ticket" className="hidden">
          <div className="p-4 text-center">
            <h1 className="text-3xl font-bold">Nomor Antrian</h1>
            <p className="text-5xl font-bold my-4">{ticketNumber}</p>
            <p>Terima kasih atas kesabaran Anda.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeTicket;