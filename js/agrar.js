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
            tamosszegtol: 0,
            tamosszegig: 0,
            evestamosszegtol: 0,
            evestamosszegig: 0,
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
        },
        submitText: "Keresés",
        submitting: false,
        detailedSearchOpened: false,
        getLists() {
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
                                this.lists.evek.map(({ev}) => ({
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
                        let choices = new Choices(this.$refs.jogcimSelect, {
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
                        });
                        let refreshChoices = () => {
                            choices.clearStore();
                            choices.setChoices(
                                this.lists.jogcimek.map(({id, name}) => ({
                                    value: id,
                                    label: name,
                                    selected: this.formData.jogcim.includes(id),
                                }))
                            );
                        };
                        refreshChoices();
                        this.$refs.jogcimSelect.addEventListener("showDropdown", (e) => {
                            if ("parentIFrame" in window) {
                                parentIFrame.size();
                            }
                            addZIndexToChoiceParent(e.target);
                        });
                        this.$refs.jogcimSelect.addEventListener("hideDropdown", (e) => {
                            removeZIndexFromChoiceParent(e.target);
                        });
                        this.$refs.jogcimSelect.addEventListener("change", () => {
                            this.formData.jogcim = choices.getValue(true);
                        });
                        this.$watch("formData.jogcim", () => refreshChoices());
                        this.$watch("lists.jogcimek", () => refreshChoices());
                    });
                });
            fetch(API_URL + "/api/alaps")
                .then((response) => response.json())
                .then((data) => (this.lists.alapok = data.data))
                .then(() => {
                    this.$nextTick(() => {
                        let choices = new Choices(this.$refs.alapSelect, {
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
                        });
                        let refreshChoices = () => {
                            choices.clearStore();
                            choices.setChoices(
                                this.lists.alapok.map(({id, name}) => ({
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
                        this.$refs.alapSelect.addEventListener("showDropdown", (e) => {
                            addZIndexToChoiceParent(e.target);
                        });
                        this.$refs.alapSelect.addEventListener("hideDropdown", (e) => {
                            removeZIndexFromChoiceParent(e.target);
                        });
                        this.$watch("formData.alap", () => refreshChoices());
                        this.$watch("lists.alapok", () => refreshChoices());
                    });
                });
            fetch(API_URL + "/api/forras")
                .then((response) => response.json())
                .then((data) => (this.lists.forrasok = data.data))
                .then(() => {
                    this.$nextTick(() => {
                        let choices = new Choices(this.$refs.forrasSelect, {
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
                        });
                        let refreshChoices = () => {
                            choices.clearStore();
                            choices.setChoices(
                                this.lists.forrasok.map(({id, name}) => ({
                                    value: id,
                                    label: name,
                                    selected: this.formData.forras.includes(id),
                                }))
                            );
                        };
                        refreshChoices();
                        this.$refs.forrasSelect.addEventListener("change", () => {
                            this.formData.forras = choices.getValue(true);
                        });
                        this.$refs.forrasSelect.addEventListener("showDropdown", (e) => {
                            addZIndexToChoiceParent(e.target);
                        });
                        this.$refs.forrasSelect.addEventListener("hideDropdown", (e) => {
                            removeZIndexFromChoiceParent(e.target);
                        });
                        this.$watch("formData.forras", () => refreshChoices());
                        this.$watch("lists.forrasok", () => refreshChoices());
                    });
                });
            fetch(API_URL + "/api/cegcsoports")
                .then((response) => response.json())
                .then((data) => (this.lists.cegcsoportok = data.data))
                .then(() => {
                    this.$nextTick(() => {
                        let choices = new Choices(this.$refs.cegcsoportSelect, {
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
                        });
                        let refreshChoices = () => {
                            choices.clearStore();
                            choices.setChoices(
                                this.lists.cegcsoportok.map(({id, name}) => ({
                                    value: id,
                                    label: name,
                                    selected: this.formData.cegcsoport.includes(id),
                                }))
                            );
                        };
                        refreshChoices();
                        this.$refs.cegcsoportSelect.addEventListener("change", () => {
                            this.formData.cegcsoport = choices.getValue(true);
                        });
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
                        this.$watch("formData.cegcsoport", () => refreshChoices());
                        this.$watch("lists.cegcsoportok", () => refreshChoices());
                    });
                });
            fetch(API_URL + "/api/tamogatotts")
                .then((response) => response.json())
                .then((data) => (this.lists.tamogatottak = data.data))
                .then(() => {
                    this.$nextTick(() => {
                        let choices = new Choices(this.$refs.tamogatottSelect, {
                            silent: false,
                            allowHTML: false,
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
                        });
                        let refreshChoices = () => {
                            choices.clearStore();
                            choices.setChoices(
                                this.lists.tamogatottak.map(({id, name, cim}) => ({
                                    value: id,
                                    label: name + (cim ? " (" + cim + ")" : ""),
                                    selected: this.formData.tamogatott === id,
                                }))
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
                        this.$refs.tamogatottSelect.addEventListener("change", () => {
                            this.formData.tamogatott = choices.getValue(true);
                        });
                        this.$watch("formData.tamogatott", () => refreshChoices());
                        this.$watch("lists.tamogatottak", () => refreshChoices());
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
                        });

                        this.formData.tamosszegtol = this.lists.tamogatasosszeg.min;
                        this.formData.tamosszegig = this.lists.tamogatasosszeg.max;

                        this.$refs.tamosszegSlider.noUiSlider.on("change", (values) => {
                            this.formData.tamosszegtol = values[0];
                            this.formData.tamosszegig = values[1];
                        });
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
        },
        disableSubmitBtn() {
            this.submitText = "...";
            this.submitting = true;
        },
        resetSubmitBtn() {
            this.submitText = "Keresés";
            this.submitting = false;
        },
        getSubmitableData() {
            let tosubmit = JSON.parse(JSON.stringify(this.formData));
            if (tosubmit.tamosszegtol === this.lists.tamogatasosszeg.min) {
                tosubmit.tamosszegtol = null;
            }
            if (tosubmit.tamosszegig === this.lists.tamogatasosszeg.max) {
                tosubmit.tamosszegig = null;
            }
            return tosubmit;
        },
        submit() {
            this.disableSubmitBtn();
            let ures = true,
                tosubmit = this.getSubmitableData();
            Object.keys(tosubmit).forEach((key) => {
                if (
                    (Array.isArray(tosubmit[key]) && tosubmit[key].length) ||
                    (!Array.isArray(tosubmit[key]) && tosubmit[key])
                ) {
                    ures = false;
                }
            });
            if (ures) {
                alert("Adjál meg szűrőket, ez így hosszú lesz");
                this.resetSubmitBtn();
            } else {
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
                            alert("Túl sok az eredmény: " + respdata.data.count);
                            this.resetSubmitBtn();
                            return false;
                        }
                        alert("Az eredmény: " + respdata.data.count);
                        /*
                                                return fetch(API_URL + '/api/search', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify(this.formData)
                                                });
                                                 */
                    })
                    .catch(() => {
                        alert("Something went wrong");
                    })
                    .finally(() => {
                        this.resetSubmitBtn();
                    });
            }
        },
        exportforedit() {
            fetch(API_URL + "/api/exportforedit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.getSubmitableData()),
            })
                .then((response) => response.json())
                .then((respdata) => {
                    console.log(respdata.data);
                    window.location = respdata.data;
                })
                .catch(() => {
                    alert("Something went wrong");
                });
        },
    }));
});
