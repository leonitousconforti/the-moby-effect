declare module "stun" {
    export class StunMessage {
        getXorAddress: () => { address: string };
    }

    export function request(url: string): Promise<StunMessage>;
}
