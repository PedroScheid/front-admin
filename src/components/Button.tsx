import {
  Button as PrimeButton,
  ButtonProps as PrimeButtonProps,
} from "primereact/button";
import { ReactNode } from "react";

type ButtonType = "primary" | "secondary";

interface ButtonProps extends PrimeButtonProps {
  onClick?: () => void;
  children?: ReactNode;
  buttonType?: ButtonType;
  label?: string;
  icon?: string;
  width?: string;
}

const Button = ({
  onClick,
  children,
  label,
  width,
  buttonType = "primary",
}: ButtonProps) => {
  return (
    <PrimeButton
      style={{
        color: buttonType === "primary" ? "#FFFFFF" : "#000000",
        backgroundColor: buttonType === "primary" ? "#336aea" : "#FFFFFF",
        borderColor: buttonType === "primary" ? "#336aea" : "#FFFFFF",
        fontWeight: "bold",
        margin: "0.5rem 0rem",
        width: width ?? 150,
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
      }}
      onClick={onClick}
      label={label}
    >
      {children}
    </PrimeButton>
  );
};

export default Button;
