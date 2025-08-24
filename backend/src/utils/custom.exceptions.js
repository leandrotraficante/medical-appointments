/**
 * Custom exception thrown when attempting to create a user that already exists in the system
 * @extends Error
 * @example
 * throw new UserAlreadyExists('A user with this email already exists');
 */
export class UserAlreadyExists extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

/**
 * Custom exception thrown when authentication credentials are invalid
 * @extends Error
 * @example
 * throw new InvalidCredentials('Invalid email or password');
 */
export class InvalidCredentials extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}