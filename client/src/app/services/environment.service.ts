/* Injectable e isDevMode */
import { Injectable, isDevMode } from '@angular/core';

/* Import dev environment variables */
import { environment as environmentProd } from '../../environments/environment.prod';
import { environment } from '../../environments/environment';

@Injectable()
export class EnvironmentService {
  env: object = {};
  constructor() {
    this.getEnvironment();
  }

  getEnvironment() {
    if (isDevMode()) {
      return (this.env = {
        host: environment.host
      });
    } else {
      return (this.env = {
        host: environmentProd.host
      });
    }
  }
}
