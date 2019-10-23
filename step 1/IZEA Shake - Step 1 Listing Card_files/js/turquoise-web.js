'use strict';



;define("turquoise-web/adapters/account", ["exports", "turquoise-web/adapters/izeax-api"], function (_exports, _izeaxApi) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _izeaxApi.default.extend({});

  _exports.default = _default;
});
;define("turquoise-web/adapters/application", ["exports", "ember-data/adapters/json-api", "ember-simple-auth/mixins/data-adapter-mixin", "turquoise-web/config/environment"], function (_exports, _jsonApi, _dataAdapterMixin, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _jsonApi.default.extend(_dataAdapterMixin.default, {
    // Injected services
    session: Ember.inject.service(),
    // Properties
    host: _environment.default.turquoise.obsidianApiUrl,
    namespace: 'v1/jasper',

    authorize(xhr) {
      let accessToken = Ember.get(this, 'session.data.authenticated.access_token');
      xhr.setRequestHeader('Authorization', "Bearer ".concat(accessToken));
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/adapters/authenticated-user", ["exports", "turquoise-web/adapters/izeax-api"], function (_exports, _izeaxApi) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _izeaxApi.default.extend({});

  _exports.default = _default;
});
;define("turquoise-web/adapters/izeax-api", ["exports", "ember-data/adapters/json-api", "ember-inflector", "ember-simple-auth/mixins/data-adapter-mixin", "turquoise-web/config/environment"], function (_exports, _jsonApi, _emberInflector, _dataAdapterMixin, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _jsonApi.default.extend(_dataAdapterMixin.default, {
    // Injected services
    currentUser: Ember.inject.service(),
    session: Ember.inject.service(),
    // Properties
    host: _environment.default.turquoise.izeaxApiUrl,
    namespace: 'v5',
    headers: Ember.computed('currentUser.account', function () {
      let headers = {};

      if (Ember.isPresent(this.currentUser.account)) {
        if (!Ember.isBlank(Ember.get(this, 'currentUser.account.id'))) {
          headers['X-IZEA-Account-ID'] = Ember.get(this, 'currentUser.account.id');
        }
      }

      return headers;
    }),

    authorize(xhr) {
      let accessToken = Ember.get(this, 'session.data.authenticated.access_token');
      xhr.setRequestHeader('Authorization', "Bearer ".concat(accessToken));
    },

    // pathForType is necessary because our API contains underscored attributes.
    // JSON API spec suggests camelCased attributes, so we need to tell Ember how
    // to handle these attributes
    pathForType(type) {
      return Ember.String.underscore((0, _emberInflector.pluralize)(type));
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/adapters/upload", ["exports", "ember-data/adapters/json-api", "ember-simple-auth/mixins/data-adapter-mixin", "turquoise-web/config/environment"], function (_exports, _jsonApi, _dataAdapterMixin, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _jsonApi.default.extend(_dataAdapterMixin.default, {
    // Injected services
    session: Ember.inject.service(),
    // Properties
    host: _environment.default.turquoise.obsidianApiUrl,
    namespace: 'v1',

    authorize(xhr) {
      let accessToken = Ember.get(this, 'session.data.authenticated.access_token');
      xhr.setRequestHeader('Authorization', "Bearer ".concat(accessToken));
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/app", ["exports", "turquoise-web/resolver", "ember-load-initializers", "turquoise-web/config/environment"], function (_exports, _resolver, _emberLoadInitializers, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });
  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);
  var _default = App;
  _exports.default = _default;
});
;define("turquoise-web/authenticators/oauth2", ["exports", "ember-simple-auth/authenticators/oauth2-password-grant", "turquoise-web/config/environment"], function (_exports, _oauth2PasswordGrant, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _oauth2PasswordGrant.default.extend({
    serverTokenEndpoint: "".concat(_environment.default.turquoise.diamondApiUrl, "/oauth/token"),
    makeRequest: function (url, data) {
      data.client_id = _environment.default.turquoise.diamondClientId;
      data.client_secret = _environment.default.turquoise.diamondClientSecret;
      return this._super(url, data);
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/authorizers/oauth2", ["exports", "ember-simple-auth/authorizers/oauth2-bearer"], function (_exports, _oauth2Bearer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _oauth2Bearer.default.extend();

  _exports.default = _default;
});
;define("turquoise-web/components/async-image", ["exports", "turquoise-web/utils/transparent-image"], function (_exports, _transparentImage) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  // Based on work from https://github.com/html-next/ember-async-image
  var _default = Ember.Component.extend({
    // Properties passed from parent
    alt: null,
    src: null,
    title: null,
    onload: null,
    // Actions passed from parent
    onError: null,
    // Component properties
    isLoaded: false,
    isLoading: false,
    isFailed: false,
    _src: null,
    _image: null,
    _imageLoadHandler: null,
    _imageErrorHandler: null,
    'data-test-async-container': true,

    /* eslint-disable ember/no-observers */
    _loadImage: Ember.observer('src', function () {
      if (this._image) {
        this.teardownHandlers(this._image);
      }

      if (this.src) {
        Ember.set(this, 'isLoading', true);
        let image = new this.ImageConstructor();

        let loaded = () => {
          Ember.run.next(() => {
            this._onload(image);
          });
        };

        let failed = () => {
          Ember.run.next(() => {
            this._onError(image);
          });
        };

        this._imageLoadHandler = loaded;
        this._imageErrorHandler = failed;
        this._image = image;
        image.addEventListener('load', loaded, true);
        image.addEventListener('error', failed, true);
        image.src = this.src; // image is cached

        if (image.complete || image.readyState === 4) {
          loaded();
        }
      } else {
        this.teardownImage();
      }
    }),

    /* eslint-enable */
    init() {
      this._super(...arguments);

      this._loadImage();
    },

    willDestroyElement() {
      this._super(...arguments);

      this.teardownImage();
    },

    teardownImage() {
      if (this._image) {
        this.teardownHandlers(this._image);
        Ember.set(this, '_src', _transparentImage.default);
        this._image.src = _transparentImage.default;
        this._image = null;
      }
    },

    teardownHandlers(image) {
      image.removeEventListener('load', this._imageLoadHandler, true);
      image.removeEventListener('error', this._imageErrorHandler, true);
      this._imageLoadHandler = null;
      this._imageErrorHandler = null;
    },

    _onload(image) {
      if (!(this.isDestroyed || this.isDestroying)) {
        Ember.setProperties(this, {
          _src: image.src,
          isLoaded: true,
          isLoading: false,
          isFailed: false
        });

        if (this.onload) {
          this.onload();
        }
      }
    },

    _onError() {
      if (!(this.isDestroyed || this.isDestroying)) {
        Ember.set(this, 'isFailed', true);

        if (Ember.get(this, 'onError')) {
          Ember.get(this, 'onError')();
        }

        this.teardownImage();
      }
    },

    // Dependency injection
    ImageConstructor: window.Image
  });

  _exports.default = _default;
});
;define("turquoise-web/components/char-count", ["exports", "ember-char-counter/components/char-count"], function (_exports, _charCount) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _charCount.default;
    }
  });
});
;define("turquoise-web/components/create-attachment", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    store: Ember.inject.service(),
    scopeType: null,
    attachable: null,
    dataUrl: null,
    callback: null,

    async uploadFile(file) {
      let filename = file.name;
      let upload = await this.store.createRecord('upload', {
        filename
      }).save();
      let options = {
        contentType: '',
        data: upload.postParams.fields
      };
      await file.upload(upload.postParams.url, options);
      await file.readAsDataURL().then(url => {
        this.set('dataUrl', url);
      }); // if (this.unsavedAttachable) {
      //   let attachable = await this.unsavedAttachable.save();
      //   let nameParts = attachable.get('constructor.modelName').split('-');
      //   this.set('attachableId', attachable.id);
      //   this.set('attachableType', nameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(''));
      // }

      let nameParts = this.attachable.get('constructor.modelName').split('-');
      let attachableType = nameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
      let model = this.store.createRecord('attachment', {
        uploadId: upload.id,
        tempDataUrl: this.dataUrl,
        scopeType: this.scopeType,
        attachableId: this.attachable.id,
        attachableType: attachableType //,
        // roomCallback: this.roomCallback

      });
      this.attachable.attachments.pushObject(model);

      if (this.callback) {
        this.callback(this.attachable, model);
      }
    },

    actions: {
      uploadFile(file) {
        this.uploadFile(file);
      }

    }
  });

  _exports.default = _default;
});
;define("turquoise-web/components/file-dropzone", ["exports", "ember-file-upload/components/file-dropzone/component"], function (_exports, _component) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _component.default;
    }
  });
});
;define("turquoise-web/components/file-upload", ["exports", "ember-file-upload/components/file-upload/component"], function (_exports, _component) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _component.default;
    }
  });
});
;define("turquoise-web/components/gig-creation-step1", ["exports", "turquoise-web/utils/gig-categories"], function (_exports, _gigCategories) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    // Services:
    currentUser: Ember.inject.service(),
    // Passed in Actions
    goToNextStep: null,
    // Passed in Models
    gig: null,
    sample: null,
    package: null,
    // Properties
    selectedListingCategory: null,
    selectedSubCategory: null,
    selectedPrimaryAction: null,
    listingCategories: Ember.computed('CATEGORIES', function () {
      return _gigCategories.default.listingCategories();
    }),
    subCategories: Ember.computed('selectedListingCategory', function () {
      return _gigCategories.default.subCategoriesByListing(this.selectedListingCategory);
    }),
    primaryActions: Ember.computed('selectedListingCategory', 'selectedSubCategory', function () {
      if (!this.selectedListingCategory || !this.selectedSubCategory) {
        return [];
      }

      return _gigCategories.default.primaryActionBySubCategory(this.selectedListingCategory, this.selectedSubCategory);
    }),
    actions: {
      save() {
        this.gig.save().then(gig => {
          // success:
          this.sample.set('gig', gig);
          this.package.set('gig', gig);

          if (this.sample.attachments) {
            this._saveSample();
          } else {
            this.goToNextStep();
          }
        }, () => {
          // failure:
          console.log("failed to save");
        });
      },

      onSelectListingCategory(value) {
        if (value === '-') {
          value = null;
        }

        this.set('selectedListingCategory', value);
      },

      onSelectSubCategory(value) {
        if (value === '-') {
          value = null;
        }

        this.set('selectedSubCategory', value);
      },

      onSelectPrimaryAction(value) {
        this.set('selectedPrimaryAction', value);
      }

    },

    _saveSample() {
      this.sample.save().then(() => {
        if (this.sample.attachment) {
          this.sample.attachment.setProperties({
            attachableId: this.sample.id,
            tempDataUrl: null
          });
          this.sample.attachment.save().then(() => {
            this.goToNextStep();
          });
        } else {
          this.goToNextStep();
        }
      }, () => {
        // failure:
        console.log("failed to save");
      });
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/components/gig-creation-step2", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    // Services:
    currentUser: Ember.inject.service(),
    store: Ember.inject.service(),
    // Passed in Actions
    goToNextStep: null,
    // Passed in Models
    gig: null,
    sample: null,
    package: null,
    // Models:
    packages: null,
    extras: null,

    init() {
      this._super(...arguments);

      this.setProperties({
        packages: Ember.A(),
        extras: Ember.A()
      }); // Step one starts creating the first package (starting price), so add it to the array.

      if (this.packages.length === 0) {
        this.packages.pushObject(this.package);
      }
    },

    canAddPackage: Ember.computed('packages.[]', function () {
      return this.packages.length < 4;
    }),
    actions: {
      doSave() {
        this.gig.save().then(() => {
          // success:
          this._savePackages();
        }, () => {
          // failure:
          console.log("failed to save");
        });
      },

      doAddPackage() {
        let gigPackage = this.store.createRecord('package', {
          gig: this.gig
        });
        this.packages.pushObject(gigPackage);
      },

      doDeletePackage(selectedPackage) {
        this.packages.removeObject(selectedPackage);
      },

      doAddExtra() {
        let gigExtra = this.store.createRecord('extra', {
          gig: this.gig
        });
        this.extras.pushObject(gigExtra);
      },

      doDeleteExtra(selectedExtra) {
        this.extras.removeObject(selectedExtra);
      },

      doUpdatePackageDelivery(selectedPackage, event) {
        let value = event.target.value;
        selectedPackage.set('deliveryInDays', value);
      },

      doUpdatePackageRevision(selectedPackage, event) {
        let value = event.target.value;
        selectedPackage.set('revisions', value);
      },

      doUpdatePackageLicense(selectedPackage, event) {
        let value = event.target.value;
        console.log('updatePackageLicense called');
        console.log('- selectedPackage: ', selectedPackage);
        console.log('- value:', value);
        console.log('TODO: Need to account for license.....');
      },

      doUpdateExtraDelivery(selectedExtra, event) {
        let value = event.target.value;
        selectedExtra.set('additionalDeliveryInDays', value);
      }

    },

    _savePackages() {
      console.log("_savePackages called");
      let chainedPromises = this.packages.reduce(function (previous, model) {
        return previous.then(model.save.bind(model));
      }, Ember.RSVP.resolve());
      chainedPromises.then(this._saveExtras.bind(this));
    },

    _saveExtras() {
      console.log("_saveExtras called");
      let chainedPromises = this.extras.reduce(function (previous, model) {
        return previous.then(model.save.bind(model));
      }, Ember.RSVP.resolve());
      chainedPromises.then(this.goToNextStep.bind(this));
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/components/gig-creation-step3", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    // Services:
    currentUser: Ember.inject.service(),
    store: Ember.inject.service(),
    // Passed in Models
    gig: null,
    // Models:
    newSample: null,

    init() {
      this._super(...arguments);

      this.set('newSample', this.store.createRecord('sample', {
        gig: this.gig,
        primary: false
      }));
    },

    actions: {
      doSave() {
        this._saveSamples();
      },

      doAttachmentCreated(sample, attachment) {
        console.log("callback running!");
        this.set('newSample', this.store.createRecord('sample', {
          gig: this.gig,
          primary: false
        }));
      }

    },

    _saveSamples() {
      console.log("_saveSamples called");
      let samplesWithAttachments = this.gig.samples.filter(sample => sample.isNew && sample.attachment);
      console.log("- samplesWithAttachments: ", samplesWithAttachments);
      let chainedPromises = samplesWithAttachments.reduce(function (previous, model) {
        return previous.then(model.save.bind(model));
      }, Ember.RSVP.resolve());
      chainedPromises.then(() => {
        this._saveAttachments(samplesWithAttachments);
      });
    },

    _saveAttachments(samples) {
      console.log("_saveAttachments called");
      samples.forEach(sample => {
        sample.attachment.set('attachableId', sample.id);
      });
      let attachments = samples.map(sample => sample.attachment);
      let chainedPromises = attachments.reduce(function (previous, model) {
        return previous.then(model.save.bind(model));
      }, Ember.RSVP.resolve());
      chainedPromises.then(this.goToNextStep.bind(this));
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/components/gig-creation-step4", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    // Services:
    currentUser: Ember.inject.service(),
    store: Ember.inject.service(),
    // Passed in Actions
    goToNextStep: null,
    // Passed in Models
    gig: null,
    // Models:
    requirements: null,

    init() {
      this._super(...arguments);

      this.setProperties({
        requirements: Ember.A()
      });
    },

    actions: {
      doSave() {
        this._saveRequirements();
      },

      doAddRequirement() {
        let gigRequirement = this.store.createRecord('requirement', {
          gig: this.gig
        });
        this.requirements.pushObject(gigRequirement);
      },

      doDeleteRequirement(selectedRequirement) {
        this.requirements.removeObject(selectedRequirement);
      },

      doUpdateAnswerType(selectedRequirement, event) {
        let value = event.target.value;
        selectedRequirement.set('answerType', value);

        if (selectedRequirement.options.length === 0) {
          selectedRequirement.set('options', Ember.A(['', '', '']));
        }
      },

      doSetOption(selectedRequirement, index, event) {
        let value = event.target.value;
        selectedRequirement.options[index] = value;
      },

      doDeleteOption(selectedRequirement, index) {
        let removableOption = selectedRequirement.options[index];
        selectedRequirement.options.removeObject(removableOption);
      },

      doAddOption(selectedRequirement) {
        selectedRequirement.options.pushObject('');
      }

    },

    _saveRequirements() {
      console.log("_saveRequirements called");
      let chainedPromises = this.requirements.reduce(function (previous, model) {
        return previous.then(model.save.bind(model));
      }, Ember.RSVP.resolve());
      chainedPromises.then(this.goToNextStep.bind(this));
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/components/gig-creation-step5", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    // Services:
    currentUser: Ember.inject.service(),
    store: Ember.inject.service(),
    // Passed in Actions
    goToNextStep: null,
    // Passed in Models
    gig: null,
    // Models:
    faqs: null,

    init() {
      this._super(...arguments);

      this.setProperties({
        faqs: Ember.A()
      });
    },

    actions: {
      doSave() {
        this._saveFaqs();
      },

      doAddFaq() {
        let gigFaq = this.store.createRecord('faq', {
          gig: this.gig
        });
        this.faqs.pushObject(gigFaq);
      },

      doDeleteFaq(selectedFaq) {
        this.faqs.removeObject(selectedFaq);
      }

    },

    _saveFaqs() {
      console.log("_saveFaqs called");
      let chainedPromises = this.faqs.reduce(function (previous, model) {
        return previous.then(model.save.bind(model));
      }, Ember.RSVP.resolve());
      chainedPromises.then(this.goToNextStep.bind(this));
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/components/gig-creation-step6", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    // Services:
    currentUser: Ember.inject.service(),
    store: Ember.inject.service(),
    // Passed in Models
    gig: null,
    actions: {
      doSubmitForReview() {
        alert("OK, What now?");
      }

    }
  });

  _exports.default = _default;
});
;define("turquoise-web/components/notification-container", ["exports", "ember-cli-notifications/components/notification-container"], function (_exports, _notificationContainer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _notificationContainer.default;
    }
  });
});
;define("turquoise-web/components/notification-message", ["exports", "ember-cli-notifications/components/notification-message", "ember-get-config"], function (_exports, _notificationMessage, _emberGetConfig) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const globals = _emberGetConfig.default['ember-cli-notifications'] || {}; // Import app config object

  var _default = _notificationMessage.default.extend({
    init() {
      this._super(...arguments);

      this.icons = globals.icons || 'font-awesome';
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/components/number-or-dash", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    number: null,
    numberOrDash: Ember.computed('number', function () {
      return parseInt(this.number, 10) > 0 ? this.number : '-';
    })
  });

  _exports.default = _default;
});
;define("turquoise-web/components/page-numbers", ["exports", "ember-cli-pagination/components/page-numbers"], function (_exports, _pageNumbers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _pageNumbers.default;
    }
  });
});
;define("turquoise-web/components/session-notifications", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    notifications: Ember.inject.service('notification-messages'),
    session: Ember.inject.service(),

    didInsertElement() {
      this._super(...arguments);

      this.get('session.data.notifications').forEach(notification => {
        this["_".concat(notification)]();
      });
      this.set('session.data.notifications', []);
    },

    // Notification Handlers
    _noGigAccess() {
      this.notifications.error('You dont have access to Gigs yet.', {
        autoClear: true,
        clearDuration: 1000
      });
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/components/uploaded-file", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Component.extend({
    store: Ember.inject.service(),
    uploadId: null,
    upload: null,
    tempDataUrl: null,
    showLoader: true,
    showError: false,

    init() {
      this._super(...arguments);

      if (this.uploadId) {
        this._getUpload();
      }

      if (this.tempDataUrl) {
        this.set('showLoader', false);
      }
    },

    didUpdateAttrs() {
      this._super(...arguments);

      this._getUpload();
    },

    _getUpload() {
      this.store.findRecord('upload', this.uploadId).then(upload => {
        Ember.setProperties(this, {
          upload: upload,
          showLoader: false
        });
      }).catch(error => {
        Ember.setProperties(this, {
          showLoader: false,
          showError: true
        });
      });
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/components/welcome-page", ["exports", "ember-welcome-page/components/welcome-page"], function (_exports, _welcomePage) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
;define("turquoise-web/controllers/early-entry", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Controller.extend({
    // Services:
    session: Ember.inject.service(),
    actions: {
      signIn(signInObject) {
        let {
          email,
          password,
          inviteCode
        } = Ember.getProperties(signInObject, 'email', 'password', 'inviteCode');
        this.get('session').authenticate('authenticator:oauth2', email, password).catch(this._notifyAboutAuthenticationError.bind(this));
      }

    },

    _notifyAboutAuthenticationError() {
      alert('TODO: Notify about sign in error.');
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/controllers/user", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Controller.extend({
    // Services:
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),
    actions: {
      invalidateSession() {
        this.get('session').invalidate().then(this.transitionTo('/'));
      }

    }
  });

  _exports.default = _default;
});
;define("turquoise-web/controllers/user/gigs/index", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Controller.extend({
    // Services:
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),
    queryParams: ['sort'],
    sort: 'id',
    sortField: 'id',
    sortDirection: '',
    actions: {
      onSort(field) {
        if (field === this.sortField) {
          if (this.sortDirection === '-') {
            this.set('sortDirection', '');
          } else {
            this.set('sortDirection', '-');
          }
        } else {
          this.setProperties({
            sortField: field,
            sortDirection: ''
          });
        }

        this.set('sort', "".concat(this.sortDirection).concat(this.sortField));
      },

      publishGig(gig) {
        gig.set('published', true);
        gig.save();
      },

      unpublishGig(gig) {
        gig.set('published', false);
        gig.save();
      }

    }
  });

  _exports.default = _default;
});
;define("turquoise-web/controllers/user/gigs/new", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Controller.extend({
    // Services:
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),
    step: 1,
    showStep1: Ember.computed('step', function () {
      return this.step === 1;
    }),
    showStep2: Ember.computed('step', function () {
      return this.step === 2;
    }),
    showStep3: Ember.computed('step', function () {
      return this.step === 3;
    }),
    showStep4: Ember.computed('step', function () {
      return this.step === 4;
    }),
    showStep5: Ember.computed('step', function () {
      return this.step === 5;
    }),
    showStep6: Ember.computed('step', function () {
      return this.step === 6;
    }),
    actions: {
      goToNextStep() {
        this.incrementProperty('step');
      },

      doSetStep(step) {
        this.set('step', step);
      }

    }
  });

  _exports.default = _default;
});
;define("turquoise-web/helpers/app-version", ["exports", "turquoise-web/config/environment", "ember-cli-app-version/utils/regexp"], function (_exports, _environment, _regexp) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.appVersion = appVersion;
  _exports.default = void 0;

  function appVersion(_, hash = {}) {
    const version = _environment.default.APP.version; // e.g. 1.0.0-alpha.1+4jds75hf
    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility

    let versionOnly = hash.versionOnly || hash.hideSha;
    let shaOnly = hash.shaOnly || hash.hideVersion;
    let match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      } // Fallback to just version


      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  var _default = Ember.Helper.helper(appVersion);

  _exports.default = _default;
});
;define("turquoise-web/helpers/file-queue", ["exports", "ember-file-upload/helpers/file-queue"], function (_exports, _fileQueue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _fileQueue.default;
    }
  });
});
;define("turquoise-web/helpers/local-class", ["exports", "ember-css-modules/helpers/local-class"], function (_exports, _localClass) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _localClass.default;
    }
  });
  Object.defineProperty(_exports, "localClass", {
    enumerable: true,
    get: function () {
      return _localClass.localClass;
    }
  });
});
;define("turquoise-web/helpers/pluralize", ["exports", "ember-inflector/lib/helpers/pluralize"], function (_exports, _pluralize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _pluralize.default;
  _exports.default = _default;
});
;define("turquoise-web/helpers/singularize", ["exports", "ember-inflector/lib/helpers/singularize"], function (_exports, _singularize) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _singularize.default;
  _exports.default = _default;
});
;define("turquoise-web/initializers/app-version", ["exports", "ember-cli-app-version/initializer-factory", "turquoise-web/config/environment"], function (_exports, _initializerFactory, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  let name, version;

  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  var _default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
  _exports.default = _default;
});
;define("turquoise-web/initializers/container-debug-adapter", ["exports", "ember-resolver/resolvers/classic/container-debug-adapter"], function (_exports, _containerDebugAdapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];
      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }

  };
  _exports.default = _default;
});
;define("turquoise-web/initializers/ember-data", ["exports", "ember-data/setup-container", "ember-data"], function (_exports, _setupContainer, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    ```app/services/store.js
    import DS from 'ember-data';
  
    export default DS.Store.extend({
      adapter: 'custom'
    });
    ```
  
    ```app/controllers/posts.js
    import { Controller } from '@ember/controller';
  
    export default Controller.extend({
      // ...
    });
  
    When the application is initialized, `ApplicationStore` will automatically be
    instantiated, and the instance of `PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */
  var _default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
  _exports.default = _default;
});
;define("turquoise-web/initializers/ember-simple-auth", ["exports", "turquoise-web/config/environment", "ember-simple-auth/configuration", "ember-simple-auth/initializers/setup-session", "ember-simple-auth/initializers/setup-session-service", "ember-simple-auth/initializers/setup-session-restoration"], function (_exports, _environment, _configuration, _setupSession, _setupSessionService, _setupSessionRestoration) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'ember-simple-auth',

    initialize(registry) {
      const config = _environment.default['ember-simple-auth'] || {};
      config.rootURL = _environment.default.rootURL || _environment.default.baseURL;

      _configuration.default.load(config);

      (0, _setupSession.default)(registry);
      (0, _setupSessionService.default)(registry);
      (0, _setupSessionRestoration.default)(registry);
    }

  };
  _exports.default = _default;
});
;define("turquoise-web/initializers/export-application-global", ["exports", "turquoise-web/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialize = initialize;
  _exports.default = void 0;

  function initialize() {
    var application = arguments[1] || arguments[0];

    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;

      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;
        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);

            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  var _default = {
    name: 'export-application-global',
    initialize: initialize
  };
  _exports.default = _default;
});
;define("turquoise-web/initializers/notifications", ["exports", "ember-cli-notifications/services/notification-messages-service"], function (_exports, _notificationMessagesService) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'notification-messages-service',

    initialize() {
      let application = arguments[1] || arguments[0];

      if (Ember.Service) {
        application.register('service:notification-messages', _notificationMessagesService.default);
        application.inject('component:notification-container', 'notifications', 'service:notification-messages');
        application.inject('component:notification-message', 'notifications', 'service:notification-messages');
        return;
      }

      application.register('notification-messages:service', _notificationMessagesService.default);
      ['controller', 'component', 'route', 'router', 'service'].forEach(injectionTarget => {
        application.inject(injectionTarget, 'notifications', 'notification-messages:service');
      });
    }

  };
  _exports.default = _default;
});
;define("turquoise-web/instance-initializers/ember-data", ["exports", "ember-data/initialize-store-service"], function (_exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'ember-data',
    initialize: _initializeStoreService.default
  };
  _exports.default = _default;
});
;define("turquoise-web/instance-initializers/ember-simple-auth", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  // This is only needed for backwards compatibility and will be removed in the
  // next major release of ember-simple-auth. Unfortunately, there is no way to
  // deprecate this without hooking into Ember's internals…
  var _default = {
    name: 'ember-simple-auth',

    initialize() {}

  };
  _exports.default = _default;
});
;define("turquoise-web/models/account", ["exports", "ember-data/model", "ember-data/attr", "ember-data/relationships"], function (_exports, _model, _attr, _relationships) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _model.default.extend({
    // Attributes
    accountType: (0, _attr.default)('number'),
    availableBalanceInCents: (0, _attr.default)('number'),
    avatarUrl: (0, _attr.default)('string'),
    bannedAt: (0, _attr.default)('string'),
    canAccessPayments: (0, _attr.default)('boolean'),
    city: (0, _attr.default)('string'),
    country: (0, _attr.default)('string'),
    createdAt: (0, _attr.default)('string'),
    discovery: (0, _attr.default)('boolean'),
    discoveryPaid: (0, _attr.default)('boolean'),
    earnedBalanceInCents: (0, _attr.default)('number'),
    initials: (0, _attr.default)('string'),
    inrank: (0, _attr.default)('number'),
    name: (0, _attr.default)('string'),
    phoneNumber: (0, _attr.default)('string'),
    profileUrl: (0, _attr.default)('string'),
    state: (0, _attr.default)('string'),
    selfSignup: (0, _attr.default)('boolean'),
    hideSensitiveContent: (0, _attr.default)('boolean'),
    writerSkill: (0, _attr.default)('number'),
    photographerSkill: (0, _attr.default)('number'),
    videographerSkill: (0, _attr.default)('number'),
    illustratorSkill: (0, _attr.default)('number'),
    promotionSetupComplete: (0, _attr.default)('boolean'),
    minor: (0, _attr.default)('boolean'),
    // Relationships
    gigs: (0, _relationships.hasMany)('gig'),
    // Computed properties
    isCreator: Ember.computed.equal('accountType', 0),
    isMarketer: Ember.computed.equal('accountType', 1),
    isCreatorAccount: Ember.computed('accountType', function () {
      return Ember.get(this, 'accountType') === 0;
    }),
    isMarketerAccount: Ember.computed('accountType', function () {
      return Ember.get(this, 'accountType') === 1;
    }),
    avatarUrlStyle: Ember.computed('avatarUrl', function () {
      return Ember.String.htmlSafe("background-image: url('".concat(Ember.get(this, 'avatarUrl'), "')"));
    }),
    typeOfAccount: Ember.computed('accountType', function () {
      let accountTypeMapping = {
        0: 'Creator',
        1: 'Marketer'
      };
      let accountType = Ember.get(this, 'accountType');
      return accountTypeMapping[accountType];
    })
  });

  _exports.default = _default;
});
;define("turquoise-web/models/attachment", ["exports", "ember-data"], function (_exports, _emberData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const {
    Model
  } = _emberData.default;

  var _default = Model.extend({
    uploadId: _emberData.default.attr(),
    tempDataUrl: _emberData.default.attr(),
    attachableType: _emberData.default.attr(),
    attachableId: _emberData.default.attr(),
    scopeType: _emberData.default.attr()
  });

  _exports.default = _default;
});
;define("turquoise-web/models/authenticated-user", ["exports", "ember-data/model", "ember-data/attr", "ember-data/relationships"], function (_exports, _model, _attr, _relationships) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _model.default.extend({
    // Attributes
    name: (0, _attr.default)('string'),
    email: (0, _attr.default)('string'),
    createdAt: (0, _attr.default)('string'),
    activeFeatures: (0, _attr.default)('array'),
    lastAccountUsed: (0, _attr.default)('string'),
    lastUsedAccountId: (0, _attr.default)('number'),
    // Relationships
    lastUsedAccount: (0, _relationships.belongsTo)('account', {
      inverse: null
    }),
    // Computed properties
    canAccessGigs: Ember.computed('activeFeatures.[]', function () {
      return this.get('activeFeatures').includes('gigs');
    })
  });

  _exports.default = _default;
});
;define("turquoise-web/models/extra", ["exports", "ember-data", "ember-data/relationships"], function (_exports, _emberData, _relationships) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const {
    Model
  } = _emberData.default;

  var _default = Model.extend({
    title: _emberData.default.attr(),
    description: _emberData.default.attr(),
    additionalCostInCents: _emberData.default.attr(),
    additionalDeliveryInDays: _emberData.default.attr(),
    gig: (0, _relationships.belongsTo)('gig'),
    selectableDeliveryDays: null,

    init() {
      this._super(...arguments);

      this.setProperties({
        selectableDeliveryDays: [1, 2, 3, 7, 10, 15, 30]
      });
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/models/faq", ["exports", "ember-data", "ember-data/relationships"], function (_exports, _emberData, _relationships) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const {
    Model
  } = _emberData.default;

  var _default = Model.extend({
    question: _emberData.default.attr(),
    answer: _emberData.default.attr(),
    gig: (0, _relationships.belongsTo)('gig')
  });

  _exports.default = _default;
});
;define("turquoise-web/models/gig", ["exports", "ember-data", "ember-data/relationships"], function (_exports, _emberData, _relationships) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const {
    Model
  } = _emberData.default;

  var _default = Model.extend({
    title: _emberData.default.attr(),
    description: _emberData.default.attr(),
    published: _emberData.default.attr(),
    tags: _emberData.default.attr(),
    features: _emberData.default.attr(),
    accountId: _emberData.default.attr(),
    account: (0, _relationships.belongsTo)('account'),
    extras: (0, _relationships.hasMany)('extra'),
    packages: (0, _relationships.hasMany)('package'),
    faqs: (0, _relationships.hasMany)('faq'),
    samples: (0, _relationships.hasMany)('sample'),
    requirements: (0, _relationships.hasMany)('requirement'),
    extrasCount: Ember.computed('extras.[]', function () {
      return this.extras.length;
    }),
    packagesCount: Ember.computed('packages.[]', function () {
      return this.packages.length;
    }),
    faqsCount: Ember.computed('faqs.[]', function () {
      return this.faqs.length;
    }),
    samplesCount: Ember.computed('samples.[]', function () {
      return this.samples.length;
    }),
    requirementsCount: Ember.computed('requirements.[]', function () {
      return this.requirements.length;
    }),
    coverImage: Ember.computed('samples.[]', function () {
      let primarySample = this.samples.findBy("primary", true);

      if (primarySample) {
        return primarySample;
      } else {
        return this.samples.firstObject;
      }
    }),
    hasCoverImage: Ember.computed('coverImage', function () {
      return this.coverImage ? true : false;
    }),
    publishedStyle: Ember.computed('published', function () {
      return this.published ? 'success' : 'danger';
    })
  });

  _exports.default = _default;
});
;define("turquoise-web/models/package", ["exports", "ember-data", "ember-data/relationships"], function (_exports, _emberData, _relationships) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const {
    Model
  } = _emberData.default;

  var _default = Model.extend({
    title: _emberData.default.attr(),
    description: _emberData.default.attr(),
    deliveryInDays: _emberData.default.attr(),
    features: _emberData.default.attr(),
    revisions: _emberData.default.attr(),
    costInCents: _emberData.default.attr(),
    gig: (0, _relationships.belongsTo)('gig'),
    selectableDeliveryDays: null,
    selectableRevisions: null,
    selectableLicensing: null,

    init() {
      this._super(...arguments);

      this.setProperties({
        selectableDeliveryDays: [1, 2, 3, 7, 10, 15, 30],
        selectableRevisions: [1, 2, 3, 4, 5],
        selectableLicensing: ["Commercial", "MIT", "Other"]
      });
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/models/requirement", ["exports", "ember-data", "ember-data/relationships"], function (_exports, _emberData, _relationships) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const {
    Model
  } = _emberData.default;

  var _default = Model.extend({
    description: _emberData.default.attr(),
    answerType: _emberData.default.attr(),
    options: _emberData.default.attr(),
    required: _emberData.default.attr(),
    gig: (0, _relationships.belongsTo)('gig'),
    answerTypes: null,

    init() {
      this._super(...arguments);

      this.setProperties({
        options: Ember.A(),
        answerTypes: ["freeform", "multiple", "upload"]
      });
    },

    isFreeform: Ember.computed('answerType', function () {
      return this.answerType === "freeform";
    }),
    isMultipleChoice: Ember.computed('answerType', function () {
      return this.answerType === "multiple";
    }),
    isUpload: Ember.computed('answerType', function () {
      return this.answerType === "upload";
    })
  });

  _exports.default = _default;
});
;define("turquoise-web/models/sample", ["exports", "ember-data", "ember-data/relationships"], function (_exports, _emberData, _relationships) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const {
    Model
  } = _emberData.default;

  var _default = Model.extend({
    primary: _emberData.default.attr(),
    gig: (0, _relationships.belongsTo)('gig'),
    attachments: (0, _relationships.hasMany)('attachments'),
    attachment: Ember.computed('attachments.[]', function () {
      return this.get('attachments.lastObject');
    })
  });

  _exports.default = _default;
});
;define("turquoise-web/models/upload", ["exports", "ember-data/model", "ember-data/attr"], function (_exports, _model, _attr) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _model.default.extend({
    createdAt: (0, _attr.default)('date'),
    filename: (0, _attr.default)('string'),
    finalKey: (0, _attr.default)('string'),
    mimeType: (0, _attr.default)('string'),
    tempKey: (0, _attr.default)('string'),
    type: (0, _attr.default)('string'),
    updatedAt: (0, _attr.default)('date'),
    userId: (0, _attr.default)('string'),
    // Params for making requests to storage
    getParams: (0, _attr.default)(),
    postParams: (0, _attr.default)(),
    extension: Ember.computed('filename', function () {
      return this.filename.split('.').slice(-1).pop();
    }),
    isImage: Ember.computed('extension', function () {
      return ['gif', 'jpeg', 'jpg', 'png'].includes(this.extension);
    })
  });

  _exports.default = _default;
});
;define("turquoise-web/resolver", ["exports", "ember-resolver"], function (_exports, _emberResolver) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _emberResolver.default;
  _exports.default = _default;
});
;define("turquoise-web/router", ["exports", "turquoise-web/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });
  Router.map(function () {
    this.route('early-entry', {
      path: '/'
    });
    this.route('user', function () {
      this.route('gigs', function () {
        this.route('new');
      });
    });
  });
  var _default = Router;
  _exports.default = _default;
});
;define("turquoise-web/routes/application", ["exports", "ember-simple-auth/mixins/application-route-mixin"], function (_exports, _applicationRouteMixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend(_applicationRouteMixin.default, {
    // Services:
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),
    // Ember Simple Auth Properies
    routeAfterAuthentication: 'user.gigs',

    beforeModel() {
      if (!this.get('session.data.notifications')) {
        this.set('session.data.notifications', []);
      }

      return this._loadCurrentUser();
    },

    async sessionAuthenticated() {
      let _super = this._super;
      await this._loadCurrentUser();

      _super.call(this, ...arguments);
    },

    _loadCurrentUser() {
      console.log("_loadCurrentUser is running...");
      return this.get('currentUser').load().catch(() => this.get('session').invalidate());
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/routes/early-entry", ["exports", "ember-simple-auth/mixins/unauthenticated-route-mixin"], function (_exports, _unauthenticatedRouteMixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend(_unauthenticatedRouteMixin.default, {
    // Services:
    session: Ember.inject.service(),
    // Ember Simple Auth Properies
    routeIfAlreadyAuthenticated: 'user.gigs',

    model() {
      return Ember.Object.create({
        email: 'daniel+creator_b@izea.com',
        password: 'top_secret',
        inviteCode: 'ABCD'
      });
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/routes/user", ["exports", "ember-simple-auth/mixins/authenticated-route-mixin"], function (_exports, _authenticatedRouteMixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend(_authenticatedRouteMixin.default, {
    // Services:
    session: Ember.inject.service(),
    currentUser: Ember.inject.service(),
    // Ember Simple Auth Properies
    authenticationRoute: 'early-entry',

    afterModel() {
      if (!this.get('currentUser.user.canAccessGigs')) {
        this.get('session.data.notifications').push('noGigAccess');
        this.get('session').invalidate();
      }
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/routes/user/gigs/index", ["exports", "ember-cli-pagination/remote/route-mixin"], function (_exports, _routeMixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend(_routeMixin.default, {
    // Services:
    currentUser: Ember.inject.service(),
    // Properties:
    perPage: 10,
    queryParams: {
      sort: {
        refreshModel: true
      }
    },

    model(params) {
      params.paramMapping = {
        page: "page[number]",
        perPage: "page[size]"
      };
      params.filter = {
        account_id: this.get('currentUser.account.id')
      };
      params.include = 'extras,faqs,packages,requirements,samples.attachments';
      params.sort = params.sort || 'id';
      return this.findPaged('gig', params);
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/routes/user/gigs/new", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Route.extend({
    // Services:
    currentUser: Ember.inject.service(),
    session: Ember.inject.service(),

    // model: function() {
    //   let account = this.get('currentUser.account');
    //   return this.store.createRecord('gig', {
    //     tags: [],
    //     features: [],
    //     account
    //   });
    // }
    model() {
      let account = this.get('currentUser.account');
      return Ember.RSVP.hash({
        gig: this.store.createRecord('gig', {
          title: '',
          description: '',
          tags: [],
          features: [],
          account
        }),
        sample: this.store.createRecord('sample', {
          primary: true
        }),
        package: this.store.createRecord('package')
      });
    },

    setupController(controller, model) {
      this._super(...arguments);

      Ember.set(controller, 'gig', model.gig);
      Ember.set(controller, 'sample', model.sample);
      Ember.set(controller, 'package', model.package);
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/serializers/account", ["exports", "turquoise-web/serializers/izeax-api"], function (_exports, _izeaxApi) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _izeaxApi.default.extend({
    attrs: {
      accountType: {
        key: 'type'
      }
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/serializers/application", ["exports", "ember-data/serializers/json-api"], function (_exports, _jsonApi) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _jsonApi.default.extend({// keyForAttribute(attr) {
    //   return underscore(attr);
    // },
    // keyForRelationship(rawKey) {
    //   return underscore(rawKey);
    // },
    // payloadKeyFromModelName(modelName) {
    //   return underscore(pluralize(modelName));
    // },
    // payloadTypeFromModelName(modelName) {
    //   return underscore(pluralize(modelName));
    // }
  });

  _exports.default = _default;
});
;define("turquoise-web/serializers/authenticated-user", ["exports", "turquoise-web/serializers/izeax-api"], function (_exports, _izeaxApi) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _izeaxApi.default.extend({});

  _exports.default = _default;
});
;define("turquoise-web/serializers/izeax-api", ["exports", "ember-inflector", "ember-data/serializers/json-api"], function (_exports, _emberInflector, _jsonApi) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _jsonApi.default.extend({
    keyForAttribute(attr) {
      return Ember.String.underscore(attr);
    },

    keyForRelationship(rawKey) {
      return Ember.String.underscore(rawKey);
    },

    payloadKeyFromModelName(modelName) {
      return Ember.String.underscore((0, _emberInflector.pluralize)(modelName));
    },

    payloadTypeFromModelName(modelName) {
      return Ember.String.underscore((0, _emberInflector.pluralize)(modelName));
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/serializers/upload", ["exports", "turquoise-web/serializers/application"], function (_exports, _application) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _application.default.extend({
    attrs: {
      getParams: {
        key: 'get'
      },
      postParams: {
        key: 'post'
      }
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/services/ajax", ["exports", "ember-ajax/services/ajax"], function (_exports, _ajax) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
;define("turquoise-web/services/cookies", ["exports", "ember-cookies/services/cookies"], function (_exports, _cookies) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _cookies.default;
  _exports.default = _default;
});
;define("turquoise-web/services/current-user", ["exports", "ember-jwt-decode"], function (_exports, _emberJwtDecode) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.Service.extend({
    session: Ember.inject.service(),
    store: Ember.inject.service(),
    user: null,
    account: null,

    load() {
      if (!this.get('session.isAuthenticated')) {
        return Ember.RSVP.resolve();
      }

      let userId = this._getUserId();

      if (userId) {
        return this.get('store').findRecord('authenticated-user', userId, {
          include: 'last_used_account'
        }).then(user => {
          this.set('user', user);
          this.get('store').findRecord('account', this.user.lastUsedAccountId).then(account => {
            this.set('account', account);
          });
        });
      } else {
        return Ember.RSVP.resolve();
      }
    },

    // Private methods
    _getUserId() {
      let token = this.get('session.data.authenticated.access_token');
      let tokenData = (0, _emberJwtDecode.default)(token);
      return tokenData.userId;
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/services/file-queue", ["exports", "ember-file-upload/services/file-queue"], function (_exports, _fileQueue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _fileQueue.default;
    }
  });
});
;define("turquoise-web/services/notification-messages-service", ["exports", "ember-cli-notifications/services/notification-messages-service"], function (_exports, _notificationMessagesService) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _notificationMessagesService.default;
    }
  });
});
;define("turquoise-web/services/session", ["exports", "ember-simple-auth/services/session"], function (_exports, _session) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = _session.default;
  _exports.default = _default;
});
;define("turquoise-web/session-stores/application", ["exports", "ember-simple-auth/session-stores/adaptive"], function (_exports, _adaptive) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _adaptive.default.extend();

  _exports.default = _default;
});
;define("turquoise-web/templates/application", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "IKdpQZif",
    "block": "{\"symbols\":[],\"statements\":[[5,\"session-notifications\",[],[[],[]]],[0,\"\\n\\n\"],[0,\"\\n\"],[1,[22,\"outlet\"],false]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/application.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/components/async-image", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "N5sPF9Ij",
    "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[24,[\"isLoaded\"]]],null,{\"statements\":[[0,\"  \"],[7,\"a\",true],[10,\"class\",\"avatar avatar-lg\"],[8],[0,\"\\n    \"],[7,\"img\",true],[10,\"class\",\"avatar-img rounded\"],[11,\"src\",[22,\"src\"]],[11,\"alt\",[22,\"alt\"]],[11,\"title\",[22,\"title\"]],[10,\"data-test-async-img\",\"\"],[8],[9],[0,\"\\n  \"],[9],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/components/async-image.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/components/create-attachment", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "VLMZ3k+J",
    "block": "{\"symbols\":[\"queue\"],\"statements\":[[5,\"file-upload\",[],[[\"@name\",\"@accept\",\"@onfileadd\"],[\"photos\",\"image/*\",[28,\"action\",[[23,0,[]],\"uploadFile\"],null]]],{\"statements\":[[0,\"\\n  \"],[7,\"a\",true],[10,\"class\",\"button\"],[8],[0,\"\\n\"],[4,\"if\",[[23,1,[\"files\",\"length\"]]],null,{\"statements\":[[0,\"      Uploading...\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"      Upload file\\n\"]],\"parameters\":[]}],[0,\"  \"],[9],[0,\"\\n\"]],\"parameters\":[1]}]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/components/create-attachment.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/components/default-cover-image", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "oVbw9+Ea",
    "block": "{\"symbols\":[],\"statements\":[[7,\"a\",true],[11,\"class\",[29,[\"avatar avatar-\",[22,\"size\"]]]],[8],[0,\"\\n  \"],[7,\"img\",true],[10,\"class\",\"avatar-img rounded\"],[10,\"src\",\"/images/default-cover-image.png\"],[8],[9],[0,\"\\n\"],[9]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/components/default-cover-image.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/components/gig-creation-step1", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "b8p/37aV",
    "block": "{\"symbols\":[\"primaryAction\",\"subCategory\",\"listingCategory\"],\"statements\":[[5,\"section-header\",[],[[],[]],{\"statements\":[[0,\"\\n  \"],[7,\"h6\",true],[10,\"class\",\"header-pretitle\"],[8],[0,\"\\n    Provide the basic information for your Gig.\\n  \"],[9],[0,\"\\n  \"],[7,\"h1\",true],[10,\"class\",\"header-title\"],[8],[0,\"\\n    Step 1: Listing Card\\n  \"],[9],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n\\n\"],[7,\"div\",true],[10,\"class\",\"container-fluid\"],[8],[0,\"\\n  \"],[7,\"div\",true],[10,\"class\",\"row\"],[8],[0,\"\\n    \"],[7,\"div\",true],[10,\"class\",\"col\"],[8],[0,\"\\n      \"],[7,\"form\",false],[3,\"action\",[[23,0,[]],\"save\"],[[\"on\"],[\"submit\"]]],[8],[0,\"\\n\\n        \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n          \"],[7,\"label\",true],[8],[0,\"Listing Category\"],[9],[0,\"\\n          \"],[7,\"select\",true],[10,\"class\",\"form-control\"],[10,\"data-toggle\",\"select\"],[11,\"onchange\",[28,\"action\",[[23,0,[]],\"onSelectListingCategory\"],[[\"value\"],[\"target.value\"]]]],[8],[0,\"\\n            \"],[7,\"option\",true],[8],[0,\"-\"],[9],[0,\"\\n\"],[4,\"each\",[[24,[\"listingCategories\"]]],null,{\"statements\":[[0,\"              \"],[7,\"option\",true],[8],[1,[23,3,[]],false],[9],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"          \"],[9],[0,\"\\n        \"],[9],[0,\"\\n\\n        \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n          \"],[7,\"label\",true],[8],[0,\"Sub Category\"],[9],[0,\"\\n          \"],[7,\"select\",true],[10,\"class\",\"form-control\"],[10,\"data-toggle\",\"select\"],[11,\"onchange\",[28,\"action\",[[23,0,[]],\"onSelectSubCategory\"],[[\"value\"],[\"target.value\"]]]],[8],[0,\"\\n            \"],[7,\"option\",true],[8],[0,\"-\"],[9],[0,\"\\n\"],[4,\"each\",[[24,[\"subCategories\"]]],null,{\"statements\":[[0,\"              \"],[7,\"option\",true],[8],[1,[23,2,[]],false],[9],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"          \"],[9],[0,\"\\n        \"],[9],[0,\"\\n\\n        \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n          \"],[7,\"label\",true],[8],[0,\"Primary Action\"],[9],[0,\"\\n          \"],[7,\"select\",true],[10,\"class\",\"form-control\"],[10,\"data-toggle\",\"select\"],[11,\"onchange\",[28,\"action\",[[23,0,[]],\"onSelectPrimaryAction\"],[[\"value\"],[\"target.value\"]]]],[8],[0,\"\\n            \"],[7,\"option\",true],[8],[0,\"-\"],[9],[0,\"\\n\"],[4,\"each\",[[24,[\"primaryActions\"]]],null,{\"statements\":[[0,\"              \"],[7,\"option\",true],[8],[1,[23,1,[]],false],[9],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"          \"],[9],[0,\"\\n        \"],[9],[0,\"\\n\\n        \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n          \"],[7,\"label\",true],[8],[0,\"Title\"],[9],[0,\"\\n          \"],[1,[28,\"input\",null,[[\"value\",\"class\"],[[24,[\"gig\",\"title\"]],\"form-control\"]]],false],[0,\"\\n          \"],[1,[28,\"char-count\",null,[[\"string\",\"maxlength\"],[[24,[\"gig\",\"title\"]],\"200\"]]],false],[0,\"\\n        \"],[9],[0,\"\\n\\n        \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n          \"],[7,\"label\",true],[8],[0,\"Starting Price\"],[9],[0,\"\\n          \"],[1,[28,\"input\",null,[[\"value\",\"class\"],[[24,[\"package\",\"costInCents\"]],\"form-control\"]]],false],[0,\"\\n        \"],[9],[0,\"\\n\\n        \"],[7,\"p\",true],[8],[0,\"\\n          \"],[7,\"button\",true],[10,\"class\",\"btn btn-primary\"],[10,\"type\",\"submit\"],[8],[0,\"Save & Next\"],[9],[0,\"\\n        \"],[9],[0,\"\\n\\n      \"],[9],[0,\"\\n\\n    \"],[9],[0,\"\\n\\n    \"],[7,\"div\",true],[10,\"class\",\"col\"],[8],[0,\"\\n      \"],[7,\"p\",true],[8],[0,\"\\n        Marketplace Preview:\\n      \"],[9],[0,\"\\n\\n      \"],[7,\"p\",true],[8],[0,\"\\n        \"],[7,\"div\",true],[10,\"class\",\"avatar avatar-sm\"],[8],[0,\"\\n          \"],[7,\"img\",true],[11,\"src\",[29,[[24,[\"currentUser\",\"account\",\"avatarUrl\"]]]]],[10,\"alt\",\"...\"],[10,\"class\",\"avatar-img rounded-circle\"],[8],[9],[0,\"\\n        \"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[7,\"p\",true],[8],[0,\"\\n        \"],[1,[24,[\"currentUser\",\"account\",\"name\"]],false],[0,\"\\n      \"],[9],[0,\"\\n      \"],[7,\"p\",true],[8],[0,\"\\n        Starting at: $\"],[1,[24,[\"package\",\"costInCents\"]],false],[0,\"\\n      \"],[9],[0,\"\\n      \"],[7,\"p\",true],[8],[0,\"\\n\"],[4,\"if\",[[24,[\"sample\",\"attachments\"]]],null,{\"statements\":[[0,\"          \"],[5,\"uploaded-file\",[],[[\"@tempDataUrl\"],[[24,[\"sample\",\"attachments\",\"firstObject\",\"tempDataUrl\"]]]]],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          Upload Sample Here\"],[7,\"br\",true],[8],[9],[0,\"\\n          \"],[5,\"create-attachment\",[],[[\"@scopeType\",\"@attachable\"],[\"sample\",[22,\"sample\"]]]],[0,\"\\n\"]],\"parameters\":[]}],[0,\"      \"],[9],[0,\"\\n\\n\"],[4,\"if\",[[24,[\"selectedPrimaryAction\"]]],null,{\"statements\":[[0,\"        \"],[7,\"p\",true],[8],[0,\"\\n          \"],[7,\"strong\",true],[8],[0,\"I'll \"],[1,[22,\"selectedPrimaryAction\"],false],[9],[0,\" \"],[1,[24,[\"gig\",\"title\"]],false],[0,\"\\n        \"],[9],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n    \"],[9],[0,\"\\n\\n  \"],[9],[0,\"\\n\"],[9],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/components/gig-creation-step1.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/components/gig-creation-step2", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "xjNvKB9T",
    "block": "{\"symbols\":[\"extra\",\"item\",\"package\",\"item\",\"item\",\"item\"],\"statements\":[[5,\"section-header\",[],[[],[]],{\"statements\":[[0,\"\\n  \"],[7,\"h6\",true],[10,\"class\",\"header-pretitle\"],[8],[0,\"\\n    Provide an overview of what services you intend to provide your customers.\\n  \"],[9],[0,\"\\n  \"],[7,\"h1\",true],[10,\"class\",\"header-title\"],[8],[0,\"\\n    Step 2a: Gig Description\\n  \"],[9],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n\\n\"],[7,\"div\",true],[10,\"class\",\"container-fluid\"],[8],[0,\"\\n  \"],[7,\"div\",true],[10,\"class\",\"row\"],[8],[0,\"\\n    \"],[7,\"div\",true],[10,\"class\",\"col card\"],[8],[0,\"\\n      \"],[7,\"div\",true],[10,\"class\",\"form-group card-body\"],[8],[0,\"\\n        \"],[7,\"label\",true],[8],[0,\"Description\"],[9],[0,\"\\n        \"],[1,[28,\"input\",null,[[\"value\",\"class\"],[[24,[\"gig\",\"description\"]],\"form-control\"]]],false],[0,\"\\n        \"],[1,[28,\"char-count\",null,[[\"string\",\"maxlength\"],[[24,[\"gig\",\"description\"]],\"1000\"]]],false],[0,\"\\n      \"],[9],[0,\"\\n    \"],[9],[0,\"\\n  \"],[9],[0,\"\\n\"],[9],[0,\"\\n\\n\"],[5,\"section-header\",[],[[],[]],{\"statements\":[[0,\"\\n  \"],[7,\"h6\",true],[10,\"class\",\"header-pretitle\"],[8],[0,\"\\n    You can add up to four unique packages, each with different prices and specifications.\\n  \"],[9],[0,\"\\n  \"],[7,\"h1\",true],[10,\"class\",\"header-title\"],[8],[0,\"\\n    Step 2b: Gig Packages\\n  \"],[9],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n\\n\"],[7,\"div\",true],[10,\"class\",\"container-fluid\"],[8],[0,\"\\n  \"],[7,\"div\",true],[10,\"class\",\"row\"],[8],[0,\"\\n    \"],[7,\"div\",true],[10,\"class\",\"col\"],[8],[0,\"\\n\"],[4,\"each\",[[24,[\"packages\"]]],null,{\"statements\":[[0,\"        \"],[7,\"div\",true],[10,\"class\",\"card\"],[8],[0,\"\\n          \"],[7,\"div\",true],[10,\"class\",\"card-body\"],[8],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n              \"],[7,\"label\",true],[8],[0,\"Package Name\"],[9],[0,\"\\n              \"],[1,[28,\"input\",null,[[\"value\",\"class\"],[[23,3,[\"title\"]],\"form-control\"]]],false],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n              \"],[7,\"label\",true],[8],[0,\"Package Description\"],[9],[0,\"\\n              \"],[1,[28,\"input\",null,[[\"value\",\"class\"],[[23,3,[\"description\"]],\"form-control\"]]],false],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n              \"],[7,\"label\",true],[8],[0,\"Pricing\"],[9],[0,\"\\n              \"],[1,[28,\"input\",null,[[\"value\",\"class\"],[[23,3,[\"costInCents\"]],\"form-control\"]]],false],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n              \"],[7,\"label\",true],[8],[0,\"Delivery Time\"],[9],[0,\"\\n              \"],[7,\"select\",true],[10,\"class\",\"form-control\"],[10,\"data-toggle\",\"select\"],[11,\"onchange\",[28,\"action\",[[23,0,[]],\"doUpdatePackageDelivery\",[23,3,[]]],null]],[8],[0,\"\\n                \"],[7,\"option\",true],[8],[0,\"-\"],[9],[0,\"\\n\"],[4,\"each\",[[23,3,[\"selectableDeliveryDays\"]]],null,{\"statements\":[[0,\"                  \"],[7,\"option\",true],[11,\"value\",[23,6,[]]],[8],[1,[23,6,[]],false],[0,\" Day\"],[9],[0,\"\\n\"]],\"parameters\":[6]},null],[0,\"              \"],[9],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n              \"],[7,\"label\",true],[8],[0,\"Revisions\"],[9],[0,\"\\n              \"],[7,\"select\",true],[10,\"class\",\"form-control\"],[10,\"data-toggle\",\"select\"],[11,\"onchange\",[28,\"action\",[[23,0,[]],\"doUpdatePackageRevision\",[23,3,[]]],null]],[8],[0,\"\\n                \"],[7,\"option\",true],[8],[0,\"-\"],[9],[0,\"\\n\"],[4,\"each\",[[23,3,[\"selectableRevisions\"]]],null,{\"statements\":[[0,\"                  \"],[7,\"option\",true],[11,\"value\",[23,5,[]]],[8],[1,[23,5,[]],false],[0,\" Revision\"],[9],[0,\"\\n\"]],\"parameters\":[5]},null],[0,\"              \"],[9],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n              \"],[7,\"label\",true],[8],[0,\"Licensing\"],[9],[0,\"\\n              \"],[7,\"select\",true],[10,\"class\",\"form-control\"],[10,\"data-toggle\",\"select\"],[11,\"onchange\",[28,\"action\",[[23,0,[]],\"doUpdatePackageLicense\",[23,3,[]]],null]],[8],[0,\"\\n                \"],[7,\"option\",true],[8],[0,\"-\"],[9],[0,\"\\n\"],[4,\"each\",[[23,3,[\"selectableLicensing\"]]],null,{\"statements\":[[0,\"                  \"],[7,\"option\",true],[8],[1,[23,4,[]],false],[9],[0,\"\\n\"]],\"parameters\":[4]},null],[0,\"              \"],[9],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n              \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doDeletePackage\",[23,3,[]]]],[8],[0,\"Delete Package\"],[9],[0,\"\\n            \"],[9],[0,\"\\n          \"],[9],[0,\"\\n        \"],[9],[0,\"\\n\"]],\"parameters\":[3]},null],[0,\"    \"],[9],[0,\"\\n  \"],[9],[0,\"\\n\"],[9],[0,\"\\n\\n\"],[4,\"if\",[[24,[\"canAddPackage\"]]],null,{\"statements\":[[0,\"  \"],[7,\"p\",true],[8],[0,\"\\n    \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doAddPackage\"]],[8],[0,\"Add Package\"],[9],[0,\"\\n  \"],[9],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\\n\"],[5,\"section-header\",[],[[],[]],{\"statements\":[[0,\"\\n  \"],[7,\"h6\",true],[10,\"class\",\"header-pretitle\"],[8],[0,\"\\n    If you have optional services that can be added to this Gig list them here\\n  \"],[9],[0,\"\\n  \"],[7,\"h1\",true],[10,\"class\",\"header-title\"],[8],[0,\"\\n    Step 2c: Gig Extras\\n  \"],[9],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n\\n\"],[7,\"div\",true],[10,\"class\",\"container-fluid\"],[8],[0,\"\\n  \"],[7,\"div\",true],[10,\"class\",\"row\"],[8],[0,\"\\n    \"],[7,\"div\",true],[10,\"class\",\"col\"],[8],[0,\"\\n\"],[4,\"each\",[[24,[\"extras\"]]],null,{\"statements\":[[0,\"        \"],[7,\"div\",true],[10,\"class\",\"card\"],[8],[0,\"\\n          \"],[7,\"div\",true],[10,\"class\",\"card-body\"],[8],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n              \"],[7,\"label\",true],[8],[0,\"Extra Name\"],[9],[0,\"\\n              \"],[1,[28,\"input\",null,[[\"value\",\"class\"],[[23,1,[\"title\"]],\"form-control\"]]],false],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n              \"],[7,\"label\",true],[8],[0,\"Extra Description\"],[9],[0,\"\\n              \"],[1,[28,\"input\",null,[[\"value\",\"class\"],[[23,1,[\"description\"]],\"form-control\"]]],false],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n              \"],[7,\"label\",true],[8],[0,\"Additional Cost\"],[9],[0,\"\\n              \"],[1,[28,\"input\",null,[[\"value\",\"class\"],[[23,1,[\"additionalCostInCents\"]],\"form-control\"]]],false],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n              \"],[7,\"label\",true],[8],[0,\"Additional Delivery Time\"],[9],[0,\"\\n              \"],[7,\"select\",true],[10,\"class\",\"form-control\"],[10,\"data-toggle\",\"select\"],[11,\"onchange\",[28,\"action\",[[23,0,[]],\"doUpdateExtraDelivery\",[23,1,[]]],null]],[8],[0,\"\\n                \"],[7,\"option\",true],[8],[0,\"-\"],[9],[0,\"\\n\"],[4,\"each\",[[23,1,[\"selectableDeliveryDays\"]]],null,{\"statements\":[[0,\"                  \"],[7,\"option\",true],[11,\"value\",[23,2,[]]],[8],[0,\"+\"],[1,[23,2,[]],false],[0,\" Days\"],[9],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"              \"],[9],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n              \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doDeleteExtra\",[23,1,[]]]],[8],[0,\"Delete Extra\"],[9],[0,\"\\n            \"],[9],[0,\"\\n          \"],[9],[0,\"\\n        \"],[9],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"    \"],[9],[0,\"\\n  \"],[9],[0,\"\\n\"],[9],[0,\"\\n\\n\"],[7,\"p\",true],[8],[0,\"\\n  \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doAddExtra\"]],[8],[0,\"Add Extra\"],[9],[0,\"\\n\"],[9],[0,\"\\n\\n\\n\\n\"],[7,\"p\",true],[8],[0,\"\\n  \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doSave\"]],[8],[0,\"Save & Continue\"],[9],[0,\"\\n\"],[9]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/components/gig-creation-step2.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/components/gig-creation-step3", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "ko/yhMs8",
    "block": "{\"symbols\":[\"sample\"],\"statements\":[[5,\"section-header\",[],[[],[]],{\"statements\":[[0,\"\\n  \"],[7,\"h6\",true],[10,\"class\",\"header-pretitle\"],[8],[0,\"\\n    Provide representative examples of the end work product you intend to produce for your customers.\\n  \"],[9],[0,\"\\n  \"],[7,\"h1\",true],[10,\"class\",\"header-title\"],[8],[0,\"\\n    Step 3 : Your Gig Samples\\n  \"],[9],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n\\n\"],[7,\"div\",true],[10,\"class\",\"container-fluid\"],[8],[0,\"\\n  \"],[7,\"div\",true],[10,\"class\",\"row\"],[8],[0,\"\\n    \"],[7,\"div\",true],[10,\"class\",\"col\"],[8],[0,\"\\n\\n      \"],[7,\"p\",true],[8],[0,\"\\n        Upload Sample Here\"],[7,\"br\",true],[8],[9],[0,\"\\n        \"],[5,\"create-attachment\",[],[[\"@scopeType\",\"@attachable\",\"@callback\"],[\"sample\",[22,\"newSample\"],[28,\"action\",[[23,0,[]],\"doAttachmentCreated\"],null]]]],[0,\"\\n      \"],[9],[0,\"\\n\\n      \"],[7,\"p\",true],[8],[0,\"\\n        \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doSave\"]],[8],[0,\"Save & Continue\"],[9],[0,\"\\n      \"],[9],[0,\"\\n\\n    \"],[9],[0,\"\\n\\n    \"],[7,\"div\",true],[10,\"class\",\"col\"],[8],[0,\"\\n      \"],[7,\"p\",true],[8],[0,\"\\n        Media attached to this Gig:\\n      \"],[9],[0,\"\\n\\n\"],[4,\"each\",[[24,[\"gig\",\"samples\"]]],null,{\"statements\":[[4,\"if\",[[23,1,[\"attachment\"]]],null,{\"statements\":[[0,\"          \"],[7,\"p\",true],[8],[0,\"\\n\"],[4,\"if\",[[23,1,[\"attachment\",\"isNew\"]]],null,{\"statements\":[[0,\"              \"],[5,\"uploaded-file\",[],[[\"@tempDataUrl\"],[[23,1,[\"attachments\",\"firstObject\",\"tempDataUrl\"]]]]],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"              \"],[5,\"uploaded-file\",[],[[\"@uploadId\"],[[23,1,[\"attachment\",\"uploadId\"]]]]],[0,\"\\n\"]],\"parameters\":[]}],[4,\"if\",[[23,1,[\"primary\"]]],null,{\"statements\":[[0,\"              \"],[7,\"strong\",true],[8],[0,\"Featured\"],[9],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"          \"],[9],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[1]},null],[0,\"\\n    \"],[9],[0,\"\\n\\n  \"],[9],[0,\"\\n\"],[9],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/components/gig-creation-step3.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/components/gig-creation-step4", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "840ICx9E",
    "block": "{\"symbols\":[\"requirement\",\"item\",\"index\",\"item\"],\"statements\":[[5,\"section-header\",[],[[],[]],{\"statements\":[[0,\"\\n  \"],[7,\"h6\",true],[10,\"class\",\"header-pretitle\"],[8],[0,\"\\n    What information do you need from your customers in order to get started?\\n  \"],[9],[0,\"\\n  \"],[7,\"h1\",true],[10,\"class\",\"header-title\"],[8],[0,\"\\n    Step 4: Gig Requirements\\n  \"],[9],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n\\n\"],[4,\"each\",[[24,[\"requirements\"]]],null,{\"statements\":[[0,\"  \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n    \"],[7,\"label\",true],[8],[0,\"Requirement Description\"],[9],[0,\"\\n    \"],[1,[28,\"input\",null,[[\"value\",\"class\"],[[23,1,[\"description\"]],\"form-control\"]]],false],[0,\"\\n  \"],[9],[0,\"\\n  \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n    \"],[7,\"label\",true],[8],[0,\"Answer Type\"],[9],[0,\"\\n    \"],[7,\"select\",true],[10,\"class\",\"form-control\"],[10,\"data-toggle\",\"select\"],[11,\"onchange\",[28,\"action\",[[23,0,[]],\"doUpdateAnswerType\",[23,1,[]]],null]],[8],[0,\"\\n      \"],[7,\"option\",true],[8],[0,\"-\"],[9],[0,\"\\n\"],[4,\"each\",[[23,1,[\"answerTypes\"]]],null,{\"statements\":[[0,\"        \"],[7,\"option\",true],[11,\"value\",[23,4,[]]],[8],[1,[23,4,[]],false],[9],[0,\"\\n\"]],\"parameters\":[4]},null],[0,\"    \"],[9],[0,\"\\n  \"],[9],[0,\"\\n  \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n    \"],[7,\"label\",true],[8],[0,\"Required\"],[9],[0,\"\\n    \"],[5,\"input\",[],[[\"@type\",\"@checked\"],[\"checkbox\",[23,1,[\"required\"]]]]],[0,\"\\n  \"],[9],[0,\"\\n\\n\"],[4,\"if\",[[23,1,[\"isMultipleChoice\"]]],null,{\"statements\":[[4,\"each\",[[23,1,[\"options\"]]],null,{\"statements\":[[0,\"      \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n        \"],[1,[23,3,[]],false],[7,\"br\",true],[8],[9],[0,\"\\n        \"],[1,[28,\"input\",null,[[\"value\",\"class\",\"input\"],[[23,2,[]],\"form-control\",[28,\"action\",[[23,0,[]],\"doSetOption\",[23,1,[]],[23,3,[]]],null]]]],false],[7,\"br\",true],[8],[9],[0,\"\\n        \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doDeleteOption\",[23,1,[]],[23,3,[]]]],[8],[0,\"X\"],[9],[0,\"\\n      \"],[9],[0,\"\\n\"]],\"parameters\":[2,3]},null],[0,\"    \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doAddOption\",[23,1,[]]]],[8],[0,\"Add Option\"],[9],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n  \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n    \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doDeleteRequirement\",[23,1,[]]]],[8],[0,\"Delete Requirement\"],[9],[0,\"\\n  \"],[9],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\n\"],[7,\"p\",true],[8],[0,\"\\n  \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doAddRequirement\"]],[8],[0,\"Add Requirement\"],[9],[0,\"\\n\"],[9],[0,\"\\n\\n\\n\"],[7,\"p\",true],[8],[0,\"\\n  \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doSave\"]],[8],[0,\"Save & Continue\"],[9],[0,\"\\n\"],[9]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/components/gig-creation-step4.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/components/gig-creation-step5", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "FRPHidhI",
    "block": "{\"symbols\":[\"faq\"],\"statements\":[[5,\"section-header\",[],[[],[]],{\"statements\":[[0,\"\\n  \"],[7,\"h6\",true],[10,\"class\",\"header-pretitle\"],[8],[0,\"\\n    What information do you need from your customers in order to get started?\\n  \"],[9],[0,\"\\n  \"],[7,\"h1\",true],[10,\"class\",\"header-title\"],[8],[0,\"\\n    Step 5: Gig FAQ\\n  \"],[9],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n\\n\"],[4,\"each\",[[24,[\"faqs\"]]],null,{\"statements\":[[0,\"  \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n    \"],[7,\"label\",true],[8],[0,\"Question\"],[9],[0,\"\\n    \"],[1,[28,\"input\",null,[[\"value\",\"class\"],[[23,1,[\"question\"]],\"form-control\"]]],false],[0,\"\\n  \"],[9],[0,\"\\n  \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n    \"],[7,\"label\",true],[8],[0,\"Answer\"],[9],[0,\"\\n    \"],[1,[28,\"input\",null,[[\"value\",\"class\"],[[23,1,[\"answer\"]],\"form-control\"]]],false],[0,\"\\n  \"],[9],[0,\"\\n\\n  \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n    \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doDeleteFaq\",[23,1,[]]]],[8],[0,\"Delete FAQ\"],[9],[0,\"\\n  \"],[9],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\n\"],[7,\"p\",true],[8],[0,\"\\n  \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doAddFaq\"]],[8],[0,\"Add Faq\"],[9],[0,\"\\n\"],[9],[0,\"\\n\\n\\n\"],[7,\"p\",true],[8],[0,\"\\n  \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doSave\"]],[8],[0,\"Save & Continue\"],[9],[0,\"\\n\"],[9]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/components/gig-creation-step5.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/components/gig-creation-step6", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "wgyZOnTz",
    "block": "{\"symbols\":[],\"statements\":[[5,\"section-header\",[],[[],[]],{\"statements\":[[0,\"\\n  \"],[7,\"h6\",true],[10,\"class\",\"header-pretitle\"],[8],[0,\"\\n    Review your listing and add meta data to help customers find you.\\n  \"],[9],[0,\"\\n  \"],[7,\"h1\",true],[10,\"class\",\"header-title\"],[8],[0,\"\\n    Step 6 : Launch!\\n  \"],[9],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n\\n\"],[7,\"p\",true],[8],[0,\"\\n  TODO\\n\"],[9],[0,\"\\n\\n\"],[7,\"p\",true],[8],[0,\"\\n  \"],[7,\"button\",false],[12,\"class\",\"btn btn-primary\"],[3,\"action\",[[23,0,[]],\"doSubmitForReview\"]],[8],[0,\"Submit for Review\"],[9],[0,\"\\n\"],[9]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/components/gig-creation-step6.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/components/number-or-dash", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "/WgR+L38",
    "block": "{\"symbols\":[],\"statements\":[[1,[22,\"numberOrDash\"],false]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/components/number-or-dash.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/components/page-numbers", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "ssyzIqwp",
    "block": "{\"symbols\":[\"item\"],\"statements\":[[7,\"div\",true],[10,\"class\",\"pagination-centered\"],[8],[0,\"\\n  \"],[7,\"ul\",true],[10,\"class\",\"pagination\"],[8],[0,\"\\n\"],[4,\"if\",[[24,[\"canStepBackward\"]]],null,{\"statements\":[[0,\"      \"],[7,\"li\",true],[10,\"class\",\"arrow prev enabled-arrow page-item\"],[8],[0,\"\\n        \"],[7,\"a\",false],[12,\"href\",\"#\"],[12,\"class\",\"page-link\"],[3,\"action\",[[23,0,[]],\"incrementPage\",-1]],[8],[0,\"«\"],[9],[0,\"\\n      \"],[9],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"      \"],[7,\"li\",true],[10,\"class\",\"arrow prev disabled page-item\"],[8],[0,\"\\n        \"],[7,\"a\",false],[12,\"href\",\"#\"],[12,\"class\",\"page-link\"],[3,\"action\",[[23,0,[]],\"incrementPage\",-1]],[8],[0,\"«\"],[9],[0,\"\\n      \"],[9],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n\"],[4,\"each\",[[24,[\"pageItems\"]]],null,{\"statements\":[[4,\"if\",[[23,1,[\"dots\"]]],null,{\"statements\":[[0,\"        \"],[7,\"li\",true],[10,\"class\",\"dots disabled page-item\"],[8],[0,\"\\n          \"],[7,\"span\",true],[8],[0,\"...\"],[9],[0,\"\\n        \"],[9],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[23,1,[\"current\"]]],null,{\"statements\":[[0,\"        \"],[7,\"li\",true],[10,\"class\",\"active page-number page-item\"],[8],[0,\"\\n          \"],[7,\"a\",true],[10,\"class\",\"page-link\"],[8],[1,[23,1,[\"page\"]],false],[9],[0,\"\\n        \"],[9],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"        \"],[7,\"li\",true],[10,\"class\",\"page-number page-item\"],[8],[0,\"\\n          \"],[7,\"a\",false],[12,\"href\",\"#\"],[12,\"class\",\"page-link\"],[3,\"action\",[[23,0,[]],\"pageClicked\",[23,1,[\"page\"]]]],[8],[1,[23,1,[\"page\"]],false],[9],[0,\"\\n        \"],[9],[0,\"\\n\"]],\"parameters\":[]}]],\"parameters\":[1]},null],[0,\"\\n\"],[4,\"if\",[[24,[\"canStepForward\"]]],null,{\"statements\":[[0,\"      \"],[7,\"li\",true],[10,\"class\",\"arrow next enabled-arrow page-item\"],[8],[0,\"\\n        \"],[7,\"a\",false],[12,\"href\",\"#\"],[12,\"class\",\"page-link\"],[3,\"action\",[[23,0,[]],\"incrementPage\",1]],[8],[0,\"»\"],[9],[0,\"\\n      \"],[9],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"      \"],[7,\"li\",true],[10,\"class\",\"arrow next disabled page-item\"],[8],[0,\"\\n        \"],[7,\"a\",false],[12,\"href\",\"#\"],[12,\"class\",\"page-link\"],[3,\"action\",[[23,0,[]],\"incrementPage\",1]],[8],[0,\"»\"],[9],[0,\"\\n      \"],[9],[0,\"\\n\"]],\"parameters\":[]}],[0,\"  \"],[9],[0,\"\\n\"],[9],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/components/page-numbers.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/components/section-header", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "ODVPWgFU",
    "block": "{\"symbols\":[\"&default\"],\"statements\":[[7,\"div\",true],[10,\"class\",\"header m-0\"],[8],[0,\"\\n  \"],[7,\"div\",true],[10,\"class\",\"header-body pt-0\"],[8],[0,\"\\n    \"],[7,\"div\",true],[10,\"class\",\"row align-items-center\"],[8],[0,\"\\n      \"],[7,\"div\",true],[10,\"class\",\"col\"],[8],[0,\"\\n\\n        \"],[14,1],[0,\"\\n\\n      \"],[9],[0,\"\\n    \"],[9],[0,\"\\n\\n  \"],[9],[0,\"\\n\"],[9]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/components/section-header.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/components/session-notifications", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "9u2VoOzu",
    "block": "{\"symbols\":[],\"statements\":[[1,[28,\"notification-container\",null,[[\"position\",\"zindex\"],[\"top\",\"99999\"]]],false]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/components/session-notifications.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/components/uploaded-file", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "m1MxRPIW",
    "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[24,[\"upload\"]]],null,{\"statements\":[[0,\"  \"],[5,\"async-image\",[],[[\"@src\",\"@alt\"],[[24,[\"upload\",\"getParams\",\"url\"]],[24,[\"upload\",\"id\"]]]]],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[24,[\"tempDataUrl\"]]],null,{\"statements\":[[0,\"  \"],[5,\"async-image\",[],[[\"@src\"],[[22,\"tempDataUrl\"]]]],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[24,[\"showError\"]]],null,{\"statements\":[[0,\"  \"],[5,\"default-cover-image\",[],[[\"@size\"],[\"lg\"]]],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[24,[\"showLoader\"]]],null,{\"statements\":[[0,\"  \"],[7,\"div\",true],[10,\"class\",\"spinner-border text-success\"],[10,\"role\",\"status\"],[8],[0,\"\\n    \"],[7,\"span\",true],[10,\"class\",\"sr-only\"],[8],[0,\"Loading...\"],[9],[0,\"\\n  \"],[9],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/components/uploaded-file.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/early-entry", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "o5gkTqyk",
    "block": "{\"symbols\":[],\"statements\":[[7,\"div\",true],[10,\"class\",\"container-fluid\"],[8],[0,\"\\n  \"],[7,\"div\",true],[10,\"class\",\"row align-items-center justify-content-center\"],[8],[0,\"\\n    \"],[7,\"div\",true],[10,\"class\",\"col-12 col-md-5 col-lg-6 col-xl-4 px-lg-6 my-5\"],[8],[0,\"\\n\\n      \"],[2,\" Heading \"],[0,\"\\n      \"],[7,\"h1\",true],[10,\"class\",\"display-4 text-center mb-3\"],[8],[0,\"\\n        IZEA Gigs Early Access\\n      \"],[9],[0,\"\\n\\n      \"],[2,\" Form \"],[0,\"\\n      \"],[7,\"form\",false],[3,\"action\",[[23,0,[]],\"signIn\",[24,[\"model\"]]],[[\"on\"],[\"submit\"]]],[8],[0,\"\\n\\n        \"],[2,\" Email address \"],[0,\"\\n        \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n\\n          \"],[2,\" Label \"],[0,\"\\n          \"],[7,\"label\",true],[8],[0,\"Email Address\"],[9],[0,\"\\n\\n          \"],[2,\" Input \"],[0,\"\\n          \"],[1,[28,\"input\",null,[[\"value\",\"type\",\"class\",\"placeholder\"],[[24,[\"model\",\"email\"]],\"email\",\"form-control\",\"name@address.com\"]]],false],[0,\"\\n\\n        \"],[9],[0,\"\\n\\n        \"],[2,\" Password \"],[0,\"\\n        \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n\\n          \"],[7,\"div\",true],[10,\"class\",\"row\"],[8],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"col\"],[8],[0,\"\\n\\n              \"],[2,\" Label \"],[0,\"\\n              \"],[7,\"label\",true],[8],[0,\"Password\"],[9],[0,\"\\n\\n            \"],[9],[0,\"\\n          \"],[9],[0,\" \"],[2,\" / .row \"],[0,\"\\n\\n          \"],[2,\" Input group \"],[0,\"\\n          \"],[7,\"div\",true],[10,\"class\",\"input-group input-group-merge\"],[8],[0,\"\\n\\n            \"],[2,\" Input \"],[0,\"\\n            \"],[1,[28,\"input\",null,[[\"value\",\"type\",\"class\",\"placeholder\"],[[24,[\"model\",\"password\"]],\"password\",\"form-control form-control-appended\",\"Enter your password\"]]],false],[0,\"\\n\\n            \"],[2,\" Icon \"],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"input-group-append\"],[8],[0,\"\\n              \"],[7,\"span\",true],[10,\"class\",\"input-group-text\"],[8],[0,\"\\n                \"],[7,\"i\",true],[10,\"class\",\"fe fe-eye\"],[8],[9],[0,\"\\n              \"],[9],[0,\"\\n            \"],[9],[0,\"\\n\\n          \"],[9],[0,\"\\n        \"],[9],[0,\"\\n\\n        \"],[2,\" Early Access Code \"],[0,\"\\n        \"],[7,\"div\",true],[10,\"class\",\"form-group\"],[8],[0,\"\\n\\n          \"],[2,\" Label \"],[0,\"\\n          \"],[7,\"label\",true],[8],[0,\"Invite Code\"],[9],[0,\"\\n\\n          \"],[2,\" Input \"],[0,\"\\n          \"],[1,[28,\"input\",null,[[\"value\",\"class\"],[[24,[\"model\",\"inviteCode\"]],\"form-control\"]]],false],[0,\"\\n\\n        \"],[9],[0,\"\\n\\n        \"],[2,\" Submit \"],[0,\"\\n        \"],[7,\"button\",true],[10,\"class\",\"btn btn-lg btn-block btn-primary mb-3\"],[8],[0,\"\\n          Sign in\\n        \"],[9],[0,\"\\n\\n      \"],[9],[0,\"\\n\\n    \"],[9],[0,\"\\n    \"],[7,\"div\",true],[10,\"class\",\"col-12 col-md-7 col-lg-6 col-xl-8 d-none d-lg-block\"],[8],[0,\"\\n\\n      \"],[2,\" Image \"],[0,\"\\n      \"],[7,\"div\",true],[10,\"class\",\"bg-cover vh-100 mt-n1 mr-n3\"],[10,\"style\",\"background-image: url(images/cover.jpg);\"],[8],[9],[0,\"\\n\\n    \"],[9],[0,\"\\n  \"],[9],[0,\" \"],[2,\" / .row \"],[0,\"\\n\"],[9]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/early-entry.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/user", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "zNfPCpAx",
    "block": "{\"symbols\":[],\"statements\":[[7,\"header\",true],[8],[0,\"\\n  \"],[7,\"nav\",true],[10,\"class\",\"navbar navbar-expand-md navbar-light bg-light px-3\"],[8],[0,\"\\n    \"],[7,\"div\",true],[10,\"class\",\"container-fluid\"],[8],[0,\"\\n      \"],[7,\"a\",true],[10,\"class\",\"navbar-brand\"],[10,\"href\",\"#\"],[8],[0,\"IZEA Gigs\"],[9],[0,\"\\n\\n      \"],[7,\"button\",true],[10,\"class\",\"navbar-toggler\"],[10,\"data-toggle\",\"collapse\"],[10,\"data-target\",\"#navbarSupportedContent\"],[10,\"aria-controls\",\"navbarSupportedContent\"],[10,\"aria-expanded\",\"false\"],[10,\"aria-label\",\"Toggle navigation\"],[10,\"type\",\"button\"],[8],[0,\"\\n        \"],[7,\"span\",true],[10,\"class\",\"navbar-toggler-icon\"],[8],[9],[0,\"\\n      \"],[9],[0,\"\\n\\n      \"],[7,\"div\",true],[10,\"class\",\"collapse navbar-collapse\"],[10,\"id\",\"navbarSupportedContent\"],[8],[0,\"\\n        \"],[7,\"ul\",true],[10,\"class\",\"navbar-nav mr-auto\"],[8],[0,\"\\n          \"],[7,\"li\",true],[10,\"class\",\"nav-item\"],[8],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"avatar avatar-sm\"],[8],[0,\"\\n              \"],[7,\"img\",true],[11,\"src\",[29,[[24,[\"currentUser\",\"account\",\"avatarUrl\"]]]]],[10,\"alt\",\"...\"],[10,\"class\",\"avatar-img rounded-circle\"],[8],[9],[0,\"\\n            \"],[9],[0,\"\\n          \"],[9],[0,\"\\n          \"],[7,\"li\",true],[10,\"class\",\"nav-item dropdown\"],[8],[0,\"\\n            \"],[7,\"a\",true],[10,\"class\",\"nav-link dropdown-toggle\"],[10,\"href\",\"#\"],[10,\"id\",\"navbarDropdown\"],[10,\"role\",\"button\"],[10,\"data-toggle\",\"dropdown\"],[10,\"aria-haspopup\",\"true\"],[10,\"aria-expanded\",\"false\"],[8],[0,\"\\n              \"],[1,[24,[\"currentUser\",\"account\",\"name\"]],false],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"div\",true],[10,\"class\",\"dropdown-menu\"],[10,\"aria-labelledby\",\"navbarDropdown\"],[8],[0,\"\\n              \"],[7,\"a\",false],[12,\"class\",\"dropdown-item\"],[12,\"href\",\"#\"],[3,\"action\",[[23,0,[]],\"invalidateSession\"]],[8],[0,\"Logout\"],[9],[0,\"\\n            \"],[9],[0,\"\\n          \"],[9],[0,\"\\n        \"],[9],[0,\"\\n      \"],[9],[0,\"\\n    \"],[9],[0,\"\\n  \"],[9],[0,\"\\n\"],[9],[0,\"\\n\\n\"],[1,[22,\"outlet\"],false],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/user.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/user/gigs", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "OByGVyF8",
    "block": "{\"symbols\":[],\"statements\":[[1,[22,\"outlet\"],false]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/user/gigs.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/user/gigs/index", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "afMjws4D",
    "block": "{\"symbols\":[\"gig\"],\"statements\":[[7,\"section\",true],[10,\"class\",\"p-5\"],[8],[0,\"\\n  \"],[7,\"div\",true],[10,\"class\",\"header m-0\"],[8],[0,\"\\n    \"],[7,\"div\",true],[10,\"class\",\"header-body pt-0\"],[8],[0,\"\\n      \"],[7,\"div\",true],[10,\"class\",\"row align-items-center\"],[8],[0,\"\\n        \"],[7,\"div\",true],[10,\"class\",\"col\"],[8],[0,\"\\n\\n          \"],[7,\"h6\",true],[10,\"class\",\"header-pretitle\"],[8],[0,\"\\n            \"],[1,[24,[\"currentUser\",\"account\",\"name\"]],false],[0,\"'s\\n          \"],[9],[0,\"\\n\\n          \"],[7,\"h1\",true],[10,\"class\",\"header-title\"],[8],[0,\"\\n            Gigs\\n          \"],[9],[0,\"\\n\\n        \"],[9],[0,\"\\n        \"],[7,\"div\",true],[10,\"class\",\"col-auto\"],[8],[0,\"\\n\\n          \"],[5,\"link-to\",[[12,\"class\",\"btn btn-primary\"]],[[\"@route\"],[\"user.gigs.new\"]],{\"statements\":[[0,\"Create Gig\"]],\"parameters\":[]}],[0,\"\\n\\n        \"],[9],[0,\"\\n      \"],[9],[0,\"\\n\\n    \"],[9],[0,\"\\n  \"],[9],[0,\"\\n\\n\"],[4,\"if\",[[24,[\"model\"]]],null,{\"statements\":[[0,\"\\n    \"],[7,\"table\",true],[10,\"class\",\"table table-responsive\"],[8],[0,\"\\n      \"],[7,\"thead\",true],[10,\"class\",\"thead-light\"],[8],[0,\"\\n        \"],[7,\"tr\",true],[8],[0,\"\\n          \"],[7,\"th\",true],[10,\"scope\",\"col\"],[8],[0,\"\\n            \"],[7,\"a\",false],[12,\"href\",\"#\"],[3,\"action\",[[23,0,[]],\"onSort\",\"id\"]],[8],[0,\"ID\"],[9],[0,\"\\n          \"],[9],[0,\"\\n          \"],[7,\"th\",true],[10,\"scope\",\"col\"],[8],[0,\"\\n             \\n          \"],[9],[0,\"\\n          \"],[7,\"th\",true],[10,\"scope\",\"col\"],[8],[0,\"\\n            \"],[7,\"a\",false],[12,\"href\",\"#\"],[3,\"action\",[[23,0,[]],\"onSort\",\"title\"]],[8],[0,\"Title/Description\"],[9],[0,\"\\n          \"],[9],[0,\"\\n          \"],[7,\"th\",true],[10,\"scope\",\"col\"],[8],[0,\"\\n            Packages\\n          \"],[9],[0,\"\\n          \"],[7,\"th\",true],[10,\"scope\",\"col\"],[8],[0,\"\\n            Extras\\n          \"],[9],[0,\"\\n          \"],[7,\"th\",true],[10,\"scope\",\"col\"],[8],[0,\"\\n            Requirements\\n          \"],[9],[0,\"\\n          \"],[7,\"th\",true],[10,\"scope\",\"col\"],[8],[0,\"\\n            Samples\\n          \"],[9],[0,\"\\n          \"],[7,\"th\",true],[10,\"scope\",\"col\"],[8],[0,\"\\n            Faqs\\n          \"],[9],[0,\"\\n          \"],[7,\"th\",true],[10,\"scope\",\"col\"],[8],[0,\"\\n            \"],[7,\"a\",false],[12,\"href\",\"#\"],[3,\"action\",[[23,0,[]],\"onSort\",\"published\"]],[8],[0,\"Published\"],[9],[0,\"\\n          \"],[9],[0,\"\\n        \"],[9],[0,\"\\n      \"],[9],[0,\"\\n      \"],[7,\"tbody\",true],[8],[0,\"\\n\"],[4,\"each\",[[24,[\"model\"]]],null,{\"statements\":[[0,\"          \"],[7,\"tr\",true],[8],[0,\"\\n            \"],[7,\"th\",true],[10,\"scope\",\"row\"],[8],[0,\"\\n              \"],[1,[23,1,[\"id\"]],false],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"td\",true],[8],[0,\"\\n\"],[4,\"if\",[[23,1,[\"hasCoverImage\"]]],null,{\"statements\":[[0,\"                \"],[5,\"uploaded-file\",[],[[\"@uploadId\"],[[23,1,[\"coverImage\",\"attachment\",\"uploadId\"]]]]],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                \"],[5,\"default-cover-image\",[],[[\"@size\"],[\"lg\"]]],[0,\"\\n\"]],\"parameters\":[]}],[0,\"            \"],[9],[0,\"\\n            \"],[7,\"td\",true],[8],[0,\"\\n              \"],[7,\"h3\",true],[8],[1,[23,1,[\"title\"]],false],[9],[0,\"\\n              \"],[1,[23,1,[\"description\"]],false],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"td\",true],[10,\"class\",\"text-center\"],[8],[0,\"\\n              \"],[5,\"number-or-dash\",[],[[\"@number\"],[[23,1,[\"packagesCount\"]]]]],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"td\",true],[10,\"class\",\"text-center\"],[8],[0,\"\\n              \"],[5,\"number-or-dash\",[],[[\"@number\"],[[23,1,[\"extrasCount\"]]]]],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"td\",true],[10,\"class\",\"text-center\"],[8],[0,\"\\n              \"],[5,\"number-or-dash\",[],[[\"@number\"],[[23,1,[\"requirementsCount\"]]]]],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"td\",true],[10,\"class\",\"text-center\"],[8],[0,\"\\n              \"],[5,\"number-or-dash\",[],[[\"@number\"],[[23,1,[\"samplesCount\"]]]]],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"td\",true],[10,\"class\",\"text-center\"],[8],[0,\"\\n              \"],[5,\"number-or-dash\",[],[[\"@number\"],[[23,1,[\"faqsCount\"]]]]],[0,\"\\n            \"],[9],[0,\"\\n            \"],[7,\"td\",true],[8],[0,\"\\n              \"],[7,\"div\",true],[10,\"class\",\"btn-group\"],[8],[0,\"\\n                \"],[7,\"button\",true],[11,\"class\",[29,[\"btn btn-sm btn-\",[23,1,[\"publishedStyle\"]]]]],[10,\"type\",\"button\"],[8],[0,\"\\n\"],[4,\"if\",[[23,1,[\"published\"]]],null,{\"statements\":[[0,\"                    Published\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                    Draft\\n\"]],\"parameters\":[]}],[0,\"                \"],[9],[0,\"\\n                \"],[7,\"button\",true],[11,\"class\",[29,[\"btn btn-sm btn-\",[23,1,[\"publishedStyle\"]],\" dropdown-toggle dropdown-toggle-split\"]]],[10,\"data-toggle\",\"dropdown\"],[10,\"aria-haspopup\",\"true\"],[10,\"aria-expanded\",\"false\"],[10,\"type\",\"button\"],[8],[0,\"\\n                  \"],[7,\"span\",true],[10,\"class\",\"sr-only\"],[8],[0,\"Toggle Dropdown\"],[9],[0,\"\\n                \"],[9],[0,\"\\n                \"],[7,\"div\",true],[10,\"class\",\"dropdown-menu\"],[10,\"x-placement\",\"bottom-start\"],[10,\"style\",\"position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(70px, 41px, 0px);\"],[8],[0,\"\\n\"],[4,\"if\",[[23,1,[\"published\"]]],null,{\"statements\":[[0,\"                    \"],[7,\"a\",false],[12,\"href\",\"#\"],[12,\"class\",\"dropdown-item\"],[3,\"action\",[[23,0,[]],\"unpublishGig\",[23,1,[]]]],[8],[0,\"\\n                      Unpublish\\n                    \"],[9],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                    \"],[7,\"a\",false],[12,\"href\",\"#\"],[12,\"class\",\"dropdown-item\"],[3,\"action\",[[23,0,[]],\"publishGig\",[23,1,[]]]],[8],[0,\"\\n                      Publish\\n                    \"],[9],[0,\"\\n\"]],\"parameters\":[]}],[0,\"                  \"],[7,\"a\",true],[10,\"class\",\"dropdown-item\"],[10,\"href\",\"#\"],[8],[0,\"Edit (TODO TW-5)\"],[9],[0,\"\\n                \"],[9],[0,\"\\n              \"],[9],[0,\"\\n            \"],[9],[0,\"\\n          \"],[9],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"      \"],[9],[0,\"\\n    \"],[9],[0,\"\\n\\n    \"],[1,[28,\"page-numbers\",null,[[\"content\",\"showFL\"],[[24,[\"model\"]],true]]],false],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\n    \"],[7,\"div\",true],[10,\"class\",\"card\"],[8],[0,\"\\n      \"],[7,\"div\",true],[10,\"class\",\"card-body text-center\"],[8],[0,\"\\n        \"],[7,\"div\",true],[10,\"class\",\"row justify-content-center\"],[8],[0,\"\\n          \"],[7,\"div\",true],[10,\"class\",\"col-12 col-md-10 col-xl-8\"],[8],[0,\"\\n\\n            \"],[2,\" Image \"],[0,\"\\n            \"],[7,\"img\",true],[10,\"src\",\"assets/vendor/img/illustrations/happiness.svg\"],[10,\"alt\",\"...\"],[10,\"class\",\"img-fluid mt-n5 mb-4\"],[10,\"style\",\"max-width: 272px;\"],[8],[9],[0,\"\\n\\n            \"],[2,\" Title \"],[0,\"\\n            \"],[7,\"h2\",true],[8],[0,\"\\n              We released 2008 new versions of our theme to make the world a better place.\\n            \"],[9],[0,\"\\n\\n            \"],[2,\" Content \"],[0,\"\\n            \"],[7,\"p\",true],[10,\"class\",\"text-muted\"],[8],[0,\"\\n              This is a true story and totally not made up. This is going to be better in the long run but for now this is the way it is.\\n            \"],[9],[0,\"\\n\\n            \"],[2,\" Button \"],[0,\"\\n            \"],[7,\"a\",true],[10,\"href\",\"#!\"],[10,\"class\",\"btn btn-primary lift\"],[8],[0,\"\\n              Create a Gig (TODO)\\n            \"],[9],[0,\"\\n\\n          \"],[9],[0,\"\\n        \"],[9],[0,\" \"],[2,\" / .row \"],[0,\"\\n      \"],[9],[0,\"\\n    \"],[9],[0,\"\\n\\n\"]],\"parameters\":[]}],[9],[0,\"\\n\"]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/user/gigs/index.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/templates/user/gigs/new", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "pgZKzMcM",
    "block": "{\"symbols\":[],\"statements\":[[7,\"header\",true],[8],[0,\"\\n  \"],[7,\"nav\",true],[10,\"class\",\"navbar navbar-expand-md navbar-light bg-light px-3\"],[8],[0,\"\\n    \"],[7,\"div\",true],[10,\"class\",\"container-fluid\"],[8],[0,\"\\n      \"],[7,\"span\",true],[8],[0,\"\\n        Create Gig\\n      \"],[9],[0,\"\\n      \"],[7,\"span\",false],[3,\"action\",[[23,0,[]],\"doSetStep\",1]],[8],[0,\"\\n        \"],[7,\"span\",true],[11,\"class\",[29,[\"btn btn-sm btn-rounded-circle btn-\",[28,\"if\",[[24,[\"showStep1\"]],\"success\",\"white\"],null]]]],[8],[0,\"1\"],[9],[0,\"\\n        Listing Card\\n      \"],[9],[0,\"\\n      \"],[7,\"span\",false],[3,\"action\",[[23,0,[]],\"doSetStep\",2]],[8],[0,\"\\n        \"],[7,\"span\",true],[11,\"class\",[29,[\"btn btn-sm btn-rounded-circle btn-\",[28,\"if\",[[24,[\"showStep2\"]],\"success\",\"white\"],null]]]],[8],[0,\"2\"],[9],[0,\"\\n        Desc. & Packages\\n      \"],[9],[0,\"\\n      \"],[7,\"span\",false],[3,\"action\",[[23,0,[]],\"doSetStep\",3]],[8],[0,\"\\n        \"],[7,\"span\",true],[11,\"class\",[29,[\"btn btn-sm btn-rounded-circle btn-\",[28,\"if\",[[24,[\"showStep3\"]],\"success\",\"white\"],null]]]],[8],[0,\"3\"],[9],[0,\"\\n        Samples\\n      \"],[9],[0,\"\\n      \"],[7,\"span\",false],[3,\"action\",[[23,0,[]],\"doSetStep\",4]],[8],[0,\"\\n        \"],[7,\"span\",true],[11,\"class\",[29,[\"btn btn-sm btn-rounded-circle btn-\",[28,\"if\",[[24,[\"showStep4\"]],\"success\",\"white\"],null]]]],[8],[0,\"4\"],[9],[0,\"\\n        Requirements\\n      \"],[9],[0,\"\\n      \"],[7,\"span\",false],[3,\"action\",[[23,0,[]],\"doSetStep\",5]],[8],[0,\"\\n        \"],[7,\"span\",true],[11,\"class\",[29,[\"btn btn-sm btn-rounded-circle btn-\",[28,\"if\",[[24,[\"showStep5\"]],\"success\",\"white\"],null]]]],[8],[0,\"5\"],[9],[0,\"\\n        FAQ\\n      \"],[9],[0,\"\\n      \"],[7,\"span\",false],[3,\"action\",[[23,0,[]],\"doSetStep\",6]],[8],[0,\"\\n        \"],[7,\"span\",true],[11,\"class\",[29,[\"btn btn-sm btn-rounded-circle btn-\",[28,\"if\",[[24,[\"showStep6\"]],\"success\",\"white\"],null]]]],[8],[0,\"6\"],[9],[0,\"\\n        LAUNCH!\\n      \"],[9],[0,\"\\n    \"],[9],[0,\"\\n  \"],[9],[0,\"\\n\"],[9],[0,\"\\n\\n\"],[7,\"section\",true],[10,\"class\",\"p-5\"],[8],[0,\"\\n\\n  \"],[7,\"div\",true],[10,\"class\",\"container-fluid\"],[8],[0,\"\\n\"],[4,\"if\",[[24,[\"showStep1\"]]],null,{\"statements\":[[0,\"      \"],[5,\"gig-creation-step1\",[],[[\"@gig\",\"@sample\",\"@package\",\"@goToNextStep\"],[[22,\"gig\"],[22,\"sample\"],[22,\"package\"],[28,\"action\",[[23,0,[]],\"goToNextStep\"],null]]]],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[24,[\"showStep2\"]]],null,{\"statements\":[[0,\"      \"],[5,\"gig-creation-step2\",[],[[\"@gig\",\"@package\",\"@goToNextStep\"],[[22,\"gig\"],[22,\"package\"],[28,\"action\",[[23,0,[]],\"goToNextStep\"],null]]]],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[24,[\"showStep3\"]]],null,{\"statements\":[[0,\"      \"],[5,\"gig-creation-step3\",[],[[\"@gig\",\"@goToNextStep\"],[[22,\"gig\"],[28,\"action\",[[23,0,[]],\"goToNextStep\"],null]]]],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[24,[\"showStep4\"]]],null,{\"statements\":[[0,\"      \"],[5,\"gig-creation-step4\",[],[[\"@gig\",\"@goToNextStep\"],[[22,\"gig\"],[28,\"action\",[[23,0,[]],\"goToNextStep\"],null]]]],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[24,[\"showStep5\"]]],null,{\"statements\":[[0,\"      \"],[5,\"gig-creation-step5\",[],[[\"@gig\",\"@goToNextStep\"],[[22,\"gig\"],[28,\"action\",[[23,0,[]],\"goToNextStep\"],null]]]],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[24,[\"showStep6\"]]],null,{\"statements\":[[0,\"      \"],[5,\"gig-creation-step6\",[],[[\"@gig\"],[[22,\"gig\"]]]],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \"],[9],[0,\"\\n\\n\"],[9]],\"hasEval\":false}",
    "meta": {
      "moduleName": "turquoise-web/templates/user/gigs/new.hbs"
    }
  });

  _exports.default = _default;
});
;define("turquoise-web/transforms/array", ["exports", "ember-data/transform"], function (_exports, _transform) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _transform.default.extend({
    deserialize(serialized) {
      return serialized;
    },

    serialize(deserialized) {
      return deserialized;
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/transforms/object", ["exports", "ember-data/transform"], function (_exports, _transform) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = _transform.default.extend({
    deserialize(serialized) {
      return serialized;
    },

    serialize(deserialized) {
      return deserialized;
    }

  });

  _exports.default = _default;
});
;define("turquoise-web/utils/gig-categories", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.listingCategories = listingCategories;
  _exports.subCategoriesByListing = subCategoriesByListing;
  _exports.primaryActionBySubCategory = primaryActionBySubCategory;
  let categories = {
    "Design": {
      "Logos": ["design", "illustrate", "create", "make", "develop"],
      "Infographics": ["design", "illustrate", "create", "make", "develop"],
      "Illustration": ["design", "illustrate", "create", "make", "develop"],
      "Cartoons": ["design", "illustrate", "create", "make", "develop", "draw"]
    },
    "Photography": {
      "Product Photography": ["stage and shoot", "buy, stage, and shoot", "shoot", "create", "make"],
      "Food Photography": ["cook your recipe and shoot", "shoot", "create", "make"],
      "Modeling + Photography": ["model your product and shoot", "model your clothes and shoot", "shoot a model with your product", "shoot a model with your clothes", "shoot", "create", "make"],
      "Photoshop Editing": ["photoshop", "retouch", "transform", "manipulate", "remove the background", "face swap", "change the background", "remove", "highlight", "color correct", "enhance"]
    },
    "Audio": {
      "Full Song Production": ["write, compose, sing, and produce", "create", "develop", "make", "provide"],
      "Voice Overs": ["read", "create", "provide", "deliver", "record"],
      "Sound Effects": ["produce custom", "make", "create", "provide", "develop"],
      "Vocalists": ["sing", "create", "provide", "deliver", "record"],
      "Songwriters": ["write", "create", "develop", "deliver", "record"],
      "Vocal Tuning": ["tune", "modify", "enhance", "create", "develop", "deliver"],
      "Mastering": ["mix", "re-mix", "master", "mix and master", "create", "develop", "enhance"]
    },
    "Video": {
      "Full Video Production": ["shoot, edit, and master", "create", "develop", "make", "provide"],
      "Logo Animation": ["animate", "design", "create", "make", "develop"],
      "Social Video Ads": ["produce", "design", "create", "make", "develop"],
      "Animated GIFs": ["animate", "design", "create", "make", "develop"],
      "Video Editing": ["edit", "create", "provide", "deliver", "re-cut"],
      "Visual Effects": ["create", "produce", "develop", "make"]
    },
    "Writing": {
      "Blog Posts": ["write", "create", "make", "develop"],
      "Website Content": ["write", "create", "make", "develop"],
      "Press Releases": ["write", "create", "make", "develop"],
      "Translation": ["translate", "create", "make", "develop"],
      "Editing": ["edit", "refine", "improve", "enhance", "deliver"]
    },
    "Influencer": {
      "Instagram": ["do a sponsored post on Instagram", "create", "make", "develop", "produce"],
      "Facebook": ["do a sponsored post on Facebook", "create", "make", "develop", "produce"],
      "Snap": ["do a sponsored post on Snap", "create", "make", "develop", "produce"],
      "Twitter": ["do a sponsored post on Twitter", "create", "make", "develop", "produce"],
      "Tik-Tok": ["do a sponsored post on Tik-Tok", "create", "make", "develop", "produce"],
      "Twitch": ["do a sponsored post on Twitch", "create", "make", "develop", "produce"],
      "Blogs": ["do a sponsored post on Blogs", "create", "make", "develop", "produce"]
    }
  };

  function listingCategories() {
    let listings = [];

    for (var key in categories) {
      if (categories.hasOwnProperty(key)) {
        listings.push(key);
      }
    }

    return listings;
  }

  function subCategoriesByListing(listing) {
    let subCategories = [];
    let categoryListing = categories[listing];

    for (var key in categoryListing) {
      if (categoryListing.hasOwnProperty(key)) {
        subCategories.push(key);
      }
    }

    return subCategories;
  }

  function primaryActionBySubCategory(listing, subCategory) {
    return categories[listing][subCategory];
  }
});
;define("turquoise-web/utils/transparent-image", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  _exports.default = _default;
});
;

;define('turquoise-web/config/environment', [], function() {
  var prefix = 'turquoise-web';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

;
          if (!runningTests) {
            require("turquoise-web/app")["default"].create({"name":"turquoise-web","version":"0.1.0+224b192e"});
          }
        
//# sourceMappingURL=turquoise-web.map
