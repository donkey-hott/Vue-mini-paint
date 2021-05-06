import { Mutations as AuthMutations } from "@/store/modules/auth/mutations/mutation-types";
import { Mutations as PictureMutations } from "@/store/modules/pictures/mutations/mutation-types";

export type RootMutations = AuthMutations & PictureMutations;

// import { ActionTypes as AuthActions } from "@/store/modules/auth/actions/action-types";
// import { ActionTypes as PictureActions } from "@/store/modules/pictures/actions/action-types";

// export const RootActions = { ...AuthActions, ...PictureActions };
