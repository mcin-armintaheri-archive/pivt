import QuadViewOrthoPlanesPage from './QuadViewOrthoPlanesPage';
import Page from '../Page';

export default class QuadViewOrthoPlanes extends Page {
  constructor(canvas3ds) {
    super(canvas3ds);
    this.page = QuadViewOrthoPlanesPage;
  }
}
