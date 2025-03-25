import {
  RootStyleSheet,
  ContainerStyleSheet,
  ImageStyleSheet,
} from 'ng-freeflow-lib';

export const styles = {
  root: {
    width: 200,
  } satisfies RootStyleSheet,
  container: {
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
    marginTop: 5,
    marginBottom: 10,
  } satisfies ContainerStyleSheet,
  resizeableContainer: {
    height: 40,
    borderRadius: 5,
    backgroundColor: '#0000ff',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 5,
    marginLeft: 5,
  } satisfies ContainerStyleSheet,
  emptyContainer: {
    height: 40,
    borderRadius: 5,
    backgroundColor: '#0000ff',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
  } satisfies ContainerStyleSheet,
  image: {
    height: 40,
  } satisfies ImageStyleSheet,
  deepestContainer: {
    height: 20,
    borderRadius: 5,
    backgroundColor: '#00ff00',
  } satisfies ContainerStyleSheet,
};
