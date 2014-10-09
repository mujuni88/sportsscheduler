describe('Userform intergration/e2e test', function(){
    var email = element(by.model('userform.email'));
    var phone = element(by.model('userform.phone'));
    var submitBtn = element.all(by.css('.btn'));
    var hasErrors = element.all(by.css('.has-error'));
    var entries = element.all(by.repeater('entry in entries'));
    var count;

    var user = {
        email:'jbuza@cspire.com',
        phone:'6626174248'
    };

    beforeEach(function(){
        browser.get('/#!/form');

        entries.count().then(function(c){
            count = c;
        });
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toContain('MEAN.JS');
    });

    it('should be in pristine state', function(){
        expect(email.getAttribute('class')).toContain('ng-pristine');
        expect(phone.getAttribute('class')).toContain('ng-pristine');
    });

    it('should sign in the users', function(){
        email.sendKeys(user.email);
        phone.sendKeys(user.phone);
        submitBtn.first().click();

        // check whether the entry list has increased
        expect(entries.count()).toEqual(count + 1);

        // check whether the correct information is on the list
        expect(entries.last().getText()).toContain(user.email);
    });
    it('should provide errors when using invalid credentials', function(){
        email.sendKeys('1111111111111@1');
        phone.sendKeys('66174248');

        expect(phone.getAttribute('class')).toContain('ng-invalid');
        expect(email.getAttribute('class')).toContain('ng-invalid');
        expect(hasErrors.first().getText()).toContain('valid email');
        expect(hasErrors.last().getText()).toContain('valid phone');

        email.clear();
        phone.clear();
        expect(hasErrors.first().getText()).toContain('Required');
        expect(hasErrors.last().getText()).toContain('Required');
    });

});