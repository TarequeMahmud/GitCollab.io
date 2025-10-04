"use client";

import React from "react";
import clsx from "clsx";

type Variant = "primary" | "danger" | "success" | "warning" | "secondary";
type Size = "sm" | "md" | "lg";

interface ActionButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: Variant;
    size?: Size;
    block?: boolean;
    className?: string;
}

const variantClasses: Record<Variant, string> = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    secondary: "bg-gray-700 hover:bg-gray-800 text-white",
};

const sizeClasses: Record<Size, string> = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-5 py-2 text-base",
};

export default function ActionButton({
    children,
    onClick,
    type = "button",
    variant = "primary",
    size = "md",
    block = false,
    className = "",
}: ActionButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={clsx(
                "rounded-lg shadow-sm transition font-semibold cursor-pointer",
                variantClasses[variant],
                sizeClasses[size],
                block && "w-full",
                className
            )}
        >
            {children}
        </button>
    );
}
