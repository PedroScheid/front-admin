import { InputText } from "primereact/inputtext";
import { HTMLInputTypeAttribute } from "react";

interface InputProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  type?: HTMLInputTypeAttribute | undefined;
  width?: string;
  disabled?: boolean;
}

const Input = ({
  label,
  value,
  onChange,
  width,
  disabled = false,
  type = "text",
}: InputProps) => {
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
      <InputText
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={{ marginBottom: 15, width: width ?? 200 }}
        type={type}
        disabled={disabled}
      />
    </div>
  );
};

export default Input;
