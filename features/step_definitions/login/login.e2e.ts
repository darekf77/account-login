import { Login } from './login.po';
import { Helpers } from '../../support/helpers';
let expect = Helpers.expect();
let login = new Login();

module.exports = function () {

  this.Given(/^User on main page$/, (callback) => {
    // Write code here that turns the phrase above into concrete actions
    browser.get(login.urlBASE).then(() => {
      browser.getCurrentUrl().then(url => {
        url = url.charAt(url.length - 1) === '/' ? url.slice(0, url.length - 1) : url;
        expect(url).to.equal(login.urlBASE);
        callback();
      })
    })

  });

  this.Given(/^User with opened sign in modal$/, (callback) => {

    login.btShowModal.click().then(() => {
      browser.sleep(1000).then(() => {
        expect(login.modalBody.isDisplayed()).to.eventually.be.true.and.notify(callback);
      })
    });

  });

  this.When(/^User enterd username "([^"]*)" , password "([^"]*)" and company name "([^"]*)"$/,
    (username, password, company, callback) => {
      // Write code here that turns the phrase above into concrete actions

      protractor.promise.all([
        login.inputModalUsername,
        login.inputModalPassword,
        login.inputModalCompanyName,
        login.btSiginIn
      ]).then(() => {
        login.inputModalUsername.sendKeys(username).then(() => {
          return login.inputModalPassword.sendKeys(password);
        }).then(() => {
          return login.inputModalCompanyName.sendKeys(company)
        }).then(() => {
          login.btSiginIn.click().then(() => callback());
        });
      });

    });

  this.Then(/^Is redireced to dashboad$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    expect(browser.getCurrentUrl()).to.eventually.equal(login.urlDashboard).and.notify(callback);
  });

  this.When(/^User use logout button$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    login.btLogout.isDisplayed().then(() => {
      return browser.sleep(1000);
    }).then(() => {
      login.btLogout.click().then(() => callback());
    })

  });

  this.Then(/^He goes back to main page$/, (callback) => {
    // Write code here that turns the phrase above into concrete actions
    expect(browser.getCurrentUrl()).to.eventually.equal(login.urlLogin).and.notify(callback);
  });

  this.Then(/^Error appears in modal form$/, callback => {
    let error = login.errorMessage;
    expect(error.isDisplayed()).to.eventually.be.true.and.notify(callback);
  })

};
