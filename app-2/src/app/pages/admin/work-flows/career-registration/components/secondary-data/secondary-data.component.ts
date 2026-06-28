import {Component, computed, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';

import {FieldTree, form, FormField, required, SchemaPathTree, validate} from "@angular/forms/signals";
import {SecondaryData} from "../../career-registration.state";
import {InputText} from "primeng/inputtext";
import {LabelDirective} from "@utils/directives/label.directive";
import {ErrorMessageDirective} from "@utils/directives/error-message.directive";
import {CareerRegistrationStore} from "../../career-registration.store";
import {FormRegistryService} from "@utils/services/form-registry.service";

const FORM_STATE_KEY = 'secondaryData';

@Component({
    selector: 'app-secondary-data',
    imports: [
        InputText,
        LabelDirective,
        FormField,
        ErrorMessageDirective
    ],
    templateUrl: './secondary-data.component.html'
})
export class SecondaryDataComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly careerCreateStore = inject(CareerRegistrationStore);

    protected readonly isShortNameRequired = computed(() =>
        this.codeField().value() === '1'
    );

    protected readonly form$: WritableSignal<SecondaryData> = signal(this.careerCreateStore.secondaryData());

    protected readonly formData: FieldTree<SecondaryData> = this.buildForm;

    constructor() {
        effect(() => {
            this.careerCreateStore.updateSection(FORM_STATE_KEY, this.form$());
        });
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Datos Secundarios',
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

    private validateForm(schema: SchemaPathTree<SecondaryData>): void {
        // this.codeRules(schema);
        this.shortNameRules(schema);
        required(schema.code, {message: 'El code es requerido'});
    }

    // private codeRules(schema: SchemaPathTree<SecondaryData>) {
    //     return validate(schema.code, (ctx) => {
    //         if (!this.isCodeRequired()) return null;
    //
    //         if (!ctx.value()) {
    //             return {
    //                 kind: 'required',
    //                 message: 'Código requerido'
    //             };
    //         }
    //
    //         return null;
    //     });
    // }

    // private shortNameRules(schema: SchemaPathTree<SecondaryData>) {
    //     return validate(schema.shortName, (ctx) => {
    //
    //         const code = this.codeField().value();
    //
    //         if (code !== '10') return null;
    //
    //
    //         const value = ctx.value() ?? '';
    //
    //         if (value.length < 2) {
    //             return {
    //                 kind: 'minLength',
    //                 message: 'Debe tener al menos 2 caracteres'
    //             };
    //         }
    //
    //         return null;
    //     });
    // }

    private shortNameRules(schema: SchemaPathTree<SecondaryData>) {
        return validate(schema.shortName, (ctx) => {
            if (!this.isShortNameRequired()) return null;

            if (!ctx.value()) {
                return {
                    kind: 'required',
                    message: 'Shortname es requerido'
                };
            }

            return null;
        });
    }

    get codeField() {
        return this.formData.code;
    }

    get shortNameField() {
        return this.formData.shortName;
    }

    get logoField() {
        return this.formData.logo;
    }

    get resolutionNumberField() {
        return this.formData.resolutionNumber;
    }
}
