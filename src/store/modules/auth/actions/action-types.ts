import firebase from "firebase";
import { UserCredentials, UserProfile } from "@/store/types";
import { ActionContext } from "vuex";
import { Mutations } from "../mutations/mutation-types";
import { State as RootState } from "@/store";
import { State } from "../state";
import { AxiosRequestConfig } from "axios";

export enum ActionTypes {
  SIGN_UP = "SIGN_UP",
  SIGN_IN = "SIGN_IN",
  LOG_OUT = "LOG_OUT",
  CREATE_PROFILE = "CREATE_PROFILE",
  LOAD_PROFILE = "LOAD_PROFILE",
  GET_USER_SUBSCRIPTION_PLAN = "GET_USER_SUBSCRIPTION_PLAN",
  SET_AUTHORIZATION_HEADER = "SET_AUTHORIZATION_HEADER",
}

export interface Actions {
  [ActionTypes.SIGN_UP](
    { commit }: AugmentedActionContext,
    payload: UserCredentials
  ): Promise<firebase.auth.UserCredential>;
  [ActionTypes.SIGN_IN](
    { commit }: AugmentedActionContext,
    payload: UserCredentials
  ): void;
  [ActionTypes.LOG_OUT](context: AugmentedActionContext): Promise<void>;
  [ActionTypes.CREATE_PROFILE](
    context: AugmentedActionContext,
    payload: UserProfile
  ): void;
  [ActionTypes.LOAD_PROFILE](context: AugmentedActionContext): Promise<void>;
  [ActionTypes.GET_USER_SUBSCRIPTION_PLAN](
    context: AugmentedActionContext
  ): void;
  [ActionTypes.SET_AUTHORIZATION_HEADER](
    context: AugmentedActionContext,
    axiosConfig: AxiosRequestConfig
  ): Promise<AxiosRequestConfig | undefined>;
}

export type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key?: K,
    payload?: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;
