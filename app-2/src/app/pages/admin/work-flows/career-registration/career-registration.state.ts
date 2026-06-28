export interface CareerRegistrationState {
    principalData: PrincipalData;
    secondaryData: SecondaryData;
}

export interface PrincipalData {
    code: string;
    name: string;
    degree: string;
    acronym: string;
}

export interface SecondaryData {
    code: string;
    shortName: string;
    logo: string;
    resolutionNumber: string;
}

export const INITIAL_STATE: CareerRegistrationState = {
    principalData: {
        code: '',
        name: '',
        degree: '',
        acronym: ''
    },

    secondaryData: {
        code: '',
        shortName: '',
        logo: '',
        resolutionNumber: ''
    },
};
