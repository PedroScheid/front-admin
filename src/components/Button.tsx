import { Button as PrimeButton } from "primereact/button";
import { ReactNode } from "react";

type ButtonType = "primary" | "secondary";

interface ButtonProps {
  onClick?: () => void;
  children?: ReactNode;
  type?: ButtonType;
  label?: string;
  icon?: string;
  width?: string;
}

const Button = ({
  onClick,
  children,
  label,
  icon,
  width,
  type = "primary",
}: ButtonProps) => {
  return (
    <PrimeButton
      style={{
        color: type === "primary" ? "#FFFFFF" : "#000000",
        backgroundColor: type === "primary" ? "#336aea" : "#FFFFFF",
        borderColor: type === "primary" ? "#336aea" : "#FFFFFF",
        fontWeight: "bold",
        margin: "0.5rem 0rem",
        width: width ?? 150,
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
      }}
      onClick={onClick}
      label={label}
      icon={icon}
    >
      {children}
    </PrimeButton>
  );
};

export default Button;
