import styles from "./TextInputWithLabel.module.css";

function TextInputWithLabel({
    id,
    elementId,
    label,
    labelText,
    onChange,
    ref,
    value,
    type = "text",
    placeholder = "",
    disabled = false,
    name,
}) {

    const inputId = elementId || id || "text-input";
    const inputLabel = labelText || label;

    return(
        <div className={styles.wrapper}>
            {inputLabel && (
                <label htmlFor={inputId} className={styles.label}>
                    {inputLabel}
                </label>
            )}
            <input 
                type={type}
                id={inputId}
                name={name || inputId}
                ref={ref}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
                className={styles.input}
            />
        </div>
    );
}
export default TextInputWithLabel
