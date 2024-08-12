import React from 'react';

const Display: React.FC = () => {
  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold">Antrian Saat Ini</h2>
      <p className="text-xl">Nomor Antrian: <span className="font-bold">A001</span></p>
    </div>
  );
};

export default Display;