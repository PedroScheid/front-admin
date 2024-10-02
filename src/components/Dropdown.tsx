import { Dropdown as PrimeDropdown } from "primereact/dropdown";
import { DropdownOptions } from "../types";

interface InputProps {
  options: DropdownOptions[];
  value: number | null;
  onChange: (value: number) => void;
  label?: string;
  width?: string;
}

const Dropdown = ({ options, label, value, onChange, width }: InputProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 5,
      }}
    >
      {label && <label style={{ fontSize: 14 }}>{label}</label>}
      <PrimeDropdown
        options={options}
        dataKey="value"
        optionLabel="text"
        optionValue="value"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ marginBottom: 15, width: width ?? 200, textAlign: "start" }}
      />
    </div>
  );
};

export default Dropdown;
