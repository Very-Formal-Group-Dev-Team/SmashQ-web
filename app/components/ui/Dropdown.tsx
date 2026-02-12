
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface dropdownProps {
  options: SelectOption[]
  placeholder?: string
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

export default function Dropdown({ value, onChange, placeholder, options }: dropdownProps) {
  return (
    <select 
      value={value}
      onChange={onChange}
      className="w-full text-md text-gray-500 bg-gray-50 border border-gray-600 rounded-sm py-4 px-4"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option 
          key={option.value} 
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>

  )
}