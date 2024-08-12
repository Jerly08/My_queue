import React from 'react';

const Teller: React.FC = () => {
  const handleCallNext = () => {
    // Logic untuk memanggil antrian berikutnya
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold">Teller</h2>
      <button onClick={handleCallNext} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Panggil Antrian Berikutnya</button>
    </div>
  );
};

export default Teller;
