import firebase from "firebase";
import { ActionTypes } from "./action-types";
import { ActionContext, ActionTree } from "vuex";

import { Mutations } from "../mutations/mutations";
import { MutationTypes } from "../mutations/mutation-types";

import { State } from "../state";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, "commit">;

export interface Actions {
  [ActionTypes.SIGN_UP](
    { commit }: AugmentedActionContext,
    payload: any
  ): Promise<any>;
}

export const actions: ActionTree<State, State> & Actions = {
  async [ActionTypes.SIGN_UP](
    context,
    payload: { email: string; password: string }
  ) {
    const { email, password } = payload;
    const userCredentials = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    console.log(userCredentials);
    context.commit(MutationTypes.SET_USER, userCredentials);
  },
};
