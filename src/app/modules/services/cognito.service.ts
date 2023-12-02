import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { Amplify } from '@aws-amplify/core';
import { signIn, type SignInInput, signOut, signUp , confirmSignUp, type ConfirmSignUpInput} from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import * as awsamplify from './../../../../amplify-config'





import { environment } from '../../../environment/environment';

export interface IUser {
  email: string;
  password: string;
}

type SignUpParameters = {
  username: string;
  password: string;
  // email: string;
  // phone_number: string;
};

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  private authenticationSubject: BehaviorSubject<any>;

  constructor() {

    Amplify.configure(awsamplify.config);

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public handleSignIn(user: IUser): Promise<any> {
    const login: SignInInput = {
      username: user.email,
      password: user.password
    }
    return signIn(login)
      .then(() => {
        console.log()
        this.authenticationSubject.next(true);
      });
  }

  async handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  async handleSignUp({
    username,
    password,
    // email
    // phone_number
  }: SignUpParameters) {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            // email,
            // phone_number // E.164 number convention
          },
          // optional
          autoSignIn: true // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
        }
      });

      console.log(userId);
    } catch (error) {
      console.log('error signing up:', error);
    }
  }

  async  handleSignUpConfirmation({
    username,
    confirmationCode
  }: ConfirmSignUpInput) {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode
      });
    } catch (error) {
      console.log('error confirming sign up', error);
    }
  }
}
