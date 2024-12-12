type ToggleGroupProps = {
  buttons: {
    name: string;
    value: string;
  }[];
  defaultValue: string;
  onSelectionChange: (value: string) => void;
};

export function ToggleGroup({
  buttons,
  defaultValue,
  onSelectionChange,
}: ToggleGroupProps) {
  function handleSelectionChange(value: string) {
    onSelectionChange(value);
  }
  return (
    <div className="flex first:rounded-l">
      {buttons.map((button, index) => (
        <button
          type="button"
          key={button.value}
          onClick={() => handleSelectionChange(button.value)}
          className={`p-2 border text-white ${
            button.value === defaultValue
              ? "bg-custom-primary-light dark:bg-custom-primary-dark"
              : "bg-custom-secondary-light dark:bg-custom-secondary-dark"
          } ${index === 0 && "rounded-l border-r-0"} ${
            index === buttons.length - 1 && "rounded-r border-l-0"
          } ${index !== 0 && index !== buttons.length - 1 && "border-x-0"}`}
        >
          {button.name}
        </button>
      ))}
    </div>
  );
}
