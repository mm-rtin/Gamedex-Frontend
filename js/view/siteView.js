// SITEVIEW
(function(SiteView, gamedex, $, _, alertify) {
    "use strict";

    // module references
    var User = gamedex.module('user'),
        ItemData = gamedex.module('itemData'),
        TagView = gamedex.module('tagView'),
        ItemView = gamedex.module('itemView'),
        SearchView = gamedex.module('searchView'),
        Storage = gamedex.module('storage'),
        GridView = gamedex.module('gridView'),

        // constants
        FORM_TYPES = {'login': 0, 'signup': 1},
        LOAD_DELAY = 600,

        // properties
        currentlyViewingUsername = 'Demo',
        siteLoaded = false,
        formType = FORM_TYPES.login,
        rememberMe = false,
        siteGuideCurrentStep = 1,

        // data

        // jquery cache
        // container
        $content = $('#content'),

        // header
        $infoHeader = $('#infoHeader'),
        $header = $('#header'),
        $userMenu = $('#userMenu'),
        $loggedInButton = $('#loggedInButton'),
        $miniLogo = $('.miniLogo'),

        // nav buttons
        $managementButton = $('#managementButton'),
        $updateProfileButton = $('#updateProfileButton'),
        $changePasswordButton = $('#changePasswordButton'),
        $logoutButton = $('#logoutButton'),
        $hideInfoHeaderButton = $('#hideInfoHeader_btn'),
        $showInfoHeaderButton = $('#showInfoHeader_btn'),

        // login/signup
        $loginForm = $('#loginForm'),
        $buttonContainer = $('#buttonContainer'),
        $loginButton = $('#loginButton'),
        $loginHitArea = $('#loginHitArea'),
        $signupButton = $('#signupButton'),
        $signupHitArea = $('#signupHitArea'),
        $loginSubmitButton = $('#loginSubmitButton'),
        $signupSubmitButton = $('#signupSubmitButton'),
        $backButton = $('#backButton'),
        $email = $('#email').find('input'),
        $password = $('#password').find('input'),
        $rememberCheckboxToggle = $('#rememberCheckboxToggle'),
        $resetPasswordButton = $('#resetPasswordButton'),
        $invalidLoginTag = $('#invalidLoginTag'),
        $accountExistsTag = $('#accountExistsTag'),

        // account management
        $accountManagementModal = $('#accountManagement-modal'),
        $clearLocalStorageButton_account = $accountManagementModal.find('#clearLocalStorage_btn'),
        $successAlert_account = $accountManagementModal.find('.alert-success'),
        $errorAlert_account = $accountManagementModal.find('.alert-error'),

        // delete account
        $existingPasswordGroup_account = $accountManagementModal.find('.existingPasswordGroup'),
        $existingPassword_account = $('#accountPasswordField'),
        $deleteUser_account = $('#deleteAccount_btn'),
        // delete confirm
        $deleteAccountConfirmModal = $('#deleteAccountConfirm-modal'),
        $deleteAccountConfirmButton_account = $('#deleteAccountConfirm_btn'),

        // update profile
        $updateProfileModal = $('#updateProfile-modal'),
        $userNameGroup_profile = $updateProfileModal.find('.usernameGroup'),
        $userNameUpdate_profile = $updateProfileModal.find('#userNameUpdateField'),
        $emailGroup_profile = $updateProfileModal.find('.emailGroup'),
        $emailUpdate_profile = $updateProfileModal.find('#emailUpdateField'),
        $existingPassword_profile = $updateProfileModal.find('#profilePasswordField'),
        $existingPasswordGroup_profile = $updateProfileModal.find('.existingPasswordGroup'),
        $successAlert_profile = $updateProfileModal.find('.alert-success'),
        $errorAlert_profile = $updateProfileModal.find('.alert-error'),
        $submitButton_profile = $updateProfileModal.find('#updateAccount_btn'),
        $profileURL = $updateProfileModal.find('.profileURL'),

        // change password
        $changePasswordModal = $('#changePassword-modal'),
        $existingPasswordGroup_change = $changePasswordModal.find('.existingPasswordGroup'),
        $confirmPasswordGroup_change = $changePasswordModal.find('.confirmPasswordGroup'),
        $newPasswordGroup_change = $changePasswordModal.find('.newPasswordGroup'),

        $newPassword_change = $changePasswordModal.find('#passwordUpdateField'),
        $confirmPassword_change = $changePasswordModal.find('#passwordConfirmField'),
        $existingPassword_change = $changePasswordModal.find('#existingPasswordField'),

        $errorAlert_change = $changePasswordModal.find('.alert-error'),
        $successAlert_change = $changePasswordModal.find('.alert-success'),
        $submitButton_change = $changePasswordModal.find('#changePassword_btn'),

        // reset password
        $resetpasswordModal = $('#resetpassword-modal'),
        $codeForm_reset = $resetpasswordModal.find('.resetCodeForm'),
        $passwordForm_reset = $resetpasswordModal.find('.updatePasswordForm'),
        $codeContainer_reset = $resetpasswordModal.find('.passwordResetCodeContainer'),
        $emailContainer_reset = $resetpasswordModal.find('.passwordResetEmailContainer'),
        $sucessAlert_reset = $resetpasswordModal.find('.alert-success'),
        $errorAlert_reset = $resetpasswordModal.find('.alert-error'),

        $existingEmail_reset = $('#resetPasswordEmailField'),
        $code_reset = $('#resetPasswordCodeField'),
        $password_reset = $('#resetPasswordPasswordField'),

        $sendResetCodeButton_reset = $('#sendResetCode_btn'),
        $submitResetCodeButton_reset = $('#submitResetCode_btn'),
        $updatePasswordButton_reset = $('#updatePassword_btn'),

        // site guide
        $guideHitArea = $('#guideHitArea'),
        $guideButton = $('#guideButton'),
        $siteGuide = $('#siteGuide'),
        $siteGuideBackdrop = $('#siteGuideBackdrop'),
        $siteGuideExitButton = $siteGuide.find('.siteGuideExit_btn'),
        $siteGuidePreviousButton = $siteGuide.find('.siteGuidePrevious_btn'),
        $siteGuideNextButton = $siteGuide.find('.siteGuideNext_btn'),

        $searchInput = $('#searchField input'),

        // loading status
        $loadingStatus = $('#itemResultsContainer').find('.loadingStatus');

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * init
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var init = function() {

        // configure alertify
        alertify.set(
            {
                labels: {
                    ok: "Close",
                    cancel: "Close"},
                delay: 2000
            }
        );

        createEventHandlers();

        // init login form
        initLoginForm();

        // setup password reset modal
        $resetpasswordModal.modal({backdrop: true, keyboard: true, show: false});

        setupUser();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * createEventHandlers -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var createEventHandlers = function() {

        // history state: popstate
        window.addEventListener('popstate', function(event) {
            var path = window.location.pathname;
            route(path);
        });

        // hideInfoHeaderButton: click
        $hideInfoHeaderButton.click(function(e) {
            e.preventDefault();
            showDemoView();
        });

        // showInfoHeaderButton: click
        $showInfoHeaderButton.click(function(e) {
            e.preventDefault();
            showInfoView();
        });

        // managementButton: click
        $managementButton.click(function(e) {
            e.preventDefault();
            showAccountManagement();
        });
        // updateProfileButton: click
        $updateProfileButton.click(function(e) {
            e.preventDefault();
            showUpdateProfile();
        });
        // changePasswordButton: click
        $changePasswordButton.click(function(e) {
            e.preventDefault();
            showChangePassword();
        });

        // updateAccountSubmit: click
        $submitButton_profile.click(function(e) {
            e.preventDefault();
            updateAccount();
        });

        // changePasswordSubmit: click
        $submitButton_change.click(function(e) {
            e.preventDefault();
            changePassword();
        });

        // email field: keydown
        $email.on('keydown', function(e) {
            submitForm(e.which);
        });

        // password field: keydown
        $password.on('keydown', function(e) {
            submitForm(e.which);
        });

        // logout button: click
        $logoutButton.click(function(e) {
            e.preventDefault();
            // logout
            logout();
        });

        $miniLogo.on('click', function(e) {
            logout();
        });

        // clearLocalStorageButton: click
        $clearLocalStorageButton_account.click(function(e) {
            e.preventDefault();
            Storage.clearStorage();
        });

        // deleteAccountButton: click
        $deleteUser_account.click(function(e) {
            e.preventDefault();
            deleteAccount();
        });

        // deleteAccountConfirmButton_account: click
        $deleteAccountConfirmButton_account.click(function(e) {
            e.preventDefault();
            deleteAccountFinal();
        });

        // signupHitArea
        $signupHitArea.click(function(e) {
            e.preventDefault();
            showSignupForm();
        });
        $signupHitArea.mouseover(function(e) {
            $signupButton.addClass('hover');
        });
        $signupHitArea.mouseout(function(e) {
            $signupButton.removeClass();
        });
        $signupHitArea.mousedown(function(e) {
            $signupButton.addClass('active');
        });
        $signupHitArea.mouseup(function(e) {
            $signupButton.removeClass('active');
        });

        // loginHitArea
        $loginHitArea.click(function(e) {
            e.preventDefault();
            showLoginForm();
        });
        $loginHitArea.mouseover(function(e) {
            $loginButton.addClass('hover');
        });
        $loginHitArea.mouseout(function(e) {
            $loginButton.removeClass();
        });
        $loginHitArea.mousedown(function(e) {
            $loginButton.addClass('active');
        });
        $loginHitArea.mouseup(function(e) {
            $loginButton.removeClass('active');
        });

        // guideHitArea
        $guideHitArea.click(function(e) {
            showSiteGuide();
        });
        $guideHitArea.mouseover(function(e) {
            $guideButton.addClass('hover');
        });
        $guideHitArea.mouseout(function(e) {
            $guideButton.removeClass();
        });
        $guideHitArea.mousedown(function(e) {
            $guideButton.addClass('active');
        });
        $guideHitArea.mouseup(function(e) {
            $guideButton.removeClass('active');
        });

        // login submit button: click
        $loginSubmitButton.click(function(e) {
            e.preventDefault();
            // login
            login($email.val(), $password.val());
        });

        // signup submit button: click
        $signupSubmitButton.click(function(e) {
            e.preventDefault();
            // signup
            signup($email.val(), $password.val());
        });

        // back button: click
        $backButton.click(function(e) {
            e.preventDefault();

            showFormNavigation();
        });

        // rememberCheckboxToggle: click
        $rememberCheckboxToggle.click(function(e) {
            if (rememberMe) {
                rememberMe = false;
                $(this).removeClass('on');
                setupRememberMe();
            } else {
                rememberMe = true;
                $(this).addClass('on');
            }
        });

        /* RESET PASSWORD
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        // resetPasswordButton: click
        $resetPasswordButton.click(function(e) {
            e.preventDefault();

            // get e-mail storage key
            var email = $email.val() || Storage.getGlobal('email');

            // populate field
            if (email) {
                $existingEmail_reset.val(email);
            }

            $resetpasswordModal.modal('show');

            _.delay(function() {
                $existingEmail_reset.focus().select();
            }, 1000);
        });
        // sendResetCodeButton: click
        $sendResetCodeButton_reset.click(function(e) {
            e.preventDefault();

            // send reset password code
            sendResetPasswordCode($existingEmail_reset.val());
        });

        // submitResetCodeButton: click
        $submitResetCodeButton_reset.click(function(e) {
            e.preventDefault();
            // submit reset password code
            submitResetPasswordCode($existingEmail_reset.val(), $code_reset.val());
        });

        // updatePasswordButton: click
        $updatePasswordButton_reset.click(function(e) {
            e.preventDefault();
            // update password
            updatePassword($existingEmail_reset.val(), $code_reset.val(), $password_reset.val());
        });

        // resetPasswordEmailField: keydown
        $existingEmail_reset.keydown(function(e) {

            if (e.which === 13) {
                e.preventDefault();
                // send reset password code
                sendResetPasswordCode($existingEmail_reset.val());
            }
        });

        // resetPasswordCodeField: keydown
        $code_reset.keydown(function(e) {

            if (e.which === 13) {
                e.preventDefault();
                // submit reset password code
                submitResetPasswordCode($existingEmail_reset.val(), $code_reset.val());
            }
        });

        // resetPasswordPasswordField: keydown
        $password_reset.keydown(function(e) {

            if (e.which === 13) {
                e.preventDefault();
                // update password
                updatePassword($existingEmail_reset.val(), $code_reset.val(), $password_reset.val());
            }
        });

        // siteGuideBackdrop: click
        $siteGuide.click(function(e) {
            e.preventDefault();
            e.stopPropagation();
        });

        // siteGuideNextButton: click
        $siteGuideNextButton.click(function(e) {
            e.preventDefault();

            // next step
            showSiteGuide(++siteGuideCurrentStep);
        });


        // siteGuidePreviousButton: click
        $siteGuidePreviousButton.click(function(e) {
            e.preventDefault();

            // next step
            showSiteGuide(--siteGuideCurrentStep);
        });


        // siteGuideExitButton: click
        $siteGuideExitButton.click(function(e) {
            e.preventDefault();

            // reset step
            siteGuideCurrentStep = 1;

            showSiteGuide(siteGuideCurrentStep);

            hideSiteGuide();
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * route - setup new user on history api state pop
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var route = function(path) {

        currentlyViewingUsername = 'Demo';

        if (siteLoaded) {
            setupUser();
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * initLoginForm -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var initLoginForm = function() {

        // get e-mail storage key
        var email = Storage.getGlobal('email');

        // populate field
        if (email) {
            rememberMe = true;
            $email.val(email);
            $rememberCheckboxToggle.addClass('on');
            $password.focus();
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * setupRememberMe -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var setupRememberMe = function() {

        if (rememberMe) {
            Storage.setGlobal('email', $email.val());
        } else {
            Storage.removeGlobal('email');
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * login -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var login = function(email, password) {

        resetLoginForm();

        // send login request
        User.login(email, password, login_result);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * resetLoginForm -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var resetLoginForm = function() {

        $password.val('');

        $invalidLoginTag.hide();
        $accountExistsTag.hide();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * setupUser -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var setupUser = function() {

        // get url path parts
        var urlPathParts = window.location.pathname.split( '/' );
        var userName = urlPathParts[1];

        // view public user
        if (userName !== '') {

            // validate user
            User.validateUser(userName, function(data) {

                // start app with user info
                if (data.status === 'success') {
                    viewUser(userName);
                } else {
                    viewUserError(userName);
                }
            });

        // demo app
        } else if (!siteLoaded) {
            startDemo();
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * startDemo -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var startDemo = function() {

        alertify.success('Loading Demo');

        // reset user view
        resetFromUserView();

        // demo login
        User.demoLogin();

        // start user app
        startApp();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * viewUser -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var viewUser = function(userName) {

        currentlyViewingUsername = userName;

        alertify.success('Loading User: ' + userName);

        showUserView(userName);

        // start app with viewing user data
        startApp();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * viewUserError -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var viewUserError = function(userName) {

        alertify.alert('User "' + userName + '" not found');

        // start app with viewing user data
        startDemo();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * resetFromUserView -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var resetFromUserView = function() {

        // set history state to root
        var path = window.location.pathname;
        if (history && path !== '/') {
            history.pushState(null, null, '/');
        }

        // remove viewOnly class
        $('body').removeClass('viewOnly');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * startApp - user credentials must be available before calling
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var startApp = function() {

        // show loading status
        $loadingStatus.addClass('show');

        // clear view and item data
        ItemView.clearItemView();
        ItemView.resizePanel();
        ItemData.resetItemData();

        // delay app loading
        window.setTimeout(function() {

            // returned data
            var itemsReturnedData = null;
            var listReturnedData = null;

            // directory request promise
            var directoryRequest = ItemData.downloadItemDirectory();

            // items request promise
            var itemsRequest = ItemView.initializeUserItems(function(items) {
                itemsReturnedData = items;

            }, function() {
                itemsReturnedData = {};
            });

            // get user tags
            var tagRequest = TagView.getTags(function(data) {
                listReturnedData = data;

            }, function() {

            });

            // deferreds: wait for itemsRequest and directoryRequest
            $.when(itemsRequest, directoryRequest, tagRequest).then(

                // all ajax requests returned
                function() {

                    // list result
                    TagView.getTags_result(listReturnedData);

                    // itemView result
                    ItemView.initializeUserItems_result(itemsReturnedData);

                    // hide loading status
                    $loadingStatus.removeClass('show');

                    // site finished loading
                    siteLoaded = true;
                },
                function() {

                }
            );

        }, LOAD_DELAY);
    };


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * logout -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var logout = function() {

        currentlyViewingUsername = 'Demo';

        // return to info view
        showInfoView();

        // clear view
        ItemView.clearItemView();

        // exit gridView
        GridView.exitGridView();

        // logout user
        User.logout();

        // start demo app
        startDemo();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * signup -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var signup = function(email, password) {

        resetLoginForm();

        // validate
        if (email !== '' && password !== '') {
            // create user
            User.createUser(email, password, signup_result);
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * login_result -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var login_result = function(data, email) {

        // success
        if (data.status === 'success') {

            setupRememberMe();

            // show logged in view
            showLoggedInView(email);

            // start user app
            startApp();

        // invalid login
        } else if (typeof data.status !== 'undefined' && data.status === 'invalid_login') {

            alertify.error('Login Failed: ' + email);

            // show invalid login tag
            $invalidLoginTag.fadeIn();
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * signup_result -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var signup_result = function(data, email) {

        // returned error status
        if (typeof data.status !== 'undefined' && data.status === 'user_exists') {

            $accountExistsTag.fadeIn();

        // success
        } else {

            setupRememberMe();

            // login new user
            login_result(data, email);
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showSiteGuide -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showSiteGuide = function(step) {

        if (step) {
            // remove all classes
            $content.removeClass();

            // add step1 class
            $content.addClass('step' + step);
        }

        // show site guide overlay
        if (!$siteGuide.is(':visible')) {
            $siteGuide.show();
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * hideSiteGuide -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var hideSiteGuide = function() {

        if ($siteGuide.is(':visible')) {
            $siteGuide.hide();
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * sendResetPasswordCode -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var sendResetPasswordCode = function(email) {

        User.sendResetPasswordCode(email, sendResetPasswordCode_result);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * sendResetPasswordCode_result -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var sendResetPasswordCode_result = function(data) {

        // e-mail sent: success
        if (typeof data.status !== 'undefined' && data.status === 'success') {

            // hide previous buttons
            $sendResetCodeButton_reset.hide();
            $submitResetCodeButton_reset.show();

            // hide email field
            $emailContainer_reset.hide();
            // show code field
            $codeContainer_reset.show();

            // show success alert
            $sucessAlert_reset.find('.alertTitle').text('E-mail sent:');
            $sucessAlert_reset.show().find('.alertText').html('Check your e-mail and enter the <strong>3-digit code</strong> into the field above');

            $errorAlert_reset.hide();

        // invalid e-mail address
        } else if (typeof data.status !== 'undefined' && data.status === 'invalid_email') {

            // show error alert
            $errorAlert_reset.find('.alertTitle').text('Invalid E-mail address:');
            $errorAlert_reset.show().find('.alertText').html('Cannot send password reset code');
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * submitResetPasswordCode -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var submitResetPasswordCode = function(email, resetCode) {

        User.submitResetPasswordCode(email, resetCode, submitResetPasswordCode_result);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * submitResetPasswordCode_result -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var submitResetPasswordCode_result = function(data) {

        // show update password form
        if (typeof data.status !== 'undefined' && data.status === 'success') {

            // hide previous form and buttons
            $codeForm_reset.hide();
            $submitResetCodeButton_reset.hide();

            // show password form and button
            $passwordForm_reset.show();
            $updatePasswordButton_reset.show();

            // hide success alert
            $sucessAlert_reset.hide();
            $errorAlert_reset.hide();

        // incorrect code
        } else {

            $sucessAlert_reset.hide();

            // show error alert
            $errorAlert_reset.find('.alertTitle').text('Invalid code:');
            $errorAlert_reset.show().find('.alertText').html('Reset code is incorrect, please try again');
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * updatePassword -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var updatePassword = function(email, resetCode, newPassword) {

        User.updatePassword(email, resetCode, newPassword, function(data) {
            updatePassword_result(data, email, newPassword);
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * updatePassword_result -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var updatePassword_result = function(data, email, newPassword) {

        // show update password form
        if (typeof data.status !== 'undefined' && data.status === 'success') {

            // reset modal
            resetResetPasswordModal();

            // auto populate login info
            $email.val(email);
            $password.val(newPassword);

            // auto login
            login($email.val(), $password.val());
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * resetResetPasswordModal -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var resetResetPasswordModal = function() {

        $resetpasswordModal.modal('hide');

        $sendResetCodeButton_reset.show();
        $submitResetCodeButton_reset.hide();
        $updatePasswordButton_reset.hide();

        $codeForm_reset.hide();
        $passwordForm_reset.hide();

        $emailContainer_reset.show();
        $codeContainer_reset.hide();
        $sucessAlert_reset.hide();
        $errorAlert_reset.hide();

        // clear form fields
        $existingEmail_reset.val('');
        $code_reset.val('');
        $password_reset.val('');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showLoggedInView -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showLoggedInView = function(email) {

        resetFromUserView();

        // show use header
        showUseHeader();

        // set user button
        $loggedInButton.find('.userEmail').text(email);

        // show user menu
        $userMenu.show();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showUserView -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showUserView = function(userName) {

        // show use header
        showUseHeader();

        $('body').addClass('viewOnly');

        // set user button
        $loggedInButton.find('.userEmail').text(userName);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showDemoView -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showDemoView = function() {

        // show use header
        showUseHeader();

        $('body').addClass('demo');

        // set user button
        $loggedInButton.find('.userEmail').text(currentlyViewingUsername);
    };


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showInfoView -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showInfoView = function() {

        // show info header
        showInfoHeader();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showUseHeader -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showUseHeader = function() {

        // set new body class
        $('body').removeClass('infoHeader');
        $('body').addClass('useHeader');

        // notify views
        ItemView.loggedInView(true);
        SearchView.loggedInView(true);

        // show user menu
        $userMenu.show();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showInfoHeader -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showInfoHeader = function() {

        // set new body class
        $('body').removeClass('useHeader');
        $('body').addClass('infoHeader');
        $('body').removeClass('viewOnly');
        $('body').removeClass('demo');

        // notify views
        ItemView.loggedInView(false);
        SearchView.loggedInView(false);


        // hide user menu
        $userMenu.hide();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showLoginForm -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showLoginForm = function() {

        formType = FORM_TYPES.login;

        showForms();

        // show login submit button
        $loginSubmitButton.show();

        // hide signup submit button
        $signupSubmitButton.hide();

        // reposition back button
        $backButton.removeClass('signup');
        $backButton.addClass('login');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showSignupForm -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showSignupForm = function() {

        formType = FORM_TYPES.signup;

        showForms();

        // show signup submit button
        $signupSubmitButton.show();

        // hide login submit button
        $loginSubmitButton.hide();

        // reposition back button
        $backButton.removeClass('login');
        $backButton.addClass('signup');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * authenticateUser -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var authenticateUser = function() {


    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showForms -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showForms = function() {

        resetLoginForm();

        // show input form
        $loginForm.show();

        // show back button
        $backButton.show();

        if (rememberMe && $email.val() !== '') {
            $password.focus();
        } else {
            $email.focus();
        }

        // hide main form navigation
        $buttonContainer.hide();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showFormNavigation -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showFormNavigation = function() {

        // hide input form
        $loginForm.hide();

        // hide submit buttons, back button
        $loginSubmitButton.hide();
        $signupSubmitButton.hide();
        $backButton.hide();

        // show main form navigation
        $buttonContainer.show();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * submitForm -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var submitForm = function(key) {

        if (key === 13 && formType === FORM_TYPES.login) {
            login($email.val(), $password.val());

        } else if (key === 13 && formType === FORM_TYPES.signup) {
            signup($email.val(), $password.val());
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showAccountManagement -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showAccountManagement = function() {

        resetUpdateProfileForm();

        // show modal
        $accountManagementModal.modal('show');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showUpdateProfile -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showUpdateProfile = function() {

        resetUpdateProfileForm();

        // populate fields
        var userData = User.getUserData();

        $userNameUpdate_profile.val(userData.userName);
        $emailUpdate_profile.val(userData.email);

        $profileURL.text('http://www.gamedex.net/' + userData.userName);

        // show modal
        $updateProfileModal.modal('show');
    };
    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showChangePassword -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showChangePassword = function() {

        resetUpdateProfileForm();

        // show modal
        $changePasswordModal.modal('show');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * changePassword -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var changePassword = function() {

        resetUpdateProfileForm();

        // existing password field
        var password = $existingPassword_change.val();
        var email = User.getUserData().email;

        var newPassword = $newPassword_change.val();
        var confirmPassword = $confirmPassword_change.val();

        // update password
        if (password !== '' && email !== '' & newPassword !== '' & confirmPassword !== '' & newPassword == confirmPassword) {

            // send update request
            User.updateUser(password, email, '', newPassword, function(data) {

                // update success
                if (data.status === 'success') {

                    $successAlert_change.fadeIn().find('.alertText').text('Password Changed');

                    $newPassword_change.val('');
                    $confirmPassword_change.val('');
                    $existingPassword_change.val('');

                // password incorrect error
                } else if (data.status === 'incorrect_password') {

                    // password update
                    $existingPasswordGroup_change.addClass('error');
                    $errorAlert_change.fadeIn().find('.alertText').text('Incorrect password');

                    $existingPassword_change.val('');
                }
            });
        }


        // no new password
        if (newPassword === '') {
            $newPasswordGroup_change.addClass('error');
            $errorAlert_change.fadeIn().find('.alertText').text('Please enter new password');

        // no password confirm
        } else if (confirmPassword === '') {
            $confirmPasswordGroup_change.addClass('error');
            $errorAlert_change.fadeIn().find('.alertText').text('Please confirm password');

        // no match
        } else if (newPassword !== confirmPassword) {
            $newPassword_change.val('');
            $confirmPassword_change.val('');

            $newPasswordGroup_change.addClass('error');
            $confirmPasswordGroup_change.addClass('error');
            $errorAlert_change.fadeIn().find('.alertText').text('Passwords do not match');

        // no existing password
        } else if (password === '') {
            $existingPasswordGroup_change.addClass('error');
            $errorAlert_change.fadeIn().find('.alertText').text('Please enter existing password');
        }
    };


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * updateAccount -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var updateAccount = function() {

        resetUpdateProfileForm();

        // existing password field
        var password = $existingPassword_profile.val();

        // update fields
        var email = $emailUpdate_profile.val();
        var userName = $userNameUpdate_profile.val();

        // existing password provided
        if (password !== '' && email !== '') {

            // send update request
            User.updateUser(password, email, userName, '', function(data) {

                // update success
                if (data.status === 'success') {

                    $profileURL.text('http://www.gamedex.net/' + userName);

                    // update user email
                    $loggedInButton.find('.userEmail').text(email);

                    $existingPassword_profile.val('');
                    $successAlert_profile.fadeIn().find('.alertText').text('Account updated');

                // password incorrect error
                } else if (data.status === 'incorrect_password') {

                    $existingPassword_profile.val('');
                    $existingPasswordGroup_profile.addClass('error');
                    $errorAlert_profile.fadeIn().find('.alertText').text('Incorrect password');

                // user name exists
                } else if (data.status === 'username_exists') {
                    $userNameGroup_profile.addClass('error');
                    $errorAlert_profile.fadeIn().find('.alertText').text('User name exists');
                }

            });
        }

        // no existing password
        if (password === '') {
            $existingPasswordGroup_profile.addClass('error');
            $errorAlert_profile.fadeIn().find('.alertText').text('Please enter existing password');
        }

        if (email === '') {
            // email empty error
            $emailGroup_profile.addClass('error');
            $errorAlert_profile.fadeIn().find('.alertText').text('E-mail cannot be blank');
        }

        // clear password field
        $newPassword_change.val('');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * deleteAccount -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var deleteAccount = function() {

        resetUpdateProfileForm();

        var password = $existingPassword_account.val();
        var email = User.getUserData().email;

        // verify user
        if (password !== '' && email !== '') {

            // send update request
            User.verifyUser(email, password,

                // on success
                function(data) {

                    // password correct
                    if (typeof data.status !== 'undefined' && data.status == 'success') {

                        // close accoutn modal
                        $accountManagementModal.modal('hide');
                        // launch confirmation modal
                        $deleteAccountConfirmModal.modal('show');

                    // incorrect password
                    } else {

                        $existingPassword_account.val('');

                        $existingPasswordGroup_account.addClass('error');
                        $errorAlert_account.show().find('.alertText').html('Incorrect Password');
                    }
                },

                // on error
                function(data) {
                    $existingPassword_account.val('');
                });

        // pasword blank
        } else {
            $existingPasswordGroup_account.addClass('error');
            $errorAlert_account.show().find('.alertText').html('Please enter existing password');
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * deleteAccountFinal -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var deleteAccountFinal = function() {

        var password = $existingPassword_account.val();
        var userID = User.getUserData().user_id;

        $existingPassword_account.val('');

        User.deleteAccount(userID, password,
            function() {

                // hide modal
                $deleteAccountConfirmModal.modal('hide');

                // clear local storage
                Storage.clearStorage();
                // logout user
                logout();
            },
            function() {
            });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * resetUpdateProfileForm -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var resetUpdateProfileForm = function() {

        // reset form

        // account
        $errorAlert_account.hide();
        $existingPasswordGroup_account.removeClass('error');

        // profile
        $userNameGroup_profile.removeClass('error');
        $emailGroup_profile.removeClass('error');
        $existingPasswordGroup_profile.removeClass('error');

        $successAlert_profile.hide();
        $errorAlert_profile.hide();

        // change password
        $newPasswordGroup_change.removeClass('error');
        $confirmPasswordGroup_change.removeClass('error');
        $existingPasswordGroup_change.removeClass('error');

        $successAlert_change.hide();
        $errorAlert_change.hide();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * PUBLIC METHODS -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var publicMethods = {
        'init': init,
        'hideSiteGuide': hideSiteGuide
    };

    $.extend(SiteView, publicMethods);

})(gamedex.module('siteView'), gamedex, jQuery, _, alertify);

