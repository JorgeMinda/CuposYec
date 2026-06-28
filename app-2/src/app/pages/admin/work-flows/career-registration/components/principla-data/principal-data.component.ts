import {Component, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';

import {email, FieldTree, form, FormField, required, SchemaPathTree} from "@angular/forms/signals";
import {PrincipalData} from "../../career-registration.state";
import {InputText} from "primeng/inputtext";
import {LabelDirective} from "@utils/directives/label.directive";
import {ErrorMessageDirective} from "@utils/directives/error-message.directive";
import {CareerRegistrationStore} from "../..//career-registration.store";
import {FormRegistryService} from "@utils/services/form-registry.service";

const FORM_STATE_KEY = 'principalData';

@Component({
    selector: 'app-principal-data',
    imports: [
        InputText,
        FormField,
        LabelDirective,
        ErrorMessageDirective
    ],
    templateUrl: './principal-data.component.html'
})
export class PrincipalDataComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly careerCreateStore = inject(CareerRegistrationStore);

    protected readonly form$ = signal(this.careerCreateStore.principalData());

    protected readonly formData: FieldTree<PrincipalData> = this.buildForm;

    constructor() {
        effect(() => {
            this.careerCreateStore.updateSection(FORM_STATE_KEY, this.form$());
        });
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Datos Principales',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    get buildForm() {
        return form(this.form$, (schema) => {
            this.validateForm(schema)
        });
    }

    private validateForm(schema: SchemaPathTree<PrincipalData>): void {
        //modality
        required(schema.name, {message: 'El name es requerido'});

        //isVisible
        required(schema.code, {message: 'El code es requerido'});
    }

    get codeField() {
        return this.formData.code;
    }

    get nameField() {
        return this.formData.name;
    }

    get degreeField() {
        return this.formData.degree;
    }

    get acronymField() {
        return this.formData.acronym;
    }
}
