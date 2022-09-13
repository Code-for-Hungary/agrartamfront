var zIndexClassName = "ags-opened-choice-container";
var choiceParentClassName = "ags-form-row";

function addZIndexToChoiceParent(choiceEl) {
    choiceEl.parentNode
        .closest(`.${choiceParentClassName}`)
        .classList.add(zIndexClassName);
}

function removeZIndexFromChoiceParent(choiceEl) {
    choiceEl.parentNode
        .closest(`.${choiceParentClassName}`)
        .classList.remove(zIndexClassName);
}

document.addEventListener("alpine:init", () => {
    Alpine.data("searchForm", () => ({
        formData: {
            nev: null,
            isfirm: "",
            gender: null,
            irszam: null,
            varos: null,
            ev: [],
            megye: null,
            jogcim: [],
            alap: [],
            forras: [],
            cegcsoport: [],
            tamogatott: null,
            tamosszegtol: null,
            tamosszegig: null,
            evestamosszegtol: null,
            evestamosszegig: null,
        },
        lists: {
            evek: null,
            megyek: null,
            jogcimek: null,
            alapok: null,
            forrasok: null,
            cegcsoportok: null,
            tamogatottak: null,
            tamogatasosszeg: null,
            evestamogatasosszeg: null,
        },
        per_page: 15,
        submitText: "Keresés",
        submitting: false,
        exportText: "Export",
        exporting: false,
        detailedSearchOpened: false,
        resultData: [],
        resultMeta: null,
        resultLinks: null,
        resultLoaded: false,
        choicesOptions: {
            silent: false,
            allowHTML: false,
            removeItemButton: true,
            searchFloor: 4,
            searchResultLimit: 100,
            searchFields: ["label"],
            itemSelectText: "",
            loadingText: "Betöltés...",
            noResultsText: "Nincs találat",
            noChoicesText: "Nincs már mit kiválasztani",
            fuseOptions: {
                treshold: 0.0,
                minMatchCharLength: 4,
                ignoreLocation: true,
            },
        },
        reformatInputValue(e) {
            if (e.target.value !== "" && e.target.value !== "-") {
                e.target._x_model.set(
                    this.numToStr(this.strToNum(e.target.value))
                );
            }
        },
        restrictToNumbers(e) {
            if (
                !e.key.toString().match(/^\d+$/) &&
                !e.key
                    .toString()
                    .match(
                        /ArrowLeft|Delete|ArrowRight|Backspace|Home|End|Enter|Tab|-|F5|F1/
                    )
            ) {
                e.preventDefault();
            }
        },
        numToStr(num) {
            if (num !== null) {
                return num
                    .toString()
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")
                    .replace(".", ",");
            }
            return "";
        },
        strToNum(str) {
            let sanitized = str.replace(",", ".").split(" ").join(""),
                retval = parseFloat(sanitized);
            if (isNaN(retval)) {
                return null;
            }
            return retval;
        },
        isEmpty(val) {
            return (
                (Array.isArray(val) && val.length === 0) ||
                (!Array.isArray(val) &&
                    (val === null || val === undefined || val === ""))
            );
        },
        setTamosszegDefaults() {
            this.formData.tamosszegtol = this.numToStr(
                this.lists.tamogatasosszeg.min
            );
            this.formData.tamosszegig = this.numToStr(
                this.lists.tamogatasosszeg.max
            );
        },
        setEvestamosszegDefaults() {
            this.formData.evestamosszegtol = this.numToStr(
                this.lists.evestamogatasosszeg.min
            );
            this.formData.evestamosszegig = this.numToStr(
                this.lists.evestamogatasosszeg.max
            );
        },
        getLists() {
            this.$watch("detailedSearchOpened", (value) => {
                if (!value) {
                    this.formData.irszam = null;
                    this.formData.varos = null;
                    this.formData.ev = [];
                    this.formData.megye = null;
                    this.formData.jogcim = [];
                    this.formData.alap = [];
                    this.formData.forras = [];
                    this.formData.cegcsoport = [];
                    this.formData.tamogatott = null;
                    this.setTamosszegDefaults();
                    this.setEvestamosszegDefaults();
                }
            });
            this.$watch("per_page", () => {
                this.search(API_URL + "/api/search");
            });
            this.$watch("formData.isfirm", (value) => {
                if (value === "" || value === "1") {
                    this.formData.gender = "";
                }
            });
            fetch(API_URL + "/api/evs")
                .then((response) => response.json())
                .then((data) => (this.lists.evek = data.data))
                .then(() => {
                    this.$nextTick(() => {
                        let choices = new Choices(this.$refs.evSelect, {
                            silent: false,
                            allowHTML: false,
                            removeItemButton: true,
                            searchFloor: 4,
                            shouldSort: false,
                            itemSelectText: "",
                            loadingText: "Betöltés...",
                            noResultsText: "Nincs találat",
                            noChoicesText: "Nincs már mit kiválasztani",
                        });
                        let refreshChoices = () => {
                            choices.clearStore();
                            choices.setChoices(
                                this.lists.evek.map(({ ev }) => ({
                                    value: ev,
                                    label: ev.toString(),
                                    selected: this.formData.ev.includes(ev),
                                }))
                            );
                        };
                        refreshChoices();
                        this.$refs.evSelect.addEventListener("change", () => {
                            this.formData.ev = choices.getValue(true);
                        });
                        this.$watch("formData.ev", () => refreshChoices());
                        this.$watch("lists.evek", () => refreshChoices());
                    });
                });
            fetch(API_URL + "/api/megyes")
                .then((response) => response.json())
                .then((data) => (this.lists.megyek = data.data));
            fetch(API_URL + "/api/jogcims")
                .then((response) => response.json())
                .then((data) => (this.lists.jogcimek = data.data))
                .then(() => {
                    this.$nextTick(() => {
                        let choices = new Choices(
                            this.$refs.jogcimSelect,
                            this.choicesOptions
                        );
                        let refreshChoices = () => {
                            choices.clearStore();
                            choices.setChoices(
                                this.lists.jogcimek.map(({ id, name }) => ({
                                    value: id,
                                    label: name,
                                    selected: this.formData.jogcim.includes(id),
                                }))
                            );
                        };
                        refreshChoices();
                        this.$refs.jogcimSelect.addEventListener(
                            "showDropdown",
                            (e) => {
                                if ("parentIFrame" in window) {
                                    parentIFrame.size();
                                }
                                addZIndexToChoiceParent(e.target);
                            }
                        );
                        this.$refs.jogcimSelect.addEventListener(
                            "hideDropdown",
                            (e) => {
                                removeZIndexFromChoiceParent(e.target);
                            }
                        );
                        this.$refs.jogcimSelect.addEventListener(
                            "change",
                            () => {
                                this.formData.jogcim = choices.getValue(true);
                            }
                        );
                        this.$watch("formData.jogcim", () => refreshChoices());
                        this.$watch("lists.jogcimek", () => refreshChoices());
                    });
                });
            fetch(API_URL + "/api/alaps")
                .then((response) => response.json())
                .then((data) => (this.lists.alapok = data.data))
                .then(() => {
                    this.$nextTick(() => {
                        let choices = new Choices(
                            this.$refs.alapSelect,
                            this.choicesOptions
                        );
                        let refreshChoices = () => {
                            choices.clearStore();
                            choices.setChoices(
                                this.lists.alapok.map(({ id, name }) => ({
                                    value: id,
                                    label: name,
                                    selected: this.formData.alap.includes(id),
                                }))
                            );
                        };
                        refreshChoices();
                        this.$refs.alapSelect.addEventListener("change", () => {
                            this.formData.alap = choices.getValue(true);
                        });
                        this.$refs.alapSelect.addEventListener(
                            "showDropdown",
                            (e) => {
                                addZIndexToChoiceParent(e.target);
                            }
                        );
                        this.$refs.alapSelect.addEventListener(
                            "hideDropdown",
                            (e) => {
                                removeZIndexFromChoiceParent(e.target);
                            }
                        );
                        this.$watch("formData.alap", () => refreshChoices());
                        this.$watch("lists.alapok", () => refreshChoices());
                    });
                });
            fetch(API_URL + "/api/forras")
                .then((response) => response.json())
                .then((data) => (this.lists.forrasok = data.data))
                .then(() => {
                    this.$nextTick(() => {
                        let choices = new Choices(
                            this.$refs.forrasSelect,
                            this.choicesOptions
                        );
                        let refreshChoices = () => {
                            choices.clearStore();
                            choices.setChoices(
                                this.lists.forrasok.map(({ id, name }) => ({
                                    value: id,
                                    label: name,
                                    selected: this.formData.forras.includes(id),
                                }))
                            );
                        };
                        refreshChoices();
                        this.$refs.forrasSelect.addEventListener(
                            "change",
                            () => {
                                this.formData.forras = choices.getValue(true);
                            }
                        );
                        this.$refs.forrasSelect.addEventListener(
                            "showDropdown",
                            (e) => {
                                addZIndexToChoiceParent(e.target);
                            }
                        );
                        this.$refs.forrasSelect.addEventListener(
                            "hideDropdown",
                            (e) => {
                                removeZIndexFromChoiceParent(e.target);
                            }
                        );
                        this.$watch("formData.forras", () => refreshChoices());
                        this.$watch("lists.forrasok", () => refreshChoices());
                    });
                });
            fetch(API_URL + "/api/cegcsoports")
                .then((response) => response.json())
                .then((data) => (this.lists.cegcsoportok = data.data))
                .then(() => {
                    this.$nextTick(() => {
                        let choices = new Choices(
                            this.$refs.cegcsoportSelect,
                            this.choicesOptions
                        );
                        let refreshChoices = () => {
                            choices.clearStore();
                            choices.setChoices(
                                this.lists.cegcsoportok.map(({ id, name }) => ({
                                    value: id,
                                    label: name,
                                    selected:
                                        this.formData.cegcsoport.includes(id),
                                }))
                            );
                        };
                        refreshChoices();
                        this.$refs.cegcsoportSelect.addEventListener(
                            "change",
                            () => {
                                this.formData.cegcsoport =
                                    choices.getValue(true);
                            }
                        );
                        this.$refs.cegcsoportSelect.addEventListener(
                            "showDropdown",
                            (e) => {
                                addZIndexToChoiceParent(e.target);
                            }
                        );
                        this.$refs.cegcsoportSelect.addEventListener(
                            "hideDropdown",
                            (e) => {
                                removeZIndexFromChoiceParent(e.target);
                            }
                        );
                        this.$watch("formData.cegcsoport", () =>
                            refreshChoices()
                        );
                        this.$watch("lists.cegcsoportok", () =>
                            refreshChoices()
                        );
                    });
                });
            fetch(API_URL + "/api/tamogatotts")
                .then((response) => response.json())
                .then((data) => (this.lists.tamogatottak = data.data))
                .then(() => {
                    this.$nextTick(() => {
                        let choices = new Choices(
                            this.$refs.tamogatottSelect,
                            this.choicesOptions
                        );
                        let refreshChoices = () => {
                            choices.clearStore();
                            choices.setChoices(
                                this.lists.tamogatottak.map(
                                    ({ id, name, cim }) => ({
                                        value: id,
                                        label:
                                            name +
                                            (cim ? " (" + cim + ")" : ""),
                                        selected:
                                            this.formData.tamogatott === id,
                                    })
                                )
                            );
                        };
                        refreshChoices();
                        this.$refs.tamogatottSelect.addEventListener(
                            "showDropdown",
                            (e) => {
                                if ("parentIFrame" in window) {
                                    parentIFrame.size();
                                }
                                addZIndexToChoiceParent(e.target);
                            }
                        );
                        this.$refs.tamogatottSelect.addEventListener(
                            "hideDropdown",
                            (e) => {
                                removeZIndexFromChoiceParent(e.target);
                            }
                        );
                        this.$refs.tamogatottSelect.addEventListener(
                            "change",
                            () => {
                                this.formData.tamogatott =
                                    choices.getValue(true);
                            }
                        );
                        this.$watch("formData.tamogatott", () =>
                            refreshChoices()
                        );
                        this.$watch("lists.tamogatottak", () =>
                            refreshChoices()
                        );
                    });
                });
            fetch(API_URL + "/api/tamogatasosszeg")
                .then((response) => response.json())
                .then((data) => (this.lists.tamogatasosszeg = data.data))
                .then(() => {
                    this.$nextTick(() => {
                        noUiSlider.create(this.$refs.tamosszegSlider, {
                            start: [
                                this.lists.tamogatasosszeg.min,
                                this.lists.tamogatasosszeg.max,
                            ],
                            range: {
                                min: this.lists.tamogatasosszeg.min,
                                max: this.lists.tamogatasosszeg.max,
                            },
                            format: {
                                to: (value) => {
                                    return this.numToStr(value.toFixed(0));
                                },
                                from: (value) => {
                                    return this.strToNum(value);
                                },
                            },
                        });

                        this.setTamosszegDefaults();

                        this.$refs.tamosszegSlider.noUiSlider.on(
                            "change",
                            (values) => {
                                this.formData.tamosszegtol = values[0];
                                this.formData.tamosszegig = values[1];
                            }
                        );
                        this.$watch("formData.tamosszegtol", () => {
                            this.$refs.tamosszegSlider.noUiSlider.set([
                                this.formData.tamosszegtol,
                                null,
                            ]);
                        });
                        this.$watch("formData.tamosszegig", () => {
                            this.$refs.tamosszegSlider.noUiSlider.set([
                                null,
                                this.formData.tamosszegig,
                            ]);
                        });
                    });
                });
            fetch(API_URL + "/api/evestamogatasosszeg")
                .then((response) => response.json())
                .then((data) => (this.lists.evestamogatasosszeg = data.data))
                .then(() => {
                    this.$nextTick(() => {
                        noUiSlider.create(this.$refs.evestamosszegSlider, {
                            start: [
                                this.lists.evestamogatasosszeg.min,
                                this.lists.evestamogatasosszeg.max,
                            ],
                            range: {
                                min: this.lists.evestamogatasosszeg.min,
                                max: this.lists.evestamogatasosszeg.max,
                            },
                            format: {
                                to: (value) => {
                                    return this.numToStr(value.toFixed(0));
                                },
                                from: (value) => {
                                    return this.strToNum(value);
                                },
                            },
                        });

                        this.setEvestamosszegDefaults();

                        this.$refs.evestamosszegSlider.noUiSlider.on(
                            "change",
                            (values) => {
                                this.formData.evestamosszegtol = values[0];
                                this.formData.evestamosszegig = values[1];
                            }
                        );
                        this.$watch("formData.evestamosszegtol", () => {
                            this.$refs.evestamosszegSlider.noUiSlider.set([
                                this.formData.evestamosszegtol,
                                null,
                            ]);
                        });
                        this.$watch("formData.evestamosszegig", () => {
                            this.$refs.evestamosszegSlider.noUiSlider.set([
                                null,
                                this.formData.evestamosszegig,
                            ]);
                        });
                    });
                });
        },
        disableSubmitBtn() {
            this.submitText = "...";
            this.submitting = true;
        },
        resetSubmitBtn() {
            this.submitText = "Keresés";
            this.submitting = false;
        },
        disableExportBtn() {
            this.exportText = "...";
            this.exporting = true;
        },
        resetExportBtn() {
            this.exportText = "Export";
            this.exporting = false;
        },
        resetSubmitOsszeg(osszeg, hatar) {
            osszeg = this.strToNum(osszeg);
            if (osszeg === hatar) {
                osszeg = null;
            }
            return osszeg;
        },
        getSubmitableData() {
            let tosubmit = JSON.parse(JSON.stringify(this.formData));

            tosubmit.tamosszegtol = this.resetSubmitOsszeg(
                tosubmit.tamosszegtol,
                this.lists.tamogatasosszeg.min
            );

            tosubmit.tamosszegig = this.resetSubmitOsszeg(
                tosubmit.tamosszegig,
                this.lists.tamogatasosszeg.max
            );

            tosubmit.evestamosszegtol = this.resetSubmitOsszeg(
                tosubmit.evestamosszegtol,
                this.lists.evestamogatasosszeg.min
            );

            tosubmit.evestamosszegig = this.resetSubmitOsszeg(
                tosubmit.evestamosszegig,
                this.lists.evestamogatasosszeg.max
            );

            Object.keys(tosubmit).forEach((key) => {
                if (this.isEmpty(tosubmit[key])) {
                    delete tosubmit[key];
                }
            });
            return tosubmit;
        },
        submit() {
            this.search(API_URL + "/api/search");
        },
        search(url) {
            this.disableSubmitBtn();
            this.resultLoaded = false;
            let tosubmit = this.getSubmitableData();

            if (Object.keys(tosubmit).length === 0) {
                alert("Adjál meg szűrőket, ez így hosszú lesz");
                this.resetSubmitBtn();
            } else {
                tosubmit.per_page = this.per_page;
                let msg = "Valami baj történt";
                fetch(API_URL + "/api/count", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(tosubmit),
                })
                    .then((response) => response.json())
                    .then((respdata) => {
                        if (respdata.data.count >= MAX_RESULT_COUNT) {
                            msg = "Túl sok az eredmény: " + respdata.data.count;
                            return false;
                        }
                        if (respdata.data.count === 0) {
                            msg = "Nincs a keresésnek megfelelő adat";
                            return false;
                        }
                        return fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(tosubmit),
                        });
                    })
                    .then((response) => response.json())
                    .then((respdata) => {
                        this.resultData = respdata.data;
                        this.resultMeta = respdata.meta;
                        this.resultLinks = respdata.links;
                        this.resultMeta.links.shift();
                        this.resultMeta.links.pop();
                        this.resultLoaded = true;
                    })
                    .catch(() => {
                        alert(msg);
                    })
                    .finally(() => {
                        this.resetSubmitBtn();
                    });
            }
        },
        exportforedit() {
            this.disableExportBtn();
            let toexport = this.getSubmitableData();

            if (Object.keys(toexport).length === 0) {
                alert("Adjál meg szűrőket, ez így hosszú lesz");
                this.resetExportBtn();
            } else {
                toexport.per_page = this.per_page;
                let msg = "Valami baj történt";
                fetch(API_URL + "/api/count", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(toexport),
                })
                    .then((response) => response.json())
                    .then((respdata) => {
                        if (respdata.data.count >= MAX_RESULT_COUNT) {
                            msg = "Túl sok az eredmény: " + respdata.data.count;
                            return false;
                        }
                        if (respdata.data.count === 0) {
                            msg = "Nincs a keresésnek megfelelő adat";
                            return false;
                        }
                        return fetch(API_URL + "/api/exportforedit", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(toexport),
                        });
                    })
                    .then((response) => response.json())
                    .then((respdata) => {
                        this.resetExportBtn();
                        window.location = respdata.data;
                    })
                    .catch(() => {
                        alert(msg);
                    })
                    .finally(() => {
                        this.resetExportBtn();
                    });
            }
        },
    }));
});
