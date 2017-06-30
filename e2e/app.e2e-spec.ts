import { DatingClientAngularPage } from './app.po';

describe('dating-client-angular App', () => {
  let page: DatingClientAngularPage;

  beforeEach(() => {
    page = new DatingClientAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
