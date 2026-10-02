"use client";

import { cn } from "@emach/ui/lib/utils";
import type { InputHTMLAttributes, ReactNode } from "react";

/** Erros como o TanStack Form entrega em field.state.meta.errors. */
export type FieldErrors = ReadonlyArray<{ message?: string } | undefined>;

/** Mensagens do campo, sem vazias nem repetidas (a mensagem é a key do React). */
export function errorMessages(errors: FieldErrors): string[] {
	return [
		...new Set(
			errors.flatMap((error) => (error?.message ? [error.message] : []))
		),
	];
}

/** O que o Field entrega ao controle. Espalhar no elemento: <input {...control} />. */
export interface FieldControl {
	"aria-describedby"?: string;
	"aria-invalid"?: true;
	id: string;
}

interface FieldProps {
	children: (control: FieldControl) => ReactNode;
	/** Todas as mensagens do campo; vazio ou ausente = sem erro. */
	error?: readonly string[];
	hint?: string;
	/** id do controle. A dica ganha `${id}-hint` e o erro `${id}-error`. */
	id: string;
	label: string;
}

/**
 * Rótulo, controle, dica e erros com a fiação de acessibilidade num lugar só.
 * O controle continua com a classe global (.emach-input, .emach-select).
 */
export function Field({ children, error = [], hint, id, label }: FieldProps) {
	const hintId = `${id}-hint`;
	const errorId = `${id}-error`;
	const hasError = error.length > 0;
	const describedBy =
		[hint ? hintId : null, hasError ? errorId : null]
			.filter(Boolean)
			.join(" ") || undefined;

	return (
		<div className="emach-field">
			<label className="emach-field__label" htmlFor={id}>
				{label}
			</label>
			{children({
				"aria-describedby": describedBy,
				"aria-invalid": hasError ? true : undefined,
				id,
			})}
			{hint ? (
				<span className="emach-field__hint" id={hintId}>
					{hint}
				</span>
			) : null}
			{hasError ? (
				<div aria-live="polite" id={errorId} role="alert">
					{error.map((message) => (
						<span className="emach-field__error" key={message}>
							{message}
						</span>
					))}
				</div>
			) : null}
		</div>
	);
}

/**
 * Forma mínima de um campo string do TanStack Form. Estrutural: o FieldApi da
 * lib encaixa sem importar os genéricos dela.
 */
export interface StringFieldApi {
	handleBlur: () => void;
	handleChange: (value: string) => void;
	name: string;
	state: { meta: { errors: FieldErrors }; value: string };
}

type TextFieldProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"children" | "id" | "name" | "onBlur" | "onChange" | "value"
> & {
	field: StringFieldApi;
	hint?: string;
	/** Padrão: field.name. */
	id?: string;
	label: string;
	/** Sanitiza o valor a cada tecla (só dígitos, máscara de telefone, UF). */
	transform?: (raw: string) => string;
};

/** Field ligado a um campo de texto do TanStack Form. */
export function TextField({
	className,
	field,
	hint,
	id,
	label,
	transform,
	...inputProps
}: TextFieldProps) {
	return (
		<Field
			error={errorMessages(field.state.meta.errors)}
			hint={hint}
			id={id ?? field.name}
			label={label}
		>
			{(control) => (
				<input
					{...inputProps}
					{...control}
					className={cn("emach-input", className)}
					onBlur={field.handleBlur}
					onChange={(e) =>
						field.handleChange(
							transform ? transform(e.target.value) : e.target.value
						)
					}
					value={field.state.value}
				/>
			)}
		</Field>
	);
}
