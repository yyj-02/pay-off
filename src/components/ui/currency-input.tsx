import { Input } from "./input";
import { useState } from "react";

type CurrencyInputProps = {
  setAmount?: (amount: number) => void;
  isDisabled?: boolean;
};

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  setAmount,
  isDisabled,
}) => {
  const [value, setValue] = useState("");

  const handleAmountUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Check if value is empty or matches the regex pattern
    if (val === "" || /^(?!-)\d*\.?\d{0,2}$/.test(val)) {
      setValue(val);
      const parsedValue = parseFloat(val);
      if (isNaN(parsedValue) || parsedValue < 0) {
        setAmount?.(0);
        return;
      }
      setAmount?.(parsedValue);
    }
  };

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-gray-500">$</span>
      <Input
        id="amount"
        type="number"
        placeholder="Enter amount"
        min="0.01"
        step="0.01"
        className="pl-8 w-full h-10 box-border"
        required
        value={value}
        onChange={handleAmountUpdate}
        disabled={isDisabled}
      />
    </div>
  );
};

export { CurrencyInput };
