declare module 'qz-tray' {
    export namespace qz {
      interface Printer {
        name: string;
        // Tambahkan properti lain sesuai kebutuhan
      }
  
      interface PrintData {
        type: string;
        format: string;
        data: string;
      }
  
      function findPrinter(name: string): Promise<Printer>;
  
      function print(printer: Printer, data: PrintData[]): Promise<void>;
  
      function configure(options: any): void;
      function getPrinterList(): Promise<Printer[]>;
      function isPrinterAvailable(name: string): Promise<boolean>;
    }
  }
  