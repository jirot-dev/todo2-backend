import { GenericModel } from 'src/shared/base/domain/models/generic.model';
import { DateService } from 'src/shared/core/services/date.service';
import { ErrorMessages } from 'src/shared/core/constants/error.constant';
import { ValidationError } from 'src/shared/core/exceptions/validation.error';
import { TodoStatus, TodoPriority } from '../enums/enum';
import { TodoFields } from '../constants/todo-fields.constant';
import { TodoValidation } from '../constants/todo-validation.constant';


export class Todo extends GenericModel<Todo> {
    private _title: string;
    private _detail?: string | null;
    private _progress: number;
    private _startDate?: Date | null;
    private _endDate?: Date | null;
    private _status?: TodoStatus | null;
    private _dueDate?: Date | null;
    private _priority?: TodoPriority | null;
    private _position?: number | null;

    // Public getters
    public get title(): string {
        return this._title;
    }

    public get detail(): string | null | undefined {
        return this._detail;
    }

    public get progress(): number {
        return this._progress;
    }

    public get startDate(): Date | null | undefined {
        return this._startDate;
    }

    public get endDate(): Date | null | undefined {
        return this._endDate;
    }

    public get status(): TodoStatus | null | undefined {
        return this._status;
    }

    public get dueDate(): Date | null | undefined {
        return this._dueDate;
    }

    public get priority(): TodoPriority | null | undefined {
        return this._priority;
    }

    public get position(): number | null | undefined {
        return this._position;
    }

    // Private setters
    private set title(value: string) {
        this._title = value;
    }

    private set detail(value: string | null | undefined) {
        this._detail = value;
    }

    private set progress(value: number) {
        this._progress = value;
    }

    private set startDate(value: Date | null | undefined) {
        this._startDate = value;
    }

    private set endDate(value: Date | null | undefined) {
        this._endDate = value;
    }

    private set status(value: TodoStatus | null | undefined) {
        this._status = value;
    }

    private set dueDate(value: Date | null | undefined) {
        this._dueDate = value;
    }

    private set priority(value: TodoPriority | null | undefined) {
        this._priority = value;
    }

    private set position(value: number | null | undefined) {
        this._position = value;
    }

    constructor(properties?: Partial<Todo>) {
        super(properties);
        if (properties) {
            this.merge(properties);
        }
    }

    public merge(updateValues: Partial<Todo>) {
        this.validateFields(updateValues);
        super.merge(updateValues);
        this.setDefaults();
        this.updateDates();
        this.validateState();
    }

    private validateFields(updateValues: Partial<Todo>): void {
        const errors: ValidationError[] = [];

        if (updateValues.title !== undefined && !updateValues.title.trim()) {
            errors.push(new ValidationError(ErrorMessages.FIELD_REQUIRED, {}, TodoFields.TITLE));
        }

        if (updateValues.detail !== undefined && updateValues.detail.length > TodoValidation.DETAIL_LENGTH_MAX) {
            errors.push(new ValidationError(ErrorMessages.FIELD_LENGTH, { max: TodoValidation.DETAIL_LENGTH_MAX }, TodoFields.DETAIL));
        }

        if (updateValues.progress !== undefined && (updateValues.progress < TodoValidation.PROGRESS_VALUE_MIN || updateValues.progress > TodoValidation.PROGRESS_VALUE_MAX)) {
            errors.push(new ValidationError(ErrorMessages.FIELD_RANGE, { min: TodoValidation.PROGRESS_VALUE_MIN, max: TodoValidation.PROGRESS_VALUE_MAX }, TodoFields.PROGRESS));
        }

        if (errors.length > 0) {
            throw new ValidationError(ErrorMessages.ITEM_VALIDATION, undefined, undefined, errors);
        }
    }

    private setDefaults(): void {
        this.priority = this.priority ?? TodoPriority.MEDIUM;
        this.progress = this.progress ?? 0;
        this.status = this.calculateStatus(this.progress);
    }

    private updateDates(): void {
        const dateService = new DateService();
        const nowUtc = dateService.getCurrentUtcDateTime();

        if (this.status !== TodoStatus.NOT_START && !this.startDate) {
            this.startDate = nowUtc;
        }

        if (this.status === TodoStatus.FINISHED && !this.endDate) {
            this.endDate = nowUtc;
        }

        this.createdAt = this.createdAt ?? nowUtc;
        this.updatedAt = nowUtc;
    }

    private validateState(): void {
        const errors: ValidationError[] = [];

        if (!this.title?.trim()) {
            errors.push(new ValidationError(ErrorMessages.FIELD_REQUIRED, {}, TodoFields.TITLE));
        }

        if (errors.length > 0) {
            throw new ValidationError(ErrorMessages.ITEM_VALIDATION, {}, undefined, errors);
        }
    }

    private calculateStatus(progress: number): TodoStatus {
        if (progress === 0) return TodoStatus.NOT_START;
        if (progress > 0 && progress < 100) return TodoStatus.PROGRESS;
        return TodoStatus.FINISHED;
    }

}