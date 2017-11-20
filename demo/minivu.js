
/**
 * miniVU
 * A minimalistic HTML/JS view engine
 * Author: Shawn McLaughlin <shawnmcdev@gmail.com>
 * Website: https://github.com/shawnmcla/miniVU
 */
class miniVU {

    /**
     * Constructor. Initializes miniVU with the target element to append views to.
     * @param {string} targetElementSelector - Class or ID selector to use as the content area.
     * @param {string} defaultView - Default view name for the webpage, usually the "homepage". Displayed when no #/ hash is present
     * @param {Object} config - Used to configure miniVU. See documentation for details.
     */
    constructor(targetElementSelector, defaultView = null, config = {}) {
        this.VERSION = "beta 1.0";
        this.TITLE_PLACEHOLDER = "{{miniVU title}}";
        this.DEFAULT_NOT_FOUND = "<h1>404 not found</h1>";
        this.ERROR_MSGS = {
            "GENERIC_HELP": "For more help and documentation, see https://github.com/shawnmcla/miniVU",
            "INVALID_SELECTOR": "The targetElementSelector parameter must be a non-empty string selector. (e.g. #idSelector, .classSelector)",
            "ELEMENT_NOT_FOUND": "The targetElementSelector passed cannot be found in the DOM.",
            "VIEW_NOT_FOUND": "The associated HTML document for the view specified could not be found. Check that the file exists and is in the correct directory.",
            "NO_DEFAULT_VIEW": "No default view was specified. Specifying a default view is strongly recommended. To specify a default view, pass the view name as the second argument when instantiating miniVU."
        };
        this.CONFIG = {
            "viewsDir": "./views",
            "changeTitle": false,
            "titlePattern": "{{miniVU title}}",
            "customNotFound": null,
            "customTitles": null,
        };

        this.ready = false;
        this.currentView = null;
        this.targetArea = null;
        this.defaultView = defaultView;

        if (Object.keys(config).length !== 0) {
            this.loadConfig(config);
        }

        let element;

        if (targetElementSelector !== null && typeof (targetElementSelector == String)) {
            if (targetElementSelector[0] === ".") { // If selector is a class selector
                element = document.getElementsByClassName(targetElementSelector.substr(1))[0];
            } else if (targetElementSelector[0] === "#") { // If selector is an ID selector
                element = document.getElementById(targetElementSelector.substr(1));
            }
            else {
                this.errorInvalidSelector();
            }
            if (element) {
                this.targetArea = element;
                this.ready = true;
            }
            else {
                this.errorTargetNotFound();
            }
        } else {
            this.errorInvalidSelector();
        }

        window.addEventListener('hashchange', (e) => this.handleHashChange(e, location.hash));
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.isView) {
                this.go(e.state.viewName);
            }
        });

        if (this.ready) {
            this.onLoad();
        }
    }

    /** Iterate through passed config keys and assigns their values to the config object if a match is found */
    loadConfig(config) {
        Object.keys(config).forEach((key) => {
            if (this.CONFIG.hasOwnProperty(key)) {
                this.CONFIG[key] = config[key];
                console.info(`Set config ${key} to ${config[key]}`);
            } else {
                console.error("Invalid config key: " + key + ". Ignoring.");
            }
        });
    }

    /** Push view data to history to ensure BACK and FORWARD button functionality */
    pushState(viewName) {
        history.replaceState({ isView: true, viewName: viewName }, null, viewName === this.defaultView ? "" : "#/" + viewName);
    }

    /** Called when a hash change is detected */
    handleHashChange(e, hash) {
        e.preventDefault();
        if (this.isMiniVUHash(hash)) {
            let viewName = hash.substr(2);
            if (viewName === "") {
                this.loadDefaultView();
            } else {
                this.go(viewName);
            }
        }
    }

    /** Load the specified default view */
    loadDefaultView() {
        if (this.defaultView !== null) {
            this.go(this.defaultView, null, true);
        } else {
            console.info(ERROR_MSGS.NO_DEFAULT_VIEW);
        }
    }

    /** Called once miniVU is "ready" */
    onLoad() {
        console.log("Intialized miniVU version " + this.VERSION);
        let hash = location.hash;
        if (this.isMiniVUHash(hash)) {
            let viewName = hash.substr(2);
            if (viewName !== "") {
                this.go(viewName);
                return;
            }
        }
        this.loadDefaultView();
        return;
    }

    /** Returns true if the hash begins with "#/" */
    isMiniVUHash(hash) {
        return hash && hash.substr(0, 2) == "#/";
    }

    /** Loads an HTML document from the filename given and returns a promise which resolves with the HTML document */
    loadHTMLContent(fileName) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) { // 200: HTTP OK
                        resolve(xhr.response);
                    } else {
                        reject(xhr.statusText);
                    }
                }
            };

            xhr.onerror = function (e) {
                reject(xhr.statusText);
            };

            xhr.open("GET", this.CONFIG.viewsDir + "/" + fileName, true);
            xhr.responseType = "document";
            xhr.send();
        });
    }

    /** Clear the target area to make space for the new content */
    clearContent() {
        while (this.targetArea.firstChild) {
            this.targetArea.removeChild(this.targetArea.firstChild);
        }
    }
    /** Append the nodes of the newly loaded content to the target area */
    appendContent(content) {
        console.log(content);
        //content.forEach((node) => this.targetArea.appendChild(node));
        Array.prototype.forEach.call(content, (node) => this.targetArea.appendChild(node))
    }
    /** Append the raw HTML text to the target area */
    appendRaw(html) {
        this.targetArea.innerHTML = html;
    }
    /** Strips the content from body of the document returned */
    stripContent(doc) {
        return doc.body.childNodes;
    }
    /** Takes HTML content, makes a call to clear the target area and then a call to append the new content. */
    swapContent(view, content, raw = false) {
        this.clearContent();
        if (raw) {
            this.appendRaw(content);
        } else {
            this.appendContent(this.stripContent(content));
        }
        this.currentView = view;
        if (this.CONFIG.changeTitle) {
            let title = view;
            if (this.CONFIG.customTitles) {
                if (this.CONFIG.customTitles.hasOwnProperty(view)) {
                    title = this.CONFIG.customTitles[view];
                }
            }
            document.title = this.CONFIG.titlePattern.replace(this.TITLE_PLACEHOLDER, title);
        }
        this.pushState(view);
    }

    /** Initiate the view changing process */
    go(view, file) {
        if (view === null) {
            console.error("Tried to load 'null' view. Did you set the default view?");
        }
        if (view === this.customNotFound && is404) {
            this.swapContent("404", this.DEFAULT_NOT_FOUND, true);
        }
        if (view !== this.currentView) {
            this.loadHTMLContent(view + ".html")
                .then((doc) => this.swapContent(view, doc))
                .catch((err) => this.errorViewNotfound(view, err));
        }
    }

    /** Error display functions. Prints a console.error message. */
    errorInvalidSelector(targetElementSelector) {
        console.error(this.ERROR_MSGS.INVALID_SELECTOR);
    }
    errorTargetNotFound(targetElementSelector) {
        console.error(this.ERROR_MSGS.ELEMENT_NOT_FOUND);
    }
    errorViewNotfound(view, err) {
        console.error(this.ERROR_MSGS.VIEW_NOT_FOUND + " View name: " + view + ", Views directory: " + this.CONFIG.viewsDir, err);
        /** Display default or custom "Not Found" page depending on config. */
        if (this.CONFIG.customNotFound && view != this.CONFIG.customNotFound) {
            this.go(this.CONFIG.customNotFound, null, true);
        } else {
            this.swapContent("404", this.DEFAULT_NOT_FOUND, true);
        }
    }
}
