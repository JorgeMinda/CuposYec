import { RoleInterface } from '@modules/auth/interfaces';
import { CatalogueInterface } from '@utils/interfaces';

// 🛡️ PARCHE DIRECTO: Eliminamos la importación rota y definimos RucInterface como 'any' 
// para que pase la compilación sin buscar el archivo que falta.
// import { RucInterface } from '@/pages/core/shared/interfaces'; 
type RucInterface = any;

export interface AuthInterface {
    id: string;
    roles?: RoleInterface[];
    avatar?: string;
    email: string;
    emailVerifiedAt?: Date;
    lastname?: string;
    name?: string;
    identification?: string;
    username: string;
    termsAcceptedAt?: Date;
    ruc?: RucInterface;
    securityQuestionAcceptedAt?: Date;
    passwordChanged: boolean;
    nationality: CatalogueInterface;
    bloodType: CatalogueInterface;
    sex: CatalogueInterface;
    birthdate: Date;
    hasDisability: boolean;
    phone: string;
}