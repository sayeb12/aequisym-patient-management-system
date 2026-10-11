import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "motion/react";
import {
    useEffect,
    useId,
    useRef,
    useState,
} from "react";

import styles from "./SelectField.module.css";


function SelectField({
    id,
    label,
    name,
    onChange,
    options,
    placeholder = "Select an option",
    value,
}) {
    const generatedId = useId();
    const fieldId = id || `select-field-${generatedId}`;
    const labelId = `${fieldId}-label`;
    const valueId = `${fieldId}-value`;
    const listboxId = `${fieldId}-listbox`;

    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const optionRefs = useRef([]);
    const shouldReduceMotion = useReducedMotion();

    const selectedIndex = options.findIndex((option) => option.value === value);
    const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(
        selectedIndex >= 0 ? selectedIndex : 0,
    );

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleOutsidePointer = (event) => {
            if (!rootRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("pointerdown", handleOutsidePointer);

        return () => {
            document.removeEventListener("pointerdown", handleOutsidePointer);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const focusFrame = window.requestAnimationFrame(() => {
            optionRefs.current[activeIndex]?.focus();
        });

        return () => window.cancelAnimationFrame(focusFrame);
    }, [activeIndex, isOpen]);

    const openDropdown = (preferredIndex = selectedIndex) => {
        const nextIndex = preferredIndex >= 0 ? preferredIndex : 0;
        setActiveIndex(Math.min(nextIndex, Math.max(options.length - 1, 0)));
        setIsOpen(true);
    };

    const closeDropdown = (returnFocus = false) => {
        setIsOpen(false);

        if (returnFocus) {
            window.requestAnimationFrame(() => triggerRef.current?.focus());
        }
    };

    const selectOption = (option) => {
        onChange({
            target: {
                name,
                value: option.value,
            },
        });
        closeDropdown(true);
    };

    const handleTriggerKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            openDropdown(selectedIndex >= 0 ? selectedIndex : 0);
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            openDropdown(selectedIndex >= 0 ? selectedIndex : options.length - 1);
        }
    };

    const handleOptionKeyDown = (event, index) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index + 1) % options.length);
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index - 1 + options.length) % options.length);
            return;
        }

        if (event.key === "Home") {
            event.preventDefault();
            setActiveIndex(0);
            return;
        }

        if (event.key === "End") {
            event.preventDefault();
            setActiveIndex(options.length - 1);
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectOption(options[index]);
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            closeDropdown(true);
            return;
        }

        if (event.key === "Tab") {
            setIsOpen(false);
        }
    };

    return (
        <div className={styles.field} ref={rootRef}>
            <label className={styles.label} id={labelId} htmlFor={fieldId}>
                {label}
            </label>

            <div className={styles.control}>
                <button
                    ref={triggerRef}
                    id={fieldId}
                    className={styles.trigger}
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-controls={listboxId}
                    aria-labelledby={`${labelId} ${valueId}`}
                    onClick={() => {
                        if (isOpen) {
                            closeDropdown();
                        } else {
                            openDropdown();
                        }
                    }}
                    onKeyDown={handleTriggerKeyDown}
                >
                    <span
                        id={valueId}
                        className={selectedOption ? styles.value : styles.placeholder}
                    >
                        {selectedOption?.label || placeholder}
                    </span>
                    <svg
                        className={isOpen ? styles.chevronOpen : styles.chevron}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="m7 9.5 5 5 5-5" />
                    </svg>
                </button>

                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.ul
                            id={listboxId}
                            className={styles.menu}
                            role="listbox"
                            aria-labelledby={labelId}
                            initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                            transition={{
                                duration: shouldReduceMotion ? 0 : 0.14,
                                ease: [0.2, 0, 0, 1],
                            }}
                        >
                            {options.map((option, index) => (
                                <li
                                    ref={(element) => {
                                        optionRefs.current[index] = element;
                                    }}
                                    id={`${fieldId}-option-${index}`}
                                    className={styles.option}
                                    key={option.value}
                                    role="option"
                                    aria-selected={option.value === value}
                                    data-active={index === activeIndex ? "true" : undefined}
                                    tabIndex={index === activeIndex ? 0 : -1}
                                    onClick={() => selectOption(option)}
                                    onFocus={() => setActiveIndex(index)}
                                    onKeyDown={(event) => handleOptionKeyDown(event, index)}
                                >
                                    <span>{option.label}</span>
                                    {option.value === value && (
                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="m5 12.5 4.25 4.25L19 7" />
                                        </svg>
                                    )}
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}


export default SelectField;
