import React, { forwardRef } from "react";
import "../Authentication/authentication.css";

interface IUserInput {
  type: string;
  id: string;
  name: string;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  className: string;
  error?: boolean;
  helperText?: string;
  imgSource?: string;
  required?: boolean;
  fieldClassName?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
}

const UserInput = forwardRef<HTMLInputElement, IUserInput>(
  (props: IUserInput, ref) => {
    const {
      type,
      id,
      name,
      onChange,
      onBlur,
      placeholder,
      className,
      error,
      helperText,
      imgSource,
      required,
      fieldClassName,
      onFocus
    } = props;
    return (
      <div className="user-input-wrapper">
        <div
          className={ fieldClassName + " " +
            (error ? "user-input-field input-error" : "user-input-field")
          }
        >
          <input
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            type={type}
            id={id}
            placeholder={placeholder}
            className={className}
            ref={ref}
            onFocus={onFocus}
          />
          {imgSource && (
            <img src={imgSource} alt="none" className="user-input-img" />
          )}
          <span className="user-input-required">{required ? "*" : ""}</span>
          
        </div>
          
        {error && (
          <label htmlFor={id} className="inputErrorHelperText">
            {helperText ?? "Error"}
          </label>
        )}
      </div>
    );
  }
);

export default UserInput;
