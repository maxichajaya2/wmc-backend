import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DocumentType } from '../../domain/entities/web-user.entity';

const API_URL = "https://secure2.iimp.org:8443/KBServicesAppJavaEnvironment/rest/ValidarAsociado";

interface ValidatePayload {
    eventTypeCode: number;
    eventCode: number;
    documentType: DocumentType;
    documentNumber: string;
}

export interface ValidateSieResponse {
    response: Response;
}

export interface Response {
    Code: string;
    Message: string;
}

@Injectable()
export class SieService {
    async validate(payload: ValidatePayload) {
        const { eventTypeCode, eventCode, documentType, documentNumber } = payload;
        try {
            const body = {
                "TipEvCod": eventTypeCode,
                "EvenCod": eventCode,
                "TipDoc": documentType === DocumentType.DNI ? "1" : "2",
                "NumDoc": documentNumber
            };
            const { data } = await axios.post(API_URL, body);
            const { response } = data;
            const { Code, Message } = response;
            if (Code === "00") {
                return {
                    ok: true,
                    payload: Message
                };
            }
            return {
                ok: false,
                payload: Message
            };
        } catch (error) {
            console.log(error.message);
            return {
                ok: false,
                payload: "Ocurrió un error al validar el documento"
            };
        }
    }
}
