import React from "react";

export const Button = ({ children, variant, size, ...props }) => {
  return (
    <button className={`btn ${variant} ${size}`} {...props}>
      {children}
    </button>
  );
};