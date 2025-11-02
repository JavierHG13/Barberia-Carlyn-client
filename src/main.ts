import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';

import { App } from './app/app';

/*bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));*/

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(),
  ],
})
.catch((err) => console.error(err));
