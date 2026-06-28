import {computed, Injectable, signal} from "@angular/core";
import {CareerRegistrationState, INITIAL_STATE} from "./career-registration.state";

const FORM_STATE_KEY = 'formState';

@Injectable({providedIn: 'root'})
export class CareerRegistrationStore {
    readonly formState = signal<CareerRegistrationState>(this.loadFromStorage());
    readonly formErrors = signal<Record<string, string[]>>({});

    readonly principalData = computed(() => this.formState().principalData);
    readonly secondaryData = computed(() => this.formState().secondaryData);


    updateSection<K extends keyof CareerRegistrationState>(
        section: K,
        data: Partial<CareerRegistrationState[K]>
    ) {
        this.formState.update(state => ({
            ...state,
            [section]: {
                ...state[section],
                ...data
            }
        }));
    }

    private loadFromStorage(): CareerRegistrationState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }
}
