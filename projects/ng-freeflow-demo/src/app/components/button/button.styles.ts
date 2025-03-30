import { ContainerStyleSheet } from 'ng-freeflow-lib';

export const styles = {
  button: {
    width: 100,
    height: 40,
    borderRadius: 3,
    borderColor: '#000000',
    borderWidth: 2,
    backgroundColor: '#e74c3c',
    onFocus: {
      borderColor: '#ff0000',
      backgroundColor: '#ffff00',
    },
    onHover: {
      borderColor: '#ff0000',
      backgroundColor: '#ffffff',
    },
  } satisfies ContainerStyleSheet,
};
