import { useState } from "react"

interface placeholderProps {
    type: string
    placeholder: string
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    showToggle?: boolean
    ariaLabel?: string
}

export default function Input({ type, placeholder, value, onChange, showToggle = false, ariaLabel }: placeholderProps) {
    const [visible, setVisible] = useState(false)
    const isPassword = type === "password" && showToggle
    return (
        <div className="relative w-full">
            <input
                type={isPassword && visible ? "text" : type}
                placeholder={placeholder || "hello"}
                value={value}
                onChange={onChange}
                className="text-md bg-gray-50 border w-full border-gray-600 rounded-md py-3 px-4 pr-10"
                aria-label={ariaLabel || placeholder}
            />
            {isPassword && (
                <button
                    type="button"
                    aria-label={visible ? "Hide password" : "Show password"}
                    tabIndex={0}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 focus:outline-none"
                    onClick={() => setVisible((v) => !v)}
                >
                    {visible ? (
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5C7.305 4.5 3.135 7.635 1.5 12c1.635 4.365 5.805 7.5 10.5 7.5s8.865-3.135 10.5-7.5C20.865 7.635 16.695 4.5 12 4.5zm0 13c-3.59 0-6.5-2.91-6.5-6.5S8.41 4.5 12 4.5s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5zm0-10a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" fill="currentColor"/></svg>
                    ) : (
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12c1.635 4.365 5.805 7.5 10.5 7.5s8.865-3.135 10.5-7.5c-1.635-4.365-5.805-7.5-10.5-7.5S4.135 7.635 2.5 12zm7.5 0a2 2 0 114 0 2 2 0 01-4 0z" fill="currentColor"/></svg>
                    )}
                </button>
            )}
        </div>
    )
}