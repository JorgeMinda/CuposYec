import {Component, inject} from '@angular/core';

import {Button} from "primeng/button";

import {CustomMessageService} from "@utils/services";
import {JsonPipe} from "@angular/common";
import {CareerRegistrationStore} from '../../career-registration.store';
import {SecondaryDataComponent} from "../secondary-data/secondary-data.component";
import {CareerRegistrationService} from "../../career-registration.service";
import {
    PrincipalDataComponent
} from "@modules/admin/work-flows/career-registration/components/principla-data/principal-data.component";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {FontAwesome} from "@utils/icons/font-awesome";


@Component({
    selector: 'app-career',
    imports: [
        PrincipalDataComponent,
        Button,
        JsonPipe,
        SecondaryDataComponent
    ],
    templateUrl: './career.component.html'
})
export class CareerComponent {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    protected readonly careerCreateStore = inject(CareerRegistrationStore);
    protected readonly careerRegistrationService = inject(CareerRegistrationService);

    async onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload = {
            principalData: this.careerCreateStore.principalData(),
            secondaryData: this.careerCreateStore.secondaryData(),
        }

        console.log(payload);

        this.careerRegistrationService.register(payload).subscribe({
            next: (response) => {
            }
        });
    }

    protected readonly FontAwesome = FontAwesome;
}
