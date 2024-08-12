import React from 'react';

const Monitoring: React.FC = () => {
  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold">Monitoring Antrian</h2>
      <p className="text-xl">Total Antrian: <span className="font-bold">10</span></p>
      <p className="text-xl">Antrian Saat Ini: <span className="font-bold">A001</span></p>
    </div>
  );
};

export default Monitoring;