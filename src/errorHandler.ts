enum ExtraErrorCodes {
	AuthenticationError = 'UNAUTHENTICATED',
	ValidationError = 'VALIDATION_FAILED',
	ForbiddenError = 'FORBIDDEN',
	BadUserInput = 'BAD_USER_INPUT',
	NotFoundError = 'NOT_FOUND',
}

interface ErrorOptions {
	originalError?: Error;
	extensions?: Record<string, unknown>;
}

class CustomError extends Error {
	code: ExtraErrorCodes | string;
	extensions?: Record<string, unknown>;

	constructor(message: string, code: ExtraErrorCodes | string, options?: ErrorOptions) {
		super(message);
		this.code = code;
		this.extensions = options?.extensions;
		this.name = this.constructor.name;

		if (options?.originalError) {
			this.stack = options.originalError.stack;
		}
	}
}

export class ErrorHandler {
	 UserInputError(message: string, options?: ErrorOptions) {
		return new CustomError(message, ExtraErrorCodes.BadUserInput, options);
	}

	 AuthenticationError(message: string = 'Account Not Authenticated', options?: ErrorOptions) {
		return new CustomError(message, ExtraErrorCodes.AuthenticationError, options);
	}

	 ValidationError(message: string, options?: ErrorOptions) {
		return new CustomError(message, ExtraErrorCodes.ValidationError, options);
	}

	 ForbiddenError(message: string = 'Action Not Allowed', options?: ErrorOptions) {
		return new CustomError(message, ExtraErrorCodes.ForbiddenError, options);
	}

	 NotFoundError(message: string = 'Resource Not Found', options?: ErrorOptions) {
		return new CustomError(message, ExtraErrorCodes.NotFoundError, options);
	}
}
