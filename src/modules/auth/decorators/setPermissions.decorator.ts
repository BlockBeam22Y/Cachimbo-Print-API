import { SetMetadata } from "@nestjs/common";

export const SetPermissions = (...permissions: bigint[]) => SetMetadata(
    'permissions',
    permissions.reduce((acc, permission) => {
        acc |= permission;

        return acc;
    }, 0n),
);