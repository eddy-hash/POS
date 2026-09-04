import { SupplierInfo } from './SupplierInfo';

interface SupplierStepProps {
  supplier: string;
  setSupplier: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
}

export function SupplierStep({ supplier, setSupplier, notes, setNotes }: SupplierStepProps) {
  return (
    <SupplierInfo
      supplier={supplier}
      setSupplier={setSupplier}
      notes={notes}
      setNotes={setNotes}
    />
  );
}
