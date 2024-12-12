import { useState, useEffect, useRef, InputHTMLAttributes } from "react";
import { Input } from "./Input";
import { IoSearch } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

type SelectInputProps = {
  name?: string;
  label?: string;
  options: { value: string; label: string }[];
  selectedLabel: string;
  onSelectionChange: (value: string, label: string) => void;
  error?: string;
  disabled?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export function SelectInput({
  label,
  name,
  options,
  error,
  onSelectionChange,
  selectedLabel,
  disabled,
  ...rest
}: SelectInputProps) {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [search, setSearch] = useState(selectedLabel ? selectedLabel : "");
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    setSearch(e.target.value);
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(inputValue)
      )
    );
    onSelectionChange("0", "");
  };

  const handleOptionClick = (value: string, label: string) => {
    onSelectionChange(value, label);
    setSearch(label);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-1 relative">
      <button type="button" className="absolute opacity-0" />
      <Input
        name={name ?? ""}
        error={error ?? ""}
        label={label}
        value={search}
        onChange={handleSearchChange}
        icon={selectedLabel ? FaCheck : IoSearch}
        onFocus={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        {...rest}
      />
      {isOpen && (
        <ul className="flex flex-col z-10 shadow-md top-[100%] max-h-36 overflow-y-auto bg-white w-full rounded absolute">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li key={option.value} className="p-2 hover:bg-zinc-100">
                <button
                  className="w-full text-start"
                  type="button"
                  onClick={() => handleOptionClick(option.value, option.label)}
                >
                  {option.label}
                </button>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500">
              Nenhum paciente encontrado
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
