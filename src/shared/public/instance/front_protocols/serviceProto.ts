import { ServiceProto } from 'tsrpc-proto';
import { MsgPing } from './MsgPing';
import { MsgUserNotice } from './MsgUserNotice';

export interface ServiceType {
    api: {

    },
    msg: {
        "Ping": MsgPing,
        "UserNotice": MsgUserNotice
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 1,
    "services": [
        {
            "id": 0,
            "name": "Ping",
            "type": "msg"
        },
        {
            "id": 1,
            "name": "UserNotice",
            "type": "msg"
        }
    ],
    "types": {
        "MsgPing/MsgPing": {
            "type": "Interface"
        },
        "MsgUserNotice/MsgUserNotice": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "noticeType",
                    "type": {
                        "type": "Reference",
                        "target": "../../../type/Type/eUserNotice"
                    }
                }
            ]
        },
        "../../../type/Type/eUserNotice": {
            "type": "Enum",
            "members": [
                {
                    "id": 0,
                    "value": 0
                }
            ]
        }
    }
};