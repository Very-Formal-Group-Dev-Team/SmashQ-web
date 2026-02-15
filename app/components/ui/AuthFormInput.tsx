
interface placeholderProps {
    type: string
    placeholder: string
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

export default function AuthFormInput({ type, placeholder, value, onChange } : placeholderProps) {
    
    return (
        <input
            type={type}
            placeholder={placeholder || "hello"} 
            value={value}
            onChange={onChange}  
            className="text-md bg-gray-50 border border-gray-600 rounded-md py-3 px-4"
            // required
        >
        </input>
    )
}