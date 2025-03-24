import React from "react";

export const DropdownMenu = ({ children }) => <div>{children}</div>;
export const DropdownMenuTrigger = ({ children, asChild }) => <div>{children}</div>;
export const DropdownMenuContent = ({ children, align }) => <div>{children}</div>;
export const DropdownMenuItem = ({ children, onClick }) => (
  <div onClick={onClick}>{children}</div>
);