import { forwardRef, InputHTMLAttributes } from "react";
import { IconType } from "react-icons";
import { MdOutlineWarning } from "react-icons/md";
import InputMask from "react-input-mask";

type InputProps = {
  name?: string;
  label?: string;
  icon?: IconType;
  mask?: string | Array<string | RegExp>;
  error?: string;
  disabled?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, name, error = "", mask, disabled, ...rest }, ref) => {
    const labelIconClass = error
      ? "text-custom-danger-light dark:text-custom-danger-dark"
      : "text-custom-primary-light dark:text-custom-primary-dark";

    const inputClass =
      error && "border-custom-danger-light dark:border-custom-danger-dark";

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={name}
            className={`${labelIconClass} ${
              disabled && "opacity-75"
            } font-medium`}
          >
            {label}
          </label>
        )}
        <div className="flex gap-1 items-center w-full border-b">
          {Icon && (
            <Icon className={`${labelIconClass} ${disabled && "opacity-75"}`} />
          )}
          {mask ? (
            <InputMask
              id={name}
              name={name}
              mask={mask}
              maskChar={null}
              inputRef={ref}
              disabled={disabled}
              {...rest}
              className={`${inputClass} w-full p-1 outline-none bg-transparent text-custom-text-primary-dark dark:text-custom-text-primary-light placeholder:text-custom-text-primary-dark/40 dark:placeholder:text-custom-text-primary-light/40 dark:border-b-custom-primary-dark`}
            />
          ) : (
            <input
              ref={ref}
              id={name}
              name={name}
              disabled={disabled}
              className={`${inputClass} w-full p-1 outline-none bg-transparent text-custom-text-primary-dark dark:text-custom-text-primary-light placeholder:text-custom-text-primary-dark/40 dark:placeholder:text-custom-text-primary-light/40 dark:border-b-custom-primary-dark`}
              {...rest}
            />
          )}
        </div>
        {error && (
          <div className="flex gap-1 items-center">
            <MdOutlineWarning className="text-custom-danger-light dark:text-custom-danger-dark" />
            <p className="text-sm text-custom-danger-light dark:text-custom-danger-dark">
              {error}
            </p>
          </div>
        )}
      </div>
    );
  }
);
