import { signal } from '@angular/core';
import { ContainerStyleSheet, HtmlStyleSheet } from 'ngx-freeflow-lib';

export const styles = {
  controls: () =>
    ({
      marginLeft: signal(10),
      marginRight: signal(10),
      marginBottom: signal(10),
    }) satisfies HtmlStyleSheet,

  header: () =>
    ({
      // marginBottom: 5,
    }) satisfies HtmlStyleSheet,

  button: () =>
    ({
      marginLeft: signal(10),
      marginRight: signal(10),
      marginBottom: signal(10),
    }) satisfies ContainerStyleSheet,
};
